import React, { useState } from "react";
import { Button } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import SubCategoryForm from "./components/SubCategoryForm";
import SubCategoryList from "./components/SubCategoryList";

function SubCategory() {
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setSelectedSubCategory(null);
    setShowForm(false);
    setRefreshTrigger((prev) => !prev);
  };

  const handleNewSubCategory = () => {
    setSelectedSubCategory(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setSelectedSubCategory(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox display="flex" justifyContent="flex-end" mb={3}>
          {!showForm && (
            <Button variant="contained" style={{ color: "white" }} onClick={handleNewSubCategory}>
              New SubCategory
            </Button>
          )}
        </MDBox>
        {showForm ? (
          <SubCategoryForm
            subCategory={selectedSubCategory}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        ) : (
          <SubCategoryList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SubCategory;
