import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { ticketSendmgsApi, ticketUpdateStatusApi } from "../../../Utils/Urls";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// eslint-disable-next-line react/prop-types
function TicketDetails({ ticket, onBack }) {
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState(ticket.messages);
  // eslint-disable-next-line react/prop-types
  const [status, setStatus] = useState(ticket.status);

  // Update messages and status if ticket prop changes
  useEffect(() => {
    setMessages(ticket.messages);
    // eslint-disable-next-line react/prop-types
    setStatus(ticket.status);
  }, [ticket]);

  const sendMessage = () => {
    if (!reply) return;
    axios
      .post(`${ticketSendmgsApi}/${ticket._id}/message`, { text: reply })
      .then((response) => {
        const updatedTicket = response.data.ticket;
        setMessages(updatedTicket.messages);
        setReply("");
      })
      .catch((error) => {
        console.error("Error sending message", error);
      });
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    // Update status via API
    axios
      .put(`${ticketUpdateStatusApi}/${ticket._id}`, { status: newStatus })
      .then((response) => {
        const updatedTicket = response.data.ticket;
        setStatus(updatedTicket.status);
      })
      .catch((error) => {
        console.error("Error updating status", error);
      });
  };

  return (
    <Box p={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Ticket: {ticket.subject}</Typography>
        </Box>
        <FormControl sx={{ minWidth: 120, height: "40px" }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            label="Status"
            onChange={handleStatusChange}
            sx={{ height: "40px" }}
          >
            <MenuItem value={1}>Open</MenuItem>
            <MenuItem value={2}>Pending</MenuItem>
            <MenuItem value={3}>Closed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ maxHeight: "400px", overflowY: "auto", mb: 2 }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent: msg.sender === "admin" ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  p: 1,
                  bgcolor: msg.sender === "admin" ? "primary.main" : "grey.300",
                  color: msg.sender === "admin" ? "white" : "black",
                  borderRadius: 1,
                  maxWidth: "70%",
                }}
              >
                <ListItemText
                  primary={msg.text}
                  secondary={new Date(msg.timestamp).toLocaleString()}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box display="flex" gap={2}>
        <TextField
          label="Reply"
          fullWidth
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <Button variant="contained" style={{ color: "white" }} onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

TicketDetails.propTypes = {
  ticket: PropTypes.shape({
    _id: PropTypes.string,
    subject: PropTypes.string,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        sender: PropTypes.string,
        timestamp: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default TicketDetails;
