import mongoose from 'mongoose';

const supportCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'Shelter',
        'Relief Camp',
        'Food Distribution Center',
        'Medical Center',
        'Emergency Dispatch',
      ],
      default: 'Relief Camp',
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: 'Metropolis',
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    contactNumber: {
      type: String,
      default: '',
    },
    operationalHours: {
      type: String,
      default: '24/7',
    },
    capacity: {
      type: Number,
      default: 100,
    },
    currentOccupancy: {
      type: Number,
      default: 0,
    },
    resourcesAvailable: {
      type: [String],
      default: ['Water', 'First Aid', 'Blankets', 'Hot Meals'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SupportCenter = mongoose.model('SupportCenter', supportCenterSchema);
export default SupportCenter;
