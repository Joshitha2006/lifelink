import mongoose from 'mongoose';

const volunteerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    serviceCategories: {
      type: [String],
      default: ['General Community Support'],
    },
    serviceAreas: {
      type: [String],
      default: [],
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'busy', 'inactive'],
      default: 'available',
    },
    lat: {
      type: Number,
      default: 28.6139,
    },
    lng: {
      type: Number,
      default: 77.2090,
    },
    contactNumber: {
      type: String,
      default: '',
    },
    experienceNotes: {
      type: String,
      default: '',
    },
    isApprovedByAdmin: {
      type: Boolean,
      default: false,
    },
    activeTasksCount: {
      type: Number,
      default: 0,
    },
    completedTasksCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
    },
  },
  {
    timestamps: true,
  }
);

const VolunteerProfile = mongoose.model('VolunteerProfile', volunteerProfileSchema);
export default VolunteerProfile;
