import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import PropTypes from "prop-types";
import { imageBaseUrl, customerCreateApi, customerUpdateApi } from "../../../Utils/Urls";

const CustomerForm = ({ customer, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    mobileNo: "",
    password: "",
    profilePic: null,
    user_type: "customer",
  });
  const [errors, setErrors] = useState({
    name: false,
    lastName: false,
    email: false,
    mobileNo: false,
    password: false,
    emailFormat: false, //new validation
    passwordFormat: false, //new validation
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        mobileNo: customer.mobileNo || "",
        password: "", // Keep password empty
        profilePic: customer.profilePic || null, // Keep existing pic reference
        user_type: customer.user_type || "customer",
      });

      if (customer.profilePic) {
        const imageUrl = customer.profilePic.startsWith("http")
          ? customer.profilePic
          : `${imageBaseUrl}/${customer.profilePic}`;
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData({
        name: "",
        lastName: "",
        email: "",
        mobileNo: "",
        password: "",
        profilePic: null,
        user_type: "customer",
      });
      setPreviewUrl(null);
      setFile(null);
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: false, emailFormat: false, passwordFormat: false }); // Reset format errors
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); // Preview the new image
    } else {
      setFile(null);
      setPreviewUrl(customer?.profilePic ? `${imageBaseUrl}/${customer.profilePic}` : null);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    return re.test(password);
  };
  const validateMobileNo = (mobileNo) => {
    const re = /^\d{10}$/;
    return re.test(mobileNo);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    let formValid = true;
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = true;
      formValid = false;
    }
    if (!formData.lastName) {
      newErrors.lastName = true;
      formValid = false;
    }
    if (!formData.email) {
      newErrors.email = true;
      formValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.emailFormat = true;
      formValid = false;
    }
    if (!formData.mobileNo) {
      newErrors.mobileNo = true;
      formValid = false;
    } else if (!customer && formData.mobileNo && !validateMobileNo(formData.mobileNo)) {
      newErrors.mobileNoFormat = true;
      formValid = false;
    }
    if (!customer && !formData.password) {
      newErrors.password = true;
      formValid = false;
    } else if (!customer && formData.password && !validatePassword(formData.password)) {
      newErrors.passwordFormat = true;
      formValid = false;
    }

    setErrors(newErrors);
    if (!formValid) return;

    const apiUrl = customer ? `${customerUpdateApi}/${customer._id}` : `${customerCreateApi}`;
    const method = customer ? "put" : "post";

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key !== "profilePic") {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Append file or keep existing image
    if (file) {
      formDataToSend.append("profilePic", file);
    } else if (customer?.profilePic) {
      formDataToSend.append("profilePic", customer.profilePic);
    }

    try {
      await axios({
        method,
        url: apiUrl,
        data: formDataToSend,
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess();
      setFormData({
        name: "",
        lastName: "",
        email: "",
        mobileNo: "",
        password: "",
        profilePic: null,
        user_type: "customer",
      });
      setPreviewUrl(null);
      setFile(null);
    } catch (error) {
      console.error("API Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {customer ? "Update Customer" : "Add Customer"}
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <TextField
          name="name"
          label="First Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={errors.name}
          helperText={errors.name ? "First Name is required" : ""}
        />
        <TextField
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={errors.lastName}
          helperText={errors.lastName ? "Last Name is required" : ""}
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={errors.email || errors.emailFormat}
          helperText={
            errors.email ? "Email is required" : errors.emailFormat ? "Invalid email format" : ""
          }
          disabled={!!customer}
        />
        <TextField
          name="mobileNo"
          label="Mobile Number"
          value={formData.mobileNo}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={errors.mobileNo}
          helperText={
            errors.mobileNo
              ? "Mobile Number is required"
              : errors.mobileNoFormat
              ? "Invalid Mobile Number"
              : ""
          }
          disabled={!!customer}
        />
        {!customer && (
          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            error={errors.password || errors.passwordFormat}
            helperText={
              errors.password
                ? "Password is required"
                : errors.passwordFormat
                ? "Password must contain at least 8 characters, one uppercase letter, one number, and one special character."
                : ""
            }
            disabled={!!customer}
            InputProps={{
              endAdornment: (
                // eslint-disable-next-line react/jsx-no-undef
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" style={{ color: "white" }} component="label">
            Upload profile picture
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
          <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
            {customer ? "Update" : "Add"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

CustomerForm.propTypes = {
  customer: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    mobileNo: PropTypes.string,
    profilePic: PropTypes.string,
    user_type: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CustomerForm;
