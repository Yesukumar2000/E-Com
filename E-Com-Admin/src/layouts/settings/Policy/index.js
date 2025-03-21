import React, { useState } from "react";
import { Paper } from "@mui/material";
import MDBox from "components/MDBox";
import PolicyList from "./components/PolicyList";
import PolicyForm from "./components/PolicyForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Policy() {
  const [policyData, setPolicyData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleEdit = (data) => {
    setPolicyData(data);
    setShowForm(true);
  };

  const handleCreate = () => {
    setPolicyData(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setPolicyData(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setPolicyData(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        {showForm ? (
          <Paper elevation={3}>
            <PolicyForm
              data={policyData}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelForm}
            />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <PolicyList
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

export default Policy;
