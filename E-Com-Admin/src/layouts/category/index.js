import React, { useState } from "react";
import { Button } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import CategoryForm from "./components/CategoryForm";
import CategoryList from "./components/CategoryList";

function Category() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedCategory(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleNewCategory = () => {
    setSelectedCategory(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setSelectedCategory(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox display="flex" justifyContent="flex-end" mb={3}>
          {!showForm && (
            <Button variant="contained" style={{ color: "white" }} onClick={handleNewCategory}>
              New Category
            </Button>
          )}
        </MDBox>
        {showForm ? (
          <CategoryForm
            category={selectedCategory}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        ) : (
          <CategoryList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Category;
