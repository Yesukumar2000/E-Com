import React, { useState } from "react";
import { Paper, Button } from "@mui/material";
import MDBox from "components/MDBox";
import ProductTypeList from "./components/ProductTypeList";
import ProductTypeForm from "./components/ProductTypeForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function ProductType() {
  const [selectedType, setSelectedType] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleNewType = () => {
    setSelectedType(null);
    setShowForm(true);
  };

  const handleEditType = (type) => {
    setSelectedType(type);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedType(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setSelectedType(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        {!showForm && (
          <MDBox display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="contained" style={{ color: "white" }} onClick={handleNewType}>
              New Product Type
            </Button>
          </MDBox>
        )}
        {showForm ? (
          <Paper elevation={3}>
            <ProductTypeForm
              productType={selectedType}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelForm}
            />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <ProductTypeList onEdit={handleEditType} refreshTrigger={refreshTrigger} />
          </Paper>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default ProductType;
