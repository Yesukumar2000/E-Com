import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { costCreateApi, costUpdateApi, productTypeGetApi } from "../../../../Utils/Urls";

function CostForm({ costRecord, onSuccess, onCancel }) {
  const [costPerGram, setCostPerGram] = useState("");
  const [selectedProductType, setSelectedProductType] = useState("");
  const [existingCost, setExistingCost] = useState(null);
  const [productTypes, setProductTypes] = useState([]);
  const [error, setError] = useState("");

  // Fetch product types for dropdown
  useEffect(() => {
    axios
      .get(productTypeGetApi)
      .then((res) => setProductTypes(res.data))
      .catch((err) => console.error("Error fetching product types:", err));
  }, []);

  // Fetch the cost record if editing; in a multiple-record scenario, this might come from a parent
  useEffect(() => {
    if (costRecord) {
      setExistingCost(costRecord);
      setCostPerGram(costRecord.costPerGram);

      // Ensure productType is an ID (string)
      setSelectedProductType(
        typeof costRecord.productType === "object"
          ? costRecord.productType._id
          : costRecord.productType
      );
    } else {
      setSelectedProductType("");
    }
  }, [costRecord]);

  const handleSubmit = async () => {
    if (!costPerGram || !selectedProductType) {
      setError("Both Cost per Gram and Product Type are required");
      return;
    }
    setError("");
    try {
      const payload = { costPerGram, productType: selectedProductType };
      if (existingCost) {
        await axios.put(`${costUpdateApi}/${existingCost._id}`, payload);
      } else {
        await axios.post(costCreateApi, payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving cost:", err);
      setError(err.response?.data?.message || "Error saving cost");
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {existingCost ? "Update Cost" : "Add Cost"}
        </Typography>
        <TextField
          label="Cost Per Gram"
          fullWidth
          value={costPerGram}
          onChange={(e) => setCostPerGram(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth sx={{ mb: 2 }} required error={!!error}>
          <InputLabel id="product-type-select-label">Product Type</InputLabel>
          <Select
            labelId="product-type-select-label"
            id="product-type-select"
            name="productType"
            fullWidth
            sx={{ mb: 2, height: "40px" }}
            value={selectedProductType}
            label="Product Type"
            onChange={(e) => setSelectedProductType(e.target.value)}
          >
            <MenuItem value="">Select Product Type</MenuItem>
            {productTypes.map((pt) => (
              <MenuItem key={pt._id} value={pt._id}>
                {pt.name}
              </MenuItem>
            ))}
          </Select>
          {error && <Box sx={{ color: "red", fontSize: "0.75rem" }}>Product Type is required</Box>}
        </FormControl>
        {error && (
          <Typography variant="caption" color="error" sx={{ mb: 2, display: "block" }}>
            {error}
          </Typography>
        )}
        <>
          <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            style={{ color: "black" }}
            sx={{ ml: 2, color: "black" }}
          >
            Cancel
          </Button>
        </>
      </CardContent>
    </Card>
  );
}

CostForm.propTypes = {
  costRecord: PropTypes.shape({
    _id: PropTypes.string,
    costPerGram: PropTypes.number,
    productType: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CostForm;
