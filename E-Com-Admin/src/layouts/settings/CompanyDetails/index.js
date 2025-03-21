import React, { useState } from "react";
import { Paper } from "@mui/material";
import MDBox from "components/MDBox";
import CompanyDetailsList from "./components/CompanyDetailsList";
import CompanyDetailsForm from "./components/CompanyDetailsForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function CompanyDetails() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setShowForm(true);
  };

  const handleCreateCompany = () => {
    setSelectedCompany(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedCompany(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setSelectedCompany(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {showForm ? (
          <Paper elevation={3}>
            <CompanyDetailsForm
              company={selectedCompany}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelForm}
            />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <CompanyDetailsList
              onEdit={handleEditCompany}
              onCreate={handleCreateCompany}
              refreshTrigger={refreshTrigger}
            />
          </Paper>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default CompanyDetails;
