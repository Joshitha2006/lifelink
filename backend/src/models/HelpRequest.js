import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      default: () => `REQ-${Math.floor(100000 + Math.random() * 900000)}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Medical assistance coordination',
        'Food and essential supplies',
        'Clothing donations',
        'Disaster relief support',
        'Disaster Relief Support',
        'Road blockage reporting',
        'Road Blockage Reporting',
        'Elderly assistance',
        'General community support',
      ],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: {
      address: { type: String, default: 'Central Area' },
      city: { type: String, default: 'Metropolis' },
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.2090 },
    },
    image: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Verified',
        'Volunteer Assigned',
        'In Progress',
        'Completed',
        'Rejected',
      ],
      default: 'Pending',
    },
    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    progressNotes: [
      {
        note: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);
export default HelpRequest;
