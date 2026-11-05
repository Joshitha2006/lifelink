import User from '../models/User.js';
import VolunteerProfile from '../models/VolunteerProfile.js';
import HelpRequest from '../models/HelpRequest.js';
import Donation from '../models/Donation.js';
import BloodDonationRequest from '../models/BloodDonationRequest.js';
import SupportCenter from '../models/SupportCenter.js';

// @desc    Get Admin Dashboard Stats & Analytics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCitizens = await User.countDocuments({ role: 'citizen' });
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const verifiedVolunteers = await VolunteerProfile.countDocuments({ isApprovedByAdmin: true });

    const totalHelpRequests = await HelpRequest.countDocuments();
    const pendingRequests = await HelpRequest.countDocuments({ status: 'Pending' });
    const verifiedRequests = await HelpRequest.countDocuments({ status: 'Verified' });
    const inProgressRequests = await HelpRequest.countDocuments({ status: { $in: ['Volunteer Assigned', 'In Progress'] } });
    const completedRequests = await HelpRequest.countDocuments({ status: 'Completed' });

    const availableResources = await Donation.countDocuments({ status: 'Available' });
    const activeBloodRequests = await BloodDonationRequest.countDocuments({ status: 'Active' });
    const totalCenters = await SupportCenter.countDocuments();

    // Requests by category
    const categoryStats = await HelpRequest.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Priority breakdown
    const priorityStats = await HelpRequest.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Monthly trends (mocked/aggregated over last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const monthlyTrends = [
      { month: monthNames[(currentMonth - 4 + 12) % 12], requests: 18, resolved: 14, volunteers: 8 },
      { month: monthNames[(currentMonth - 3 + 12) % 12], requests: 29, resolved: 25, volunteers: 15 },
      { month: monthNames[(currentMonth - 2 + 12) % 12], requests: 42, resolved: 38, volunteers: 24 },
      { month: monthNames[(currentMonth - 1 + 12) % 12], requests: 35, resolved: 31, volunteers: 30 },
      { month: monthNames[currentMonth], requests: totalHelpRequests, resolved: completedRequests, volunteers: totalVolunteers },
    ];

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCitizens,
        totalVolunteers,
        verifiedVolunteers,
        totalHelpRequests,
        pendingRequests,
        verifiedRequests,
        inProgressRequests,
        completedRequests,
        availableResources,
        activeBloodRequests,
        totalCenters,
        categoryStats,
        priorityStats,
        monthlyTrends,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users for Admin management
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsersAdmin = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify or toggle verification of a user
// @route   PUT /api/admin/users/:id/verify
// @access  Private (Admin)
export const toggleUserVerification = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    // If volunteer, also update VolunteerProfile
    if (user.role === 'volunteer') {
      await VolunteerProfile.findOneAndUpdate(
        { user: user._id },
        { isApprovedByAdmin: user.isVerified }
      );
    }

    return res.status(200).json({
      success: true,
      message: `User verification updated to ${user.isVerified}`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    await VolunteerProfile.findOneAndDelete({ user: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'User removed from platform',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
