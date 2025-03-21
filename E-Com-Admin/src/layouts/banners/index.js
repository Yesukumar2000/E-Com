import React, { useState } from "react";
import { Paper, Button } from "@mui/material";
import MDBox from "components/MDBox";
import BannerList from "./components/BannerList";
import BannerForm from "./components/BannerForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Banners() {
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleNewBanner = () => {
    setSelectedBanner(null);
    setShowForm(true);
  };

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedBanner(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setSelectedBanner(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} p={3}>
        <MDBox display="flex" justifyContent="flex-end" mb={3}>
          {!showForm && (
            <Button variant="contained" style={{ color: "white" }} onClick={handleNewBanner}>
              New Banner
            </Button>
          )}
        </MDBox>
        {showForm ? (
          <BannerForm
            banner={selectedBanner}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        ) : (
          <BannerList onEdit={handleEditBanner} refreshTrigger={refreshTrigger} />
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Banners;
