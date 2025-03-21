import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { promocodeCreateApi, promocodeUpdateApi } from "../../../Utils/Urls";

function PromoCodeForm({ promo, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    couponCode: "",
    discountPercentage: "",
    maxDiscountPrice: "",
    minOrderPrice: "",
    usePerUser: "",
    expiryDate: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (promo) {
      setFormData({
        couponCode: promo.couponCode || "",
        discountPercentage: promo.discountPercentage || "",
        maxDiscountPrice: promo.maxDiscountPrice || "",
        minOrderPrice: promo.minOrderPrice || "",
        usePerUser: promo.usePerUser || "",
        expiryDate: promo.expiryDate ? new Date(promo.expiryDate).toISOString().substr(0, 10) : "",
      });
    } else {
      setFormData({
        couponCode: "",
        discountPercentage: "",
        maxDiscountPrice: "",
        minOrderPrice: "",
        usePerUser: "",
        expiryDate: "",
      });
    }
  }, [promo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.couponCode) newErrors.couponCode = "Coupon code is required";
    if (!formData.discountPercentage)
      newErrors.discountPercentage = "Discount percentage is required";
    if (!formData.maxDiscountPrice) newErrors.maxDiscountPrice = "Max discount price is required";
    if (!formData.minOrderPrice) newErrors.minOrderPrice = "Min order price is required";
    if (!formData.usePerUser) newErrors.usePerUser = "Usage per user is required";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...formData };
    // Convert numeric fields
    payload.discountPercentage = Number(payload.discountPercentage);
    payload.maxDiscountPrice = Number(payload.maxDiscountPrice);
    payload.minOrderPrice = Number(payload.minOrderPrice);
    payload.usePerUser = Number(payload.usePerUser);

    const apiUrl = promo ? `${promocodeUpdateApi}/${promo._id}` : promocodeCreateApi;
    const method = promo ? "put" : "post";
    axios({
      method,
      url: apiUrl,
      data: payload,
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        onSuccess();
        setFormData({
          couponCode: "",
          discountPercentage: "",
          maxDiscountPrice: "",
          minOrderPrice: "",
          usePerUser: "",
          expiryDate: "",
        });
      })
      .catch((error) => {
        console.error("API Error:", error);
        if (error.response && error.response.data && error.response.data.message) {
          // If backend returns a validation error message, you can set it
          setErrors({ form: error.response.data.message });
        }
      });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {errors.form && (
          <Typography variant="subtitle1" color="error" sx={{ mb: 2 }}>
            {errors.form}
          </Typography>
        )}
        <Typography variant="h6" sx={{ mb: 2 }}>
          {promo ? "Update Promo Code" : "Add Promo Code"}
        </Typography>
        <TextField
          name="couponCode"
          label="Coupon Code"
          value={formData.couponCode}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.couponCode}
          helperText={errors.couponCode}
        />
        <TextField
          name="discountPercentage"
          label="Discount Percentage"
          value={formData.discountPercentage}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.discountPercentage}
          helperText={errors.discountPercentage}
        />
        <TextField
          name="maxDiscountPrice"
          label="Max Discount Price"
          value={formData.maxDiscountPrice}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.maxDiscountPrice}
          helperText={errors.maxDiscountPrice}
        />
        <TextField
          name="minOrderPrice"
          label="Min Order Price"
          value={formData.minOrderPrice}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.minOrderPrice}
          helperText={errors.minOrderPrice}
        />
        <TextField
          name="usePerUser"
          label="Use Per User"
          value={formData.usePerUser}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.usePerUser}
          helperText={errors.usePerUser}
        />
        <TextField
          name="expiryDate"
          label="Expiry Date"
          type="date"
          value={formData.expiryDate}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          InputLabelProps={{ shrink: true }}
          error={!!errors.expiryDate}
          helperText={errors.expiryDate}
        />
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" style={{ color: "black" }} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
            {promo ? "Update" : "Add"} Promo Code
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

PromoCodeForm.propTypes = {
  promo: PropTypes.shape({
    _id: PropTypes.string,
    couponCode: PropTypes.string,
    discountPercentage: PropTypes.number,
    maxDiscountPrice: PropTypes.number,
    minOrderPrice: PropTypes.number,
    usePerUser: PropTypes.number,
    expiryDate: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PromoCodeForm;
