import HelpRequest from '../models/HelpRequest.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Create new help request
// @route   POST /api/requests
// @access  Private (Citizen, Admin)
export const createHelpRequest = async (req, res) => {
  try {
    const { category, title, description, address, city, lat, lng, priority, imageUrl } = req.body;

    let image = imageUrl || '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const newRequest = await HelpRequest.create({
      user: req.user._id,
      category,
      title,
      description,
      location: {
        address: address || 'Community Area',
        city: city || req.user.city || 'Metropolis',
        lat: lat ? parseFloat(lat) : 28.6139 + (Math.random() - 0.5) * 0.08,
        lng: lng ? parseFloat(lng) : 77.2090 + (Math.random() - 0.5) * 0.08,
      },
      image,
      priority: priority || 'Medium',
      status: 'Pending',
    });

    // Notify admins of new request
    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      title: 'New Emergency Help Request',
      message: `New request #${newRequest.requestId}: ${newRequest.title} (${newRequest.priority} priority)`,
      type: 'request',
      link: `/admin/requests`,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return res.status(201).json({
      success: true,
      message: 'Help request submitted successfully. It is currently under review.',
      data: newRequest,
    });
  } catch (error) {
    console.error('Create help request error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating help request',
    });
  }
};

// @desc    Get all help requests (with filters)
// @route   GET /api/requests
// @access  Public / Private
export const getAllHelpRequests = async (req, res) => {
  try {
    const { status, category, priority, city, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (city && city !== 'all') {
      query['location.city'] = new RegExp(city, 'i');
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requestId: { $regex: search, $options: 'i' } },
      ];
    }

    const requests = await HelpRequest.find(query)
      .populate('user', 'name email phone avatar city')
      .populate('assignedVolunteer', 'name email phone city')
      .sort({ createdAt: -1 });

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

// @desc    Get requests created by logged in citizen
// @route   GET /api/requests/my
// @access  Private
export const getMyRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find({ user: req.user._id })
      .populate('assignedVolunteer', 'name email phone city')
      .sort({ createdAt: -1 });

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

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Public / Private
export const getRequestById = async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id)
      .populate('user', 'name email phone avatar city')
      .populate('assignedVolunteer', 'name email phone city')
      .populate('progressNotes.updatedBy', 'name role');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update request status (Admin or Assigned Volunteer)
// @route   PUT /api/requests/:id/status
// @access  Private
export const updateRequestStatus = async (req, res) => {
  try {
    const { status, note, rejectionReason } = req.body;
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    request.status = status;
    if (rejectionReason) {
      request.rejectionReason = rejectionReason;
    }
    if (status === 'Verified') {
      request.verifiedBy = req.user._id;
    }
    if (status === 'Completed') {
      request.completedAt = new Date();
    }

    if (note) {
      request.progressNotes.push({
        note,
        updatedBy: req.user._id,
        updatedAt: new Date(),
      });
    }

    await request.save();

    // Notify requester
    await Notification.create({
      recipient: request.user,
      title: `Request Status Updated: ${status}`,
      message: `Your request "${request.title}" (${request.requestId}) status has been changed to "${status}".`,
      type: 'status_update',
      link: `/citizen/my-requests`,
    });

    return res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add progress note to request
// @route   POST /api/requests/:id/progress
// @access  Private (Volunteer, Admin)
export const addProgressNote = async (req, res) => {
  try {
    const { note } = req.body;
    const request = await HelpRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.progressNotes.push({
      note,
      updatedBy: req.user._id,
      updatedAt: new Date(),
    });

    if (request.status === 'Volunteer Assigned') {
      request.status = 'In Progress';
    }

    await request.save();

    // Notify citizen
    await Notification.create({
      recipient: request.user,
      title: `Progress Update on Request #${request.requestId}`,
      message: `${req.user.name}: "${note}"`,
      type: 'assignment',
      link: `/citizen/my-requests`,
    });

    return res.status(200).json({
      success: true,
      message: 'Progress update recorded',
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (Admin or Request Owner)
export const deleteHelpRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (req.user.role !== 'admin' && request.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this request',
      });
    }

    await HelpRequest.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Help request deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
