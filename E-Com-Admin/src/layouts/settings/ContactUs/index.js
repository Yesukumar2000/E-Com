import React, { useState } from "react";
import { Paper } from "@mui/material";
import MDBox from "components/MDBox";
import ContactUsList from "./components/ContactUsList";
import ContactUsForm from "./components/ContactUsForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function ContactUs() {
  const [contactData, setContactData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleEdit = (data) => {
    setContactData(data);
    setShowForm(true);
  };

  const handleCreate = () => {
    setContactData(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setContactData(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setContactData(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        {showForm ? (
          <Paper elevation={3}>
            <ContactUsForm
              data={contactData}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelForm}
            />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <ContactUsList
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

export default ContactUs;
