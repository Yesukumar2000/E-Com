import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { metaCreateApi, metaUpdateApi } from "../../../../Utils/Urls";

function MetaContentForm({ meta, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (meta) {
      setFormData({
        metaTitle: meta.metaTitle || "",
        metaDescription: meta.metaDescription || "",
      });
    } else {
      setFormData({ metaTitle: "", metaDescription: "" });
    }
  }, [meta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.metaTitle) newErrors.metaTitle = "Meta title is required";
    if (!formData.metaDescription) newErrors.metaDescription = "Meta description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const isUpdate = !!meta;
    const apiUrl = isUpdate ? `${metaUpdateApi}/${meta._id}` : metaCreateApi;
    const method = isUpdate ? "put" : "post";

    axios({
      method,
      url: apiUrl,
      data: formData,
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {meta ? "Update Meta Content" : "Create Meta Content"}
        </Typography>
        <TextField
          name="metaTitle"
          label="Meta Title"
          value={formData.metaTitle}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.metaTitle}
          helperText={errors.metaTitle}
        />
        <TextField
          name="metaDescription"
          label="Meta Description"
          value={formData.metaDescription}
          onChange={handleChange}
          fullWidth
          multiline
          rows={8}
          sx={{ mb: 2 }}
          required
          error={!!errors.metaDescription}
          helperText={errors.metaDescription}
        />
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" style={{ color: "black" }} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
            {meta ? "Update" : "Create"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

MetaContentForm.propTypes = {
  meta: PropTypes.shape({
    _id: PropTypes.string,
    metaTitle: PropTypes.string,
    metaDescription: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default MetaContentForm;
