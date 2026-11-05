import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Food', 'Clothes', 'Educational Materials', 'Essential Supplies', 'Other'],
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      default: 'items',
      trim: true,
    },
    pickupLocation: {
      address: { type: String, default: 'Community Center' },
      city: { type: String, default: 'Metropolis' },
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.2090 },
    },
    status: {
      type: String,
      enum: ['Available', 'Claimed', 'Delivered'],
      default: 'Available',
    },
    expiryDate: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
