import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { companyDetailsCreateApi, companyDetailsUpdateApi } from "../../../../Utils/Urls";

function CompanyDetailsForm({ company, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    companyName: "",
    gstNo: "",
    mobileNo: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || "",
        gstNo: company.gstNo || "",
        mobileNo: company.mobileNo || "",
        email: company.email || "",
        address: company.address || "",
      });
    } else {
      setFormData({
        companyName: "",
        gstNo: "",
        mobileNo: "",
        email: "",
        address: "",
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Company Name is required";
    if (!formData.gstNo) {
      newErrors.gstNo = "GST No is required";
    } else if (
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(formData.gstNo)
    ) {
      newErrors.gstNo = "Invalid GST No";
    }

    if (!formData.mobileNo) {
      newErrors.mobileNo = "Mobile No is required";
    } else if (!/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = "Mobile No must be 10 digits";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { ...formData };
    const isUpdate = !!company;
    const url = isUpdate ? `${companyDetailsUpdateApi}/${company._id}` : companyDetailsCreateApi;
    const method = isUpdate ? "put" : "post";

    axios({
      method,
      url,
      data: payload,
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
          {company ? "Update Company Detail" : "Add Company Detail"}
        </Typography>
        <TextField
          name="companyName"
          label="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.companyName}
          helperText={errors.companyName}
        />
        <TextField
          name="gstNo"
          label="GST No"
          value={formData.gstNo}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.gstNo}
          helperText={errors.gstNo}
        />
        <TextField
          name="mobileNo"
          label="Mobile No"
          value={formData.mobileNo}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.mobileNo}
          helperText={errors.mobileNo}
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          name="address"
          label="Address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.address}
          helperText={errors.address}
        />
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" style={{ color: "black" }} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
            {company ? "Update" : "Add"} Company
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

CompanyDetailsForm.propTypes = {
  company: PropTypes.shape({
    _id: PropTypes.string,
    companyName: PropTypes.string,
    gstNo: PropTypes.string,
    mobileNo: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CompanyDetailsForm;
