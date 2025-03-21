import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import {
  imageBaseUrl,
  subCategoryCreateApi,
  subCategoryUpdateApi,
  categoryGetApi,
} from "../../../Utils/Urls";

const SubCategoryForm = ({ subCategory, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    // status: 1,
    category: "",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({ name: false, category: false });
  const [categories, setCategories] = useState([]); // To hold parent categories

  useEffect(() => {
    // Fetch categories for the dropdown (using your category API)
    axios.get(`${categoryGetApi}`).then((response) => {
      setCategories(response.data);
    });

    if (subCategory) {
      setFormData({
        name: subCategory.name || "",
        category: subCategory.category ? subCategory.category._id : "",
      });
      if (subCategory.subCategoryImage) {
        const imageUrl = subCategory.subCategoryImage.startsWith("http")
          ? subCategory.subCategoryImage
          : `${imageBaseUrl}/${subCategory.subCategoryImage}`;
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl(null);
      }
      setFile(null);
    } else {
      setFormData({ name: "", category: "" });
      setPreviewUrl(null);
      setFile(null);
    }
  }, [subCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "status" ? Number(value) : value });
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

    let formValid = true;
    const newErrors = { name: false, category: false };

    if (!formData.name) {
      newErrors.name = true;
      formValid = false;
    }
    if (!formData.category) {
      newErrors.category = true;
      formValid = false;
    }

    setErrors(newErrors);
    if (!formValid) return;

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("category", formData.category);
    if (file) {
      submissionData.append("subCategoryImage", file);
    }

    if (subCategory) {
      axios
        .put(`${subCategoryUpdateApi}/${subCategory._id}`, submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          onSuccess();
          setFormData({ name: "", category: "" });
          setFile(null);
          setPreviewUrl(null);
        });
    } else {
      axios
        .post(`${subCategoryCreateApi}`, submissionData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          onSuccess();
          setFormData({ name: "", category: "" });
          setFile(null);
          setPreviewUrl(null);
        });
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <TextField
          name="name"
          label="SubCategory Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={errors.name}
          helperText={errors.name ? "SubCategory Name is required" : ""}
        />
        <FormControl fullWidth sx={{ mb: 2 }} required error={errors.category}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            name="category"
            fullWidth
            sx={{ mb: 2, height: "40px" }}
            value={formData.category || ""}
            label="Category"
            onChange={handleChange}
          >
            <MenuItem value="">Select Category</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>

          {errors.category && (
            <Box sx={{ color: "red", fontSize: "0.75rem" }}>Category is required</Box>
          )}
        </FormControl>
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" style={{ color: "white" }} component="label">
            Upload SubCategory Image
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
            {subCategory ? "Update" : "Add"} SubCategory
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

SubCategoryForm.propTypes = {
  subCategory: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    // status: PropTypes.number,
    category: PropTypes.object,
    subCategoryImage: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default SubCategoryForm;
