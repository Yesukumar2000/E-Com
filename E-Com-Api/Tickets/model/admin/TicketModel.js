import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: String, enum: ['customer', 'admin'], required: true },
  timestamp: { type: Date, default: Date.now },
});

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true }, // Unique ticket ID, auto‐generated
  subject: { type: String, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  messages: [messageSchema],
  status: { type: Number, enum: [0, 1, 2, 3], default: 1 } // 1: Open, 2: Pending, 3: Close
}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);
