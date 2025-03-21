import React, { useState } from "react";
import { Button } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import AreaForm from "./components/AreaForm";
import AreaList from "./components/AreaList";

function Area() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (area) => {
    setSelectedArea(area);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedArea(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleNewArea = () => {
    setSelectedArea(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setSelectedArea(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox display="flex" justifyContent="flex-end" mb={3}>
          {!showForm && (
            <Button variant="contained" style={{ color: "white" }} onClick={handleNewArea}>
              Create
            </Button>
          )}
        </MDBox>
        {showForm ? (
          <AreaForm area={selectedArea} onSuccess={handleFormSuccess} onCancel={handleCancelForm} />
        ) : (
          <AreaList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Area;
