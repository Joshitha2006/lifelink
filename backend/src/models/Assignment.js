import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HelpRequest',
      required: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null if self-accepted by volunteer
    },
    status: {
      type: String,
      enum: ['Offered', 'Accepted', 'Declined', 'In Progress', 'Completed'],
      default: 'Offered',
    },
    notes: {
      type: String,
      default: '',
    },
    timeline: [
      {
        status: { type: String, required: true },
        note: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
