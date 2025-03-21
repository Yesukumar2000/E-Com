import React, { useState } from "react";
import { Paper, Button } from "@mui/material";
import MDBox from "components/MDBox";
import PermissionList from "./components/PermissionList";
import PermissionForm from "./components/PermissionForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Permissions() {
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleNewPermission = () => {
    setSelectedPermission(null);
    setShowForm(true);
  };

  const handleEditPermission = (permission) => {
    setSelectedPermission(permission);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedPermission(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setSelectedPermission(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <MDBox display="flex" justifyContent="flex-end" mb={2}>
          {!showForm && (
            <Button variant="contained" style={{ color: "white" }} onClick={handleNewPermission}>
              New Permission
            </Button>
          )}
        </MDBox>
        {showForm ? (
          <Paper elevation={3}>
            <PermissionForm
              permission={selectedPermission}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelForm}
            />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <PermissionList onEdit={handleEditPermission} refreshTrigger={refreshTrigger} />
          </Paper>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Permissions;
