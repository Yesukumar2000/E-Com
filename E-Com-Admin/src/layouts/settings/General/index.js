import React, { useState } from "react";
import { Paper } from "@mui/material";
import MDBox from "components/MDBox";
import GeneralList from "./components/GeneralList";
import GeneralForm from "./components/GeneralForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function General() {
  const [generalData, setGeneralData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleEdit = (doc) => {
    setGeneralData(doc);
    setShowForm(true);
  };

  const handleCreate = () => {
    setGeneralData(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setGeneralData(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setGeneralData(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {showForm ? (
          <Paper elevation={3}>
            <GeneralForm
              data={generalData}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelForm}
            />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <GeneralList
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

export default General;
