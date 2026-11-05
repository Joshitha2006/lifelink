import Assignment from '../models/Assignment.js';
import HelpRequest from '../models/HelpRequest.js';
import VolunteerProfile from '../models/VolunteerProfile.js';
import Notification from '../models/Notification.js';

// @desc    Assign a volunteer to a request (Admin)
// @route   POST /api/assignments
// @access  Private (Admin)
export const assignVolunteer = async (req, res) => {
  try {
    const { requestId, volunteerId, notes } = req.body;

    const helpRequest = await HelpRequest.findById(requestId);
    if (!helpRequest) {
      return res.status(404).json({ success: false, message: 'Help request not found' });
    }

    // Create assignment
    const assignment = await Assignment.create({
      request: requestId,
      volunteer: volunteerId,
      assignedBy: req.user._id,
      status: 'Offered',
      notes: notes || 'Admin assignment',
      timeline: [
        {
          status: 'Offered',
          note: `Assignment assigned by Admin ${req.user.name}`,
          timestamp: new Date(),
        },
      ],
    });

    helpRequest.status = 'Volunteer Assigned';
    helpRequest.assignedVolunteer = volunteerId;
    await helpRequest.save();

    // Increment active tasks count
    await VolunteerProfile.findOneAndUpdate(
      { user: volunteerId },
      { $inc: { activeTasksCount: 1 } }
    );

    // Notify volunteer
    await Notification.create({
      recipient: volunteerId,
      title: 'New Assignment Offered',
      message: `You have been offered assignment for request #${helpRequest.requestId}: ${helpRequest.title}`,
      type: 'assignment',
      link: '/volunteer/assignments',
    });

    // Notify citizen
    await Notification.create({
      recipient: helpRequest.user,
      title: 'Volunteer Assigned to Your Request',
      message: `A volunteer has been assigned to your request #${helpRequest.requestId}. They will review and coordinate soon.`,
      type: 'assignment',
      link: '/citizen/my-requests',
    });

    return res.status(201).json({
      success: true,
      message: 'Volunteer successfully assigned',
      data: assignment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Volunteer accepts an assignment / self-assigns to request
// @route   POST /api/assignments/:id/accept
// @access  Private (Volunteer)
export const acceptAssignment = async (req, res) => {
  try {
    let assignment = await Assignment.findById(req.params.id).populate('request');

    // If ID is actually requestId for direct pickup
    if (!assignment) {
      const helpRequest = await HelpRequest.findById(req.params.id);
      if (helpRequest) {
        assignment = await Assignment.create({
          request: helpRequest._id,
          volunteer: req.user._id,
          status: 'Accepted',
          notes: 'Self-accepted by volunteer',
          timeline: [
            {
              status: 'Accepted',
              note: `Accepted by volunteer ${req.user.name}`,
              timestamp: new Date(),
            },
          ],
        });
        helpRequest.status = 'In Progress';
        helpRequest.assignedVolunteer = req.user._id;
        await helpRequest.save();

        await VolunteerProfile.findOneAndUpdate(
          { user: req.user._id },
          { $inc: { activeTasksCount: 1 }, availabilityStatus: 'busy' }
        );

        // Notify citizen
        await Notification.create({
          recipient: helpRequest.user,
          title: 'Volunteer Accepted Your Request',
          message: `${req.user.name} has accepted your request #${helpRequest.requestId} and is responding.`,
          type: 'assignment',
          link: '/citizen/my-requests',
        });

        return res.status(200).json({
          success: true,
          message: 'Assignment accepted successfully',
          data: assignment,
        });
      }
      return res.status(404).json({ success: false, message: 'Assignment or request not found' });
    }

    if (assignment.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this assignment' });
    }

    assignment.status = 'Accepted';
    assignment.timeline.push({
      status: 'Accepted',
      note: `Accepted by volunteer ${req.user.name}`,
      timestamp: new Date(),
    });
    await assignment.save();

    await HelpRequest.findByIdAndUpdate(assignment.request._id, {
      status: 'In Progress',
    });

    await VolunteerProfile.findOneAndUpdate(
      { user: req.user._id },
      { availabilityStatus: 'busy' }
    );

    return res.status(200).json({
      success: true,
      message: 'Assignment accepted',
      data: assignment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Volunteer declines an assignment
// @route   POST /api/assignments/:id/decline
// @access  Private (Volunteer)
export const declineAssignment = async (req, res) => {
  try {
    const { reason } = req.body;
    const assignment = await Assignment.findById(req.params.id).populate('request');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    if (assignment.volunteer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    assignment.status = 'Declined';
    assignment.timeline.push({
      status: 'Declined',
      note: reason || 'Declined by volunteer due to scheduling conflict',
      timestamp: new Date(),
    });
    await assignment.save();

    // Reopen request
    await HelpRequest.findByIdAndUpdate(assignment.request._id, {
      status: 'Verified',
      assignedVolunteer: null,
    });

    await VolunteerProfile.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { activeTasksCount: -1 } }
    );

    return res.status(200).json({
      success: true,
      message: 'Assignment declined',
      data: assignment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Complete an assignment
// @route   POST /api/assignments/:id/complete
// @access  Private (Volunteer, Admin)
export const completeAssignment = async (req, res) => {
  try {
    const { completionNotes } = req.body;
    let assignment = await Assignment.findById(req.params.id).populate('request');

    if (!assignment) {
      // Find assignment by request id
      assignment = await Assignment.findOne({ request: req.params.id }).populate('request');
    }

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    assignment.status = 'Completed';
    assignment.timeline.push({
      status: 'Completed',
      note: completionNotes || 'Assistance delivered and task marked completed',
      timestamp: new Date(),
    });
    await assignment.save();

    const helpRequest = await HelpRequest.findById(assignment.request._id);
    if (helpRequest) {
      helpRequest.status = 'Completed';
      helpRequest.completedAt = new Date();
      if (completionNotes) {
        helpRequest.progressNotes.push({
          note: `Completion: ${completionNotes}`,
          updatedBy: req.user._id,
          updatedAt: new Date(),
        });
      }
      await helpRequest.save();

      // Notify citizen
      await Notification.create({
        recipient: helpRequest.user,
        title: `Request #${helpRequest.requestId} Marked as Completed!`,
        message: `Your help request has been successfully completed by ${req.user.name}. Thank you for using LifeLink!`,
        type: 'status_update',
        link: '/citizen/my-requests',
      });
    }

    // Update volunteer stats
    await VolunteerProfile.findOneAndUpdate(
      { user: assignment.volunteer },
      {
        $inc: { activeTasksCount: -1, completedTasksCount: 1 },
        availabilityStatus: 'available',
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Assignment and Help Request successfully marked as completed',
      data: assignment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get assignments for the logged in volunteer
// @route   GET /api/assignments/my
// @access  Private (Volunteer)
export const getMyAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ volunteer: req.user._id })
      .populate({
        path: 'request',
        populate: { path: 'user', select: 'name email phone city' },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
