import express from 'express';
import Ticket from '../../model/admin/TicketModel.js';

const router = express.Router();
// ✅ Create a new Ticket or append a new message if one already exists
router.post('/ticket/create', async (req, res) => {
  try {
    const { subject, customer, initialMessage } = req.body;
    
    // Check if an open ticket exists for this subject and customer
    let ticket = await Ticket.findOne({ subject, customer });
    if (ticket) {
      // Append new message (assume sender "customer")
      ticket.messages.push({ text: initialMessage, sender: 'customer' });
      await ticket.save();
      return res.status(200).json({ message: 'Message added to existing ticket', ticket });
    }

    // Otherwise, create a new ticket
    const ticketId = `TICKET-${Date.now()}`;
    const newTicket = new Ticket({
      ticketId,
      subject,
      customer,
      messages: [{ text: initialMessage, sender: 'customer' }],
    });
    await newTicket.save();
    res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
  } catch (error) {
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
});

// ✅ Get all Tickets (for admin view)
router.get('/tickets/all', async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: { $ne: 0 }}).populate('customer');
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
}); 

// ✅ Get Ticket by ID
router.get('/ticket/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('customer');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
});

// ✅ Admin sends a reply (appends a new message with sender "admin")
router.post('/ticket/:id/message', async (req, res) => {
  try {
    const { text } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    ticket.messages.push({ text, sender: 'admin' });
    await ticket.save();
    res.status(200).json({ message: 'Message sent successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// DELETE ticket endpoint to remove a ticket (or soft-delete by marking it closed)
router.put('/ticket/delete/:id', async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndUpdate(req.params.id,
      { status: 0 }, // Soft delete
      { new: true });

    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(200).json({ message: 'Ticket deleted successfully', ticket: deletedTicket });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting ticket', error: error.message });
  }
});

// close
router.put('/ticket/close/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status: 3 }, { new: true });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ message: "Ticket closed successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Error closing ticket", error: error.message });
  }
});

// Update ticket status
router.put('/ticket/updateStatus/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json({ message: "Ticket status updated successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Error updating ticket status", error: error.message });
  }
});

export default router;
