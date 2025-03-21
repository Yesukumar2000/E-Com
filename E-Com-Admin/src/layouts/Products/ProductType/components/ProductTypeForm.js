import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { productTypeCreateApi, productTypeUpdateApi } from "../../../../Utils/Urls";

function ProductTypeForm({ productType, onSuccess, onCancel }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (productType) {
      setName(productType.name || "");
    } else {
      setName("");
    }
  }, [productType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Product type name is required");
      return;
    }
    setError("");

    try {
      if (productType) {
        // Update: append the id to the update endpoint
        await axios.put(`${productTypeUpdateApi}/${productType._id}`, { name });
      } else {
        // Create new product type
        await axios.post(productTypeCreateApi, { name });
      }
      onSuccess();
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.message || "Error saving product type");
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {productType ? "Update Product Type" : "Add Product Type"}
        </Typography>
        <TextField
          label="Product Type"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" style={{ color: "black" }} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
            {productType ? "Update" : "Add"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

ProductTypeForm.propTypes = {
  productType: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ProductTypeForm;
