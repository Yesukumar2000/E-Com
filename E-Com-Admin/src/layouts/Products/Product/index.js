import React, { useState } from "react";
import { Paper, Button } from "@mui/material";
import MDBox from "components/MDBox";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Product() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedProduct(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleCancelForm = () => {
    setSelectedProduct(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        {!showForm && (
          <MDBox display="flex" justifyContent="flex-end" mb={2}>
            <Button variant="contained" style={{ color: "white" }} onClick={handleNewProduct}>
              New Product
            </Button>
          </MDBox>
        )}
        {showForm ? (
          <Paper elevation={3}>
            <ProductForm
              product={selectedProduct}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelForm}
            />
          </Paper>
        ) : (
          <Paper elevation={3}>
            <ProductList onEdit={handleEditProduct} refreshTrigger={refreshTrigger} />
          </Paper>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Product;
