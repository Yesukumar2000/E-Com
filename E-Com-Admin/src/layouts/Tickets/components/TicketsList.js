import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { ticketGetApi, ticketDeleteApi } from "Utils/Urls";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import PerfectScrollbar from "react-perfect-scrollbar"; // Import PerfectScrollbar
import "react-perfect-scrollbar/dist/css/styles.css";

const ActionCell = ({ row, setSelectedTicket, handleDelete, tickets }) => {
  const ticket = tickets[row.index];
  return (
    <>
      <Button
        variant="contained"
        size="small"
        onClick={() => setSelectedTicket(ticket)}
        style={{ color: "white" }}
      >
        <ChatIcon fontSize="small" sx={{ mr: 1, color: "black" }} /> Chat
      </Button>
      {ticket.status === 3 && (
        <IconButton onClick={() => handleDelete(ticket._id)}>
          <DeleteIcon color="error" />
        </IconButton>
      )}
    </>
  );
};

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  setSelectedTicket: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  tickets: PropTypes.array.isRequired,
};

const ActionsCellRenderer = ({ row, setSelectedTicket, handleDelete, tickets }) => (
  <ActionCell
    row={row}
    setSelectedTicket={setSelectedTicket}
    handleDelete={handleDelete}
    tickets={tickets}
  />
);

ActionsCellRenderer.propTypes = {
  row: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
  setSelectedTicket: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  tickets: PropTypes.array.isRequired,
};

const getStatusLabel = (status) => {
  if (status === 1) return { label: "Open", color: "green" };
  if (status === 2) return { label: "Pending", color: "orange" };
  if (status === 3) return { label: "Closed", color: "red" };
  return { label: "Unknown", color: "grey" };
};

const TicketsList = ({ setSelectedTicket, refreshTrigger }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    setLoading(true);
    axios
      .get(ticketGetApi)
      .then((response) => {
        setTickets(response.data.reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "open") return ticket.status === 1;
    if (filterStatus === "pending") return ticket.status === 2;
    if (filterStatus === "closed") return ticket.status === 3;
    return true;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to close this ticket?")) {
      axios
        .put(`${ticketDeleteApi}/${id}`)
        .then(() => {
          setTickets(tickets.filter((ticket) => ticket._id !== id));
          setSelectedTicket(null);
        })
        .catch((error) => {
          console.error("Error deleting ticket:", error);
        });
    }
  };

  const columns = [
    { Header: "Ticket ID", accessor: "ticketId", align: "left" },
    { Header: "Customer Name", accessor: "customerName", align: "left" },
    { Header: "Subject", accessor: "subject", align: "left" },
    { Header: "Ticket Status", accessor: "status", align: "left" },
    {
      Header: "Actions",
      accessor: "actions",
      align: "rihgt",
      // eslint-disable-next-line react/prop-types
      Cell: ({ row }) => (
        <ActionsCellRenderer
          row={row}
          setSelectedTicket={setSelectedTicket}
          handleDelete={handleDelete}
          tickets={filteredTickets} // Use filteredTickets here
        />
      ),
    },
  ];

  const rows = filteredTickets.map((ticket) => {
    const { label, color } = getStatusLabel(ticket.status);
    return {
      ticketId: ticket.ticketId,
      customerName: ticket.customer?.name || "Unknown",
      subject: ticket.subject,
      status: <Typography style={{ color }}>{label}</Typography>,
      actions: "",
    };
  });

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Tickets
          </Typography>
          <FormControl fullWidth sx={{ mb: 2, height: "40px" }}>
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              value={filterStatus}
              label="Filter"
              onChange={handleFilterChange}
              sx={{ height: "40px" }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <PerfectScrollbar>
              <DataTable
                table={tableData}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
                empty={
                  rows.length === 0 ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      minHeight="200px"
                    >
                      <Typography>No tickets found.</Typography>
                    </Box>
                  ) : null
                }
              />
            </PerfectScrollbar>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

TicketsList.propTypes = {
  setSelectedTicket: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default TicketsList;
