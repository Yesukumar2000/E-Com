import React, { useState } from "react";
import { Paper, Button } from "@mui/material";
import MDBox from "components/MDBox";
import RoleList from "./components/RolesList";
import RoleForm from "./components/RoleForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Roles() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleNewRole = () => {
    setSelectedRole(null);
    setShowForm(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedRole(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setSelectedRole(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        {/* Show "New Role" button only when RolesList is displayed */}
        {!showForm && (
          <MDBox display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="contained" style={{ color: "white" }} onClick={handleNewRole}>
              New Role
            </Button>
          </MDBox>
        )}
        {showForm ? (
          <Paper elevation={3}>
            <RoleForm
              role={selectedRole}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelForm}
            />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <RoleList onEdit={handleEditRole} refreshTrigger={refreshTrigger} />
          </Paper>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Roles;
