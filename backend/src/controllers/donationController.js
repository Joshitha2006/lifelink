import Donation from '../models/Donation.js';
import ResourceRequest from '../models/ResourceRequest.js';
import Notification from '../models/Notification.js';

// @desc    Create a resource donation
// @route   POST /api/donations
// @access  Private
export const createDonation = async (req, res) => {
  try {
    const { title, category, quantity, unit, address, city, lat, lng, expiryDate, notes, imageUrl } = req.body;

    let image = imageUrl || '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const donation = await Donation.create({
      donor: req.user._id,
      title,
      category,
      quantity: Number(quantity),
      unit: unit || 'items',
      pickupLocation: {
        address: address || 'Community Center',
        city: city || req.user.city || 'Metropolis',
        lat: lat ? parseFloat(lat) : 28.6139 + (Math.random() - 0.5) * 0.05,
        lng: lng ? parseFloat(lng) : 77.2090 + (Math.random() - 0.5) * 0.05,
      },
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      notes: notes || '',
      image,
      status: 'Available',
    });

    return res.status(201).json({
      success: true,
      message: 'Donation listed successfully! Thank you for supporting the community.',
      data: donation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all available donations (with filtering)
// @route   GET /api/donations
// @access  Public
export const getAllDonations = async (req, res) => {
  try {
    const { category, status, search, city } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = 'Available';
    }
    if (city && city !== 'all') {
      query['pickupLocation.city'] = new RegExp(city, 'i');
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
      ];
    }

    const donations = await Donation.find(query)
      .populate('donor', 'name city avatar phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get donations by current user
// @route   GET /api/donations/my
// @access  Private
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Request a resource / donation item
// @route   POST /api/donations/:id/request
// @access  Private
export const requestResource = async (req, res) => {
  try {
    const { requestedQuantity, reason } = req.body;
    const donation = await Donation.findById(req.params.id).populate('donor');

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    if (donation.quantity < Number(requestedQuantity)) {
      return res.status(400).json({
        success: false,
        message: `Only ${donation.quantity} ${donation.unit} available`,
      });
    }

    const resourceRequest = await ResourceRequest.create({
      requester: req.user._id,
      donation: donation._id,
      requestedQuantity: Number(requestedQuantity),
      reason,
      status: 'Pending',
    });

    // Notify donor
    await Notification.create({
      recipient: donation.donor._id,
      title: 'Resource Requested',
      message: `${req.user.name} requested ${requestedQuantity} ${donation.unit} of "${donation.title}". Reason: ${reason}`,
      type: 'request',
      link: '/resources',
    });

    return res.status(201).json({
      success: true,
      message: 'Resource request submitted for approval',
      data: resourceRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all resource requests for my donations (or admin)
// @route   GET /api/donations/requests
// @access  Private
export const getResourceRequests = async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'admin') {
      requests = await ResourceRequest.find()
        .populate('requester', 'name email phone city')
        .populate({ path: 'donation', populate: { path: 'donor', select: 'name email phone' } })
        .sort({ createdAt: -1 });
    } else {
      // Find donations belonging to this donor
      const myDonations = await Donation.find({ donor: req.user._id }).select('_id');
      const donationIds = myDonations.map((d) => d._id);

      requests = await ResourceRequest.find({
        $or: [{ requester: req.user._id }, { donation: { $in: donationIds } }],
      })
        .populate('requester', 'name email phone city')
        .populate({ path: 'donation', populate: { path: 'donor', select: 'name email phone' } })
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve or reject resource request
// @route   PUT /api/donations/requests/:id
// @access  Private (Donor or Admin)
export const updateResourceRequestStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const resourceReq = await ResourceRequest.findById(req.params.id).populate('donation');

    if (!resourceReq) {
      return res.status(404).json({ success: false, message: 'Resource request not found' });
    }

    resourceReq.status = status;
    resourceReq.notes = notes || '';
    resourceReq.approvedBy = req.user._id;
    await resourceReq.save();

    // If approved, deduct quantity
    if (status === 'Approved' || status === 'Fulfilled') {
      const donation = await Donation.findById(resourceReq.donation._id);
      if (donation) {
        donation.quantity = Math.max(0, donation.quantity - resourceReq.requestedQuantity);
        if (donation.quantity === 0) {
          donation.status = 'Claimed';
        }
        await donation.save();
      }
    }

    // Notify requester
    await Notification.create({
      recipient: resourceReq.requester,
      title: `Resource Request ${status}`,
      message: `Your request for "${resourceReq.donation.title}" has been marked as ${status}.`,
      type: 'status_update',
      link: '/resources',
    });

    return res.status(200).json({
      success: true,
      message: `Resource request updated to ${status}`,
      data: resourceReq,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a donation
// @route   DELETE /api/donations/:id
// @access  Private
export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (req.user.role !== 'admin' && donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Donation.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Donation removed successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
