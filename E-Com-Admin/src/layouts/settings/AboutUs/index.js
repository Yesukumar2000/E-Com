import React, { useState } from "react";
import { Paper, Button } from "@mui/material";
import MDBox from "components/MDBox";
import AboutList from "./components/AboutList";
import AboutForm from "./components/AboutForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function About() {
  const [aboutData, setAboutData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleEdit = (data) => {
    setAboutData(data);
    setShowForm(true);
  };

  const handleCreate = () => {
    setAboutData(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setAboutData(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setAboutData(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        {showForm ? (
          <Paper elevation={3}>
            <AboutForm data={aboutData} onSuccess={handleFormSuccess} onCancel={handleCancelForm} />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <AboutList
              onEdit={handleEdit}
              onCreate={handleCreate}
              refreshTrigger={refreshTrigger}
            />
          </Paper>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default About;
