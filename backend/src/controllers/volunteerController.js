import VolunteerProfile from '../models/VolunteerProfile.js';
import User from '../models/User.js';
import HelpRequest from '../models/HelpRequest.js';
import Assignment from '../models/Assignment.js';

// @desc    Get current volunteer's profile
// @route   GET /api/volunteers/profile
// @access  Private (Volunteer)
export const getMyVolunteerProfile = async (req, res) => {
  try {
    let profile = await VolunteerProfile.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone city avatar'
    );

    if (!profile) {
      profile = await VolunteerProfile.create({
        user: req.user._id,
        skills: ['Community Support', 'First Aid'],
        serviceAreas: [req.user.city || 'Metropolis'],
      });
      profile = await profile.populate('user', 'name email phone city avatar');
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update volunteer profile
// @route   PUT /api/volunteers/profile
// @access  Private (Volunteer)
export const updateVolunteerProfile = async (req, res) => {
  try {
    const { skills, serviceCategories, serviceAreas, availabilityStatus, lat, lng, experienceNotes } = req.body;

    let profile = await VolunteerProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new VolunteerProfile({ user: req.user._id });
    }

    if (skills) profile.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (serviceCategories) profile.serviceCategories = Array.isArray(serviceCategories) ? serviceCategories : serviceCategories.split(',').map(s => s.trim());
    if (serviceAreas) profile.serviceAreas = Array.isArray(serviceAreas) ? serviceAreas : serviceAreas.split(',').map(s => s.trim());
    if (availabilityStatus) profile.availabilityStatus = availabilityStatus;
    if (lat !== undefined) profile.lat = parseFloat(lat);
    if (lng !== undefined) profile.lng = parseFloat(lng);
    if (experienceNotes !== undefined) profile.experienceNotes = experienceNotes;

    await profile.save();

    return res.status(200).json({
      success: true,
      message: 'Volunteer profile updated successfully',
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all volunteers (Admin/Coordination)
// @route   GET /api/volunteers
// @access  Private
export const getAllVolunteers = async (req, res) => {
  try {
    const profiles = await VolunteerProfile.find()
      .populate('user', 'name email phone city avatar isVerified createdAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper: Haversine distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Map categories to relevant volunteer skills
const categorySkillMap = {
  'Medical assistance coordination': ['First Aid', 'Nurse', 'Paramedic', 'CPR', 'Medical Assistance'],
  'Food and essential supplies': ['Driving', 'Logistics', 'Food Distribution', 'Packing', 'Cooking'],
  'Clothing donations': ['Sorting', 'Logistics', 'Distribution'],
  'Disaster Relief Support': ['Rescue Operations', 'Heavy Lifting', 'Shelter Management', 'First Aid', 'Disaster Response'],
  'Road Blockage Reporting': ['Driving', 'Field Reporting', 'Coordination', 'Clearance'],
  'Elderly assistance': ['Home Care', 'Companionship', 'Errands', 'Nursing', 'Patience'],
  'General community support': ['Community Support', 'General Assistance', 'Coordination'],
};

// @desc    Get recommended volunteers for a specific help request
// @route   GET /api/volunteers/recommendations/:requestId
// @access  Private (Admin / Coordinator)
export const getRecommendedVolunteers = async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.requestId);
    if (!helpRequest) {
      return res.status(404).json({ success: false, message: 'Help request not found' });
    }

    // Only match volunteers who are approved by admin and available
    const volunteers = await VolunteerProfile.find({
      isApprovedByAdmin: true,
      availabilityStatus: { $in: ['available', 'busy'] },
    }).populate('user', 'name email phone city avatar');

    const reqLat = helpRequest.location?.lat || 28.6139;
    const reqLng = helpRequest.location?.lng || 77.2090;
    const targetSkills = categorySkillMap[helpRequest.category] || ['Community Support'];

    const scoredVolunteers = volunteers.map((vol) => {
      let score = 0;
      const matchReasons = [];

      // 1. Availability check
      if (vol.availabilityStatus === 'available') {
        score += 30;
        matchReasons.push('Available immediately');
      } else {
        score += 10;
        matchReasons.push('Currently active on task');
      }

      // 2. Skill overlap
      const hasSkill = vol.skills.some((skill) =>
        targetSkills.some((ts) => ts.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(ts.toLowerCase()))
      );
      if (hasSkill) {
        score += 40;
        matchReasons.push('Matching critical skill set');
      }

      // 3. Service category alignment
      if (vol.serviceCategories.includes(helpRequest.category) || vol.serviceCategories.includes('General Community Support')) {
        score += 15;
        matchReasons.push('Supports request category');
      }

      // 4. Distance proximity
      const dist = calculateDistance(reqLat, reqLng, vol.lat, vol.lng);
      if (dist < 5) {
        score += 25;
        matchReasons.push(`Very close (~${dist.toFixed(1)} km)`);
      } else if (dist < 15) {
        score += 15;
        matchReasons.push(`Within service radius (~${dist.toFixed(1)} km)`);
      } else {
        matchReasons.push(`Approx. ${dist.toFixed(1)} km away`);
      }

      return {
        volunteer: vol,
        score,
        distanceKm: parseFloat(dist.toFixed(1)),
        matchReasons,
      };
    });

    // Sort descending by match score
    scoredVolunteers.sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      request: {
        id: helpRequest._id,
        requestId: helpRequest.requestId,
        title: helpRequest.title,
        category: helpRequest.category,
        location: helpRequest.location,
      },
      count: scoredVolunteers.length,
      data: scoredVolunteers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get verified help requests available for volunteers to browse
// @route   GET /api/volunteers/available-requests
// @access  Private (Volunteer)
export const getAvailableHelpRequests = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {
      status: { $in: ['Verified', 'Pending'] },
      assignedVolunteer: null,
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    const requests = await HelpRequest.find(query)
      .populate('user', 'name city avatar')
      .sort({ priority: -1, createdAt: -1 });

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
