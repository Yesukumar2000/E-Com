import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { policyCreateApi, policyUpdateApi } from "../../../../Utils/Urls";

function PolicyForm({ data, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    termsAndConditions: "",
    shippingPolicy: "",
    privacyPolicy: "",
    returnPolicy: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        termsAndConditions: data.termsAndConditions || "",
        shippingPolicy: data.shippingPolicy || "",
        privacyPolicy: data.privacyPolicy || "",
        returnPolicy: data.returnPolicy || "",
      });
    } else {
      setFormData({
        termsAndConditions: "",
        shippingPolicy: "",
        privacyPolicy: "",
        returnPolicy: "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.termsAndConditions)
      newErrors.termsAndConditions = "Terms and Conditions are required";
    if (!formData.shippingPolicy) newErrors.shippingPolicy = "Shipping Policy is required";
    if (!formData.privacyPolicy) newErrors.privacyPolicy = "Privacy Policy is required";
    if (!formData.returnPolicy) newErrors.returnPolicy = "Return Policy is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const isUpdate = !!data;
    const url = isUpdate ? `${policyUpdateApi}/${data._id}` : policyCreateApi;
    const method = isUpdate ? "put" : "post";

    axios({
      method,
      url,
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
          {data ? "Update Policy" : "Create Policy"}
        </Typography>
        <TextField
          name="termsAndConditions"
          label="Terms and Conditions"
          value={formData.termsAndConditions}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
          required
          error={!!errors.termsAndConditions}
          helperText={errors.termsAndConditions}
        />
        <TextField
          name="shippingPolicy"
          label="Shipping Policy"
          value={formData.shippingPolicy}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
          required
          error={!!errors.shippingPolicy}
          helperText={errors.shippingPolicy}
        />
        <TextField
          name="privacyPolicy"
          label="Privacy Policy"
          value={formData.privacyPolicy}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
          required
          error={!!errors.privacyPolicy}
          helperText={errors.privacyPolicy}
        />
        <TextField
          name="returnPolicy"
          label="Return Policy"
          value={formData.returnPolicy}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
          required
          error={!!errors.returnPolicy}
          helperText={errors.returnPolicy}
        />
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" style={{ color: "black" }} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
            {data ? "Update" : "Create"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

PolicyForm.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    termsAndConditions: PropTypes.string,
    shippingPolicy: PropTypes.string,
    privacyPolicy: PropTypes.string,
    returnPolicy: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PolicyForm;
