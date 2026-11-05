import BloodDonationRequest from '../models/BloodDonationRequest.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Create blood donation request
// @route   POST /api/blood-donations
// @access  Private
export const createBloodRequest = async (req, res) => {
  try {
    const { patientName, bloodGroup, unitsNeeded, hospitalName, address, city, lat, lng, urgency, contactPerson, contactPhone, additionalNotes } = req.body;

    // Check count of potential matching donors
    const matchedDonors = await User.countDocuments({
      isBloodDonor: true,
      bloodGroup: bloodGroup,
    });

    const newBloodReq = await BloodDonationRequest.create({
      patientName,
      bloodGroup,
      unitsNeeded: Number(unitsNeeded) || 1,
      hospitalName,
      hospitalAddress: {
        address: address || 'General Hospital, Ward 3',
        city: city || req.user.city || 'Metropolis',
        lat: lat ? parseFloat(lat) : 28.6139 + (Math.random() - 0.5) * 0.04,
        lng: lng ? parseFloat(lng) : 77.2090 + (Math.random() - 0.5) * 0.04,
      },
      urgency: urgency || 'Urgent',
      contactPerson,
      contactPhone,
      additionalNotes: additionalNotes || '',
      createdBy: req.user._id,
      matchedDonorsCount: matchedDonors,
      adminApproved: req.user.role === 'admin', // Auto-approved if created by admin, else pending
      status: req.user.role === 'admin' ? 'Active' : 'Pending Approval',
    });

    // Notify admins
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      title: `URGENT: Blood Request for ${bloodGroup}`,
      message: `${unitsNeeded} unit(s) of ${bloodGroup} required at ${hospitalName} (${urgency} priority)`,
      type: 'blood_request',
      link: '/blood-donations',
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return res.status(201).json({
      success: true,
      message: 'Blood request registered. Admin verification is in progress.',
      disclaimer: 'Disclaimer: LifeLink coordinates volunteer donor connections and does not replace certified hospitals, blood banks, or transfusion authorities.',
      data: newBloodReq,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all blood donation requests (Sanitized for public privacy)
// @route   GET /api/blood-donations
// @access  Public
export const getAllBloodRequests = async (req, res) => {
  try {
    const { bloodGroup, status, urgency } = req.query;
    let query = {};

    if (bloodGroup && bloodGroup !== 'all') {
      query.bloodGroup = bloodGroup;
    }
    if (status && status !== 'all') {
      query.status = status;
    } else if (!req.user || req.user.role !== 'admin') {
      // Normal users see Active and Fulfilled requests
      query.status = { $in: ['Active', 'Fulfilled'] };
    }
    if (urgency && urgency !== 'all') {
      query.urgency = urgency;
    }

    let requests = await BloodDonationRequest.find(query)
      .populate('createdBy', 'name city')
      .sort({ createdAt: -1 });

    // Protect sensitive contact phone for unauthenticated public viewers; only show partial contact
    const sanitized = requests.map((item) => {
      const obj = item.toObject();
      if (!req.user) {
        obj.contactPhone = 'Hidden - Sign in to view coordination contact';
      }
      return obj;
    });

    return res.status(200).json({
      success: true,
      count: sanitized.length,
      disclaimer: 'LifeLink facilitates volunteer blood donor coordination. Always verify directly with hospital blood banks before proceeding.',
      data: sanitized,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve blood donation request (Admin)
// @route   PUT /api/blood-donations/:id/approve
// @access  Private (Admin)
export const approveBloodRequest = async (req, res) => {
  try {
    const bloodReq = await BloodDonationRequest.findById(req.params.id);
    if (!bloodReq) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    bloodReq.adminApproved = true;
    bloodReq.status = 'Active';
    bloodReq.verifiedBy = req.user._id;
    await bloodReq.save();

    // Alert matching registered blood donors in the area
    const matchingDonors = await User.find({
      isBloodDonor: true,
      bloodGroup: bloodReq.bloodGroup,
    });

    const donorNotifications = matchingDonors.map((donor) => ({
      recipient: donor._id,
      title: `Blood Donor Match Needed: ${bloodReq.bloodGroup}`,
      message: `A verified emergency request for ${bloodReq.bloodGroup} at ${bloodReq.hospitalName} matches your donor profile.`,
      type: 'blood_request',
      link: '/blood-donations',
    }));

    if (donorNotifications.length > 0) {
      await Notification.insertMany(donorNotifications);
    }

    return res.status(200).json({
      success: true,
      message: `Blood request approved and active. ${donorNotifications.length} matching donors alerted.`,
      data: bloodReq,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update blood donation status (Fulfilled / Closed)
// @route   PUT /api/blood-donations/:id/status
// @access  Private (Admin / Creator)
export const updateBloodRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bloodReq = await BloodDonationRequest.findById(req.params.id);

    if (!bloodReq) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    bloodReq.status = status;
    await bloodReq.save();

    return res.status(200).json({
      success: true,
      message: `Blood request marked as ${status}`,
      data: bloodReq,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get registered blood donors (Admin / Privacy Protected)
// @route   GET /api/blood-donations/donors
// @access  Private
export const getRegisteredDonors = async (req, res) => {
  try {
    const { bloodGroup } = req.query;
    let query = { isBloodDonor: true };
    if (bloodGroup && bloodGroup !== 'all') {
      query.bloodGroup = bloodGroup;
    }

    // Only Admins get full contact number. Normal users get anonymized donor counts / badges.
    const donors = await User.find(query).select('name city bloodGroup isBloodDonor createdAt phone');

    const sanitizedDonors = donors.map((d) => {
      const obj = d.toObject();
      if (req.user.role !== 'admin') {
        obj.phone = 'Protected by LifeLink Privacy';
        obj.name = `${obj.name.split(' ')[0]} (Verified Donor)`;
      }
      return obj;
    });

    return res.status(200).json({
      success: true,
      count: sanitizedDonors.length,
      data: sanitizedDonors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
