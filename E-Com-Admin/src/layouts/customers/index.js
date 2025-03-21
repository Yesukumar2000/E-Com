// Customer/index.js
import React, { useState } from "react";
import { Button } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";

function Customer() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedCustomer(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setSelectedCustomer(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox display="flex" justifyContent="flex-end" mb={3}>
          {!showForm && (
            <Button variant="contained" style={{ color: "white" }} onClick={handleNewCustomer}>
              New Customer
            </Button>
          )}
        </MDBox>
        {showForm ? (
          <CustomerForm
            customer={selectedCustomer}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        ) : (
          <CustomerList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Customer;
