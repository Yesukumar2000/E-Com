import React, { useState } from "react";
import { Paper, Button } from "@mui/material";
import MDBox from "components/MDBox";
import CostList from "./components/CostList";
import CostForm from "./components/CostForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Cost() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCost, setSelectedCost] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleEdit = (costRecord) => {
    setSelectedCost(costRecord);
    setShowForm(true);
  };

  const handleNew = () => {
    setSelectedCost(null);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setSelectedCost(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancel = () => {
    setSelectedCost(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        {!showForm && (
          <MDBox display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="contained" style={{ color: "white" }} onClick={handleNew}>
              New Cost
            </Button>
          </MDBox>
        )}
        {showForm ? (
          <Paper elevation={3}>
            <CostForm costRecord={selectedCost} onSuccess={handleSuccess} onCancel={handleCancel} />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <CostList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
          </Paper>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Cost;
