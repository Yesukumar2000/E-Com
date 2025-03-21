import React, { useState } from "react";
import { Paper, Button } from "@mui/material";
import MDBox from "components/MDBox";
import MetaContentList from "./components/MetaContentList";
import MetaContentForm from "./components/MetaContentForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function MetaContent() {
  const [meta, setMeta] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleEdit = (metaData) => {
    setMeta(metaData);
    setShowForm(true);
  };

  const handleCreate = () => {
    setMeta(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setMeta(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setMeta(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        {showForm ? (
          <Paper elevation={3}>
            <MetaContentForm
              meta={meta}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelForm}
            />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <MetaContentList
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

export default MetaContent;
