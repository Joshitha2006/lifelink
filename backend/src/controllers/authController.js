import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import VolunteerProfile from '../models/VolunteerProfile.js';
import Notification from '../models/Notification.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'lifelink_super_secret_jwt_key_2026_secure',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, city, address, skills, serviceAreas, bloodGroup, isBloodDonor } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    const assignedRole = role && ['citizen', 'volunteer', 'admin'].includes(role) ? role : 'citizen';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
      city: city || 'Metropolis',
      address: address || '',
      bloodGroup: bloodGroup || '',
      isBloodDonor: !!isBloodDonor,
      isVerified: assignedRole === 'citizen', // Citizens auto-verified; volunteers/admins can be approved or pre-approved
    });

    // If registered as volunteer, create VolunteerProfile
    if (assignedRole === 'volunteer') {
      await VolunteerProfile.create({
        user: user._id,
        skills: skills && Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['First Aid', 'Community Support']),
        serviceAreas: serviceAreas && Array.isArray(serviceAreas) ? serviceAreas : (serviceAreas ? serviceAreas.split(',').map(s => s.trim()) : [user.city || 'Central']),
        contactNumber: user.phone,
        isApprovedByAdmin: true, // initial auto-approval for smooth training test
      });
    }

    // Welcome notification
    await Notification.create({
      recipient: user._id,
      title: 'Welcome to LifeLink!',
      message: `Hello ${user.name}, your LifeLink account has been created successfully as a ${user.role}.`,
      type: 'system',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        address: user.address,
        isVerified: user.isVerified,
        bloodGroup: user.bloodGroup,
        isBloodDonor: user.isBloodDonor,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        address: user.address,
        isVerified: user.isVerified,
        bloodGroup: user.bloodGroup,
        isBloodDonor: user.isBloodDonor,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let volunteerProfile = null;

    if (user.role === 'volunteer') {
      volunteerProfile = await VolunteerProfile.findOne({ user: user._id });
    }

    return res.status(200).json({
      success: true,
      user,
      volunteerProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, city, address, bloodGroup, isBloodDonor } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (address !== undefined) user.address = address;
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
    if (isBloodDonor !== undefined) user.isBloodDonor = isBloodDonor;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
