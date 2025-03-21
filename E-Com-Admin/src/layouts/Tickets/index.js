import React, { useState } from "react";
import { Grid, Paper, Button } from "@mui/material";
import MDBox from "components/MDBox";
import TicketsList from "./components/TicketsList";
import TicketDetails from "./components/TicketDetails";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Tickets() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleRefresh = () => {
    // Toggle refreshTrigger to force TicketsList to re-fetch tickets
    setRefreshTrigger((prev) => !prev);
    // Optionally clear selected ticket if needed:
    setSelectedTicket(null);
  };
  const handleBack = () => {
    setSelectedTicket(null);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        {/* Refresh Button at the top */}
        <MDBox display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" style={{ color: "white" }} onClick={handleRefresh}>
            Refresh
          </Button>
        </MDBox>
        <Grid container spacing={3} sx={{ height: "calc(100% - 64px)" }}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ height: "100%" }}>
              {selectedTicket ? (
                <TicketDetails ticket={selectedTicket} onBack={handleBack} />
              ) : (
                <TicketsList
                  setSelectedTicket={setSelectedTicket}
                  refreshTrigger={refreshTrigger}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Tickets;
