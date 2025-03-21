import React, { useState } from "react";
import { Grid, Paper, Button } from "@mui/material";
import MDBox from "components/MDBox";
import UsersList from "./components/UsersList";
import UserForm from "./components/UserForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Users() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleNewUser = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedUser(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setSelectedUser(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <MDBox display="flex" justifyContent="flex-end" mb={2}>
          {!showForm && (
            <Button variant="contained" style={{ color: "white" }} onClick={handleNewUser}>
              New User
            </Button>
          )}
        </MDBox>
        {showForm ? (
          <Paper elevation={3}>
            <UserForm
              user={selectedUser}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelForm}
            />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <UsersList onEdit={handleEditUser} refreshTrigger={refreshTrigger} />
          </Paper>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Users;
