import SupportCenter from '../models/SupportCenter.js';

// @desc    Get all community support centers
// @route   GET /api/support-centers
// @access  Public
export const getAllSupportCenters = async (req, res) => {
  try {
    const { type, city } = req.query;
    let query = { isActive: true };

    if (type && type !== 'all') {
      query.type = type;
    }
    if (city && city !== 'all') {
      query.city = new RegExp(city, 'i');
    }

    const centers = await SupportCenter.find(query).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: centers.length,
      data: centers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create a new support center (Admin)
// @route   POST /api/support-centers
// @access  Private (Admin)
export const createSupportCenter = async (req, res) => {
  try {
    const { name, type, address, city, lat, lng, contactNumber, operationalHours, capacity, resourcesAvailable } = req.body;

    const center = await SupportCenter.create({
      name,
      type,
      address,
      city: city || 'Metropolis',
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      contactNumber,
      operationalHours: operationalHours || '24/7',
      capacity: Number(capacity) || 100,
      resourcesAvailable: Array.isArray(resourcesAvailable)
        ? resourcesAvailable
        : (resourcesAvailable ? resourcesAvailable.split(',').map((r) => r.trim()) : ['Water', 'First Aid', 'Blankets']),
    });

    return res.status(201).json({
      success: true,
      message: 'Community Support Center created successfully',
      data: center,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update support center (Admin)
// @route   PUT /api/support-centers/:id
// @access  Private (Admin)
export const updateSupportCenter = async (req, res) => {
  try {
    const center = await SupportCenter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!center) {
      return res.status(404).json({ success: false, message: 'Support center not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Support center updated successfully',
      data: center,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete support center (Admin)
// @route   DELETE /api/support-centers/:id
// @access  Private (Admin)
export const deleteSupportCenter = async (req, res) => {
  try {
    const center = await SupportCenter.findByIdAndDelete(req.params.id);
    if (!center) {
      return res.status(404).json({ success: false, message: 'Support center not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Support center deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
