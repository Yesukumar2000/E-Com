import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Box } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { imageBaseUrl, categoryCreateApi, categoryUpdateApi } from "../../../Utils/Urls";

const CategoryForm = ({ category, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({ name: "" });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({ name: false });

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name || "" });
      if (category.categoryImage) {
        const imageUrl = category.categoryImage.startsWith("http")
          ? category.categoryImage
          : `${imageBaseUrl}/${category.categoryImage}`;
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl(null);
      }
      setFile(null);
    } else {
      setFormData({ name: "" });
      setPreviewUrl(null);
      setFile(null);
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) {
      setErrors({ name: true });
      return;
    }

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    if (file) {
      submissionData.append("categoryImage", file);
    }

    const apiUrl = category ? `${categoryUpdateApi}/${category._id}` : categoryCreateApi;
    const method = category ? "put" : "post";

    axios({
      method,
      url: apiUrl,
      data: submissionData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        onSuccess();
        setFormData({ name: "" });
        setFile(null);
        setPreviewUrl(null);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <TextField
          name="name"
          label="Category Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={errors.name}
          helperText={errors.name ? "Category Name is required" : ""}
        />
        <Box>
          <Button variant="contained" style={{ color: "white" }} component="label">
            Upload Category Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {previewUrl && (
            <Box mt={2}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </Box>
          )}
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" style={{ color: "black" }} onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" style={{ color: "white" }}>
            {category ? "Update" : "Add"} Category
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

CategoryForm.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    categoryImage: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CategoryForm;
