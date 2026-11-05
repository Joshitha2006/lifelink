import mongoose from 'mongoose';

const bloodDonationRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name or identifier is required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    unitsNeeded: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital / clinic name is required'],
      trim: true,
    },
    hospitalAddress: {
      address: { type: String, default: 'General Hospital Wing' },
      city: { type: String, default: 'Metropolis' },
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.2090 },
    },
    urgency: {
      type: String,
      enum: ['Normal', 'Urgent', 'Immediate'],
      default: 'Urgent',
    },
    status: {
      type: String,
      enum: ['Pending Approval', 'Active', 'Fulfilled', 'Closed', 'Rejected'],
      default: 'Pending Approval',
    },
    adminApproved: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    additionalNotes: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    matchedDonorsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const BloodDonationRequest = mongoose.model(
  'BloodDonationRequest',
  bloodDonationRequestSchema
);
export default BloodDonationRequest;
