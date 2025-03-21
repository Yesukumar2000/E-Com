import React, { useState } from "react";
import { Paper, Button } from "@mui/material";
import MDBox from "components/MDBox";
import PromoCodesList from "./components/PromoCodesList";
import PromoCodeForm from "./components/PromoCodeForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function PromoCodes() {
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleNewPromo = () => {
    setSelectedPromo(null);
    setShowForm(true);
  };

  const handleEditPromo = (promo) => {
    setSelectedPromo(promo);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedPromo(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setSelectedPromo(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        {!showForm && (
          <MDBox display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="contained" style={{ color: "white" }} onClick={handleNewPromo}>
              New Promo Code
            </Button>
          </MDBox>
        )}
        {showForm ? (
          <Paper elevation={3}>
            <PromoCodeForm
              promo={selectedPromo}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelForm}
            />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <PromoCodesList onEdit={handleEditPromo} refreshTrigger={refreshTrigger} />
          </Paper>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default PromoCodes;
