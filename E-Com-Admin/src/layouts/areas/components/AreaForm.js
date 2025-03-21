import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { areaCreateApi, areaUpdateApi, categoryGetApi } from "../../../Utils/Urls";

const AreaForm = ({ area, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({ areaName: "", categories: [] });
  const [errors, setErrors] = useState({ areaName: false, categories: false });
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    axios.get(categoryGetApi).then((response) => setCategoriesList(response.data));

    if (area) {
      setFormData({
        areaName: area.areaName || "",
        categories: area.category ? area.category.map((cat) => cat._id) : [],
      });
      setSelectAll(area.category && area.category.length === categoriesList.length);
    } else {
      setFormData({ areaName: "", categories: [] });
      setSelectAll(false);
    }
  }, [area, categoriesList.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categories") {
      const updatedCategories = formData.categories.includes(value)
        ? formData.categories.filter((catId) => catId !== value)
        : [...formData.categories, value];
      setFormData({ ...formData, categories: updatedCategories });
      setSelectAll(updatedCategories.length === categoriesList.length);
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: false });
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    const updatedCategories = checked ? categoriesList.map((cat) => cat._id) : [];
    setFormData({ ...formData, categories: updatedCategories });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let formValid = true;
    const newErrors = { areaName: false, categories: false };

    if (!formData.areaName) {
      newErrors.areaName = true;
      formValid = false;
    }
    if (!formData.categories.length) {
      newErrors.categories = true;
      formValid = false;
    }

    setErrors(newErrors);
    if (!formValid) return;

    const apiUrl = area ? `${areaUpdateApi}/${area._id}` : areaCreateApi;
    const method = area ? "put" : "post";

    axios({ method, url: apiUrl, data: formData })
      .then(() => {
        onSuccess();
        setFormData({ areaName: "", categories: [] });
        setSelectAll(false);
      })
      .catch((error) => console.error("API Error:", error));
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ mb: 2, paddingTop: 2 }}>
          <TextField
            name="areaName"
            label="Area Name"
            value={formData.areaName}
            onChange={handleChange}
            fullWidth
            required
            error={errors.areaName}
            helperText={errors.areaName ? "Area Name is required" : ""}
          />
        </Box>

        <Box sx={{ mb: 1 }}>
          <FormControlLabel
            control={<Checkbox checked={selectAll} onChange={handleSelectAllChange} />}
            label="Categories"
          />
          {/* <Typography variant="h6">Categories</Typography> */}
          <FormGroup>
            {categoriesList.map((cat) => (
              <FormControlLabel
                key={cat._id}
                control={
                  <Checkbox
                    checked={formData.categories.includes(cat._id)}
                    onChange={handleChange}
                    name="categories"
                    value={cat._id}
                    sx={{ ml: 2 }}
                  />
                }
                label={cat.name}
              />
            ))}
          </FormGroup>
          {errors.categories && (
            <Box sx={{ color: "red", fontSize: "0.75rem" }}>At least one category is required</Box>
          )}
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" style={{ color: "black" }} onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" style={{ color: "white" }}>
            {area ? "Update" : "Add"} Area
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

AreaForm.propTypes = {
  area: PropTypes.shape({
    _id: PropTypes.string,
    areaName: PropTypes.string,
    category: PropTypes.array,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AreaForm;
