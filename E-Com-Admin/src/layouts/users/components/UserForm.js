import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  MenuItem,
  Avatar,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import PropTypes from "prop-types";
import { imageBaseUrl, userCreateApi, userUpdateApi, roleGetApi } from "../../../Utils/Urls";

function UserForm({ user, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    mobile_no: "",
    password: "",
    confirmPassword: "",
    gender: "",
    user_type: "Admin",
    role: "", // new role field (expects a role ObjectId)
  });
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    // Fetch available roles for the dropdown
    setLoadingRoles(true);
    axios
      .get(roleGetApi)
      .then((response) => {
        setRoles(response.data);
        setLoadingRoles(false);
      })
      .catch((error) => {
        console.error("Error fetching roles", error);
        setLoadingRoles(false);
      });

    if (user) {
      setFormData({
        name: user.name || "",
        lastname: user.lastname || "",
        email: user.email || "",
        mobile_no: user.mobile_no || "",
        password: "", // leave blank on update
        confirmPassword: "",
        gender: user.gender || "",
        user_type: user.user_type || "Admin",
        role: user.role ? user.role._id : "",
      });
      if (user.image) {
        const imageUrl = user.image.startsWith("http")
          ? user.image
          : `${imageBaseUrl}/${user.image}`;
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl(null);
      }
      setFile(null);
    } else {
      setFormData({
        name: "",
        lastname: "",
        email: "",
        mobile_no: "",
        password: "",
        confirmPassword: "",
        gender: "",
        user_type: "Admin",
        role: "",
      });
      setPreviewUrl(null);
      setFile(null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(user?.image ? `${imageBaseUrl}/${user.image}` : null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "First name is required";
    if (!formData.lastname) newErrors.lastname = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";
    }
    if (!formData.mobile_no) newErrors.mobile_no = "Mobile number is required";
    else {
      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(formData.mobile_no))
        newErrors.mobile_no = "Mobile number must be 10 digits";
    }
    if (!user) {
      if (!formData.password) newErrors.password = "Password is required";
      if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
      if (
        formData.password &&
        formData.confirmPassword &&
        formData.password !== formData.confirmPassword
      ) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      if (formData.password && !passwordRegex.test(formData.password)) {
        newErrors.password =
          "Password must be at least 8 characters, include one uppercase, one number and one special character";
      }
    }
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const submissionData = new FormData();
    for (const key in formData) {
      if (key !== "confirmPassword") {
        submissionData.append(key, formData[key]);
      }
    }
    if (file) {
      submissionData.append("image", file);
    }
    const apiUrl = user ? `${userUpdateApi}/${user._id}` : userCreateApi;
    const method = user ? "put" : "post";

    axios({
      method,
      url: apiUrl,
      data: submissionData,
      // headers: { "Content-Type": "multipart/form-data" },
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        onSuccess();
        setFormData({
          name: "",
          lastname: "",
          email: "",
          mobile_no: "",
          password: "",
          confirmPassword: "",
          gender: "",
          user_type: "Admin",
          role: "",
        });
        setPreviewUrl(null);
        setFile(null);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="center" mb={2}>
          {previewUrl ? (
            <Avatar src={previewUrl} sx={{ width: 100, height: 100 }} />
          ) : (
            <Avatar sx={{ width: 100, height: 100 }}>U</Avatar>
          )}
        </Box>
        <TextField
          name="name"
          label="First Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          name="lastname"
          label="Last Name"
          value={formData.lastname}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.lastname}
          helperText={errors.lastname}
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => {}} // Here you can add your email uniqueness check if needed
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.email}
          helperText={errors.email}
          disabled={!!user}
        />
        <TextField
          name="mobile_no"
          label="Mobile No"
          value={formData.mobile_no}
          onChange={handleChange}
          onBlur={() => {}} // Here you can add your mobile number uniqueness check if needed
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.mobile_no}
          helperText={errors.mobile_no}
          disabled={!!user}
        />
        {!user && (
          <>
            <FormControl variant="outlined" fullWidth sx={{ mb: 2 }} required>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                disabled={!!user}
              />
              {errors.password && (
                <Typography variant="caption" color="error">
                  {errors.password}
                </Typography>
              )}
            </FormControl>
            <FormControl variant="outlined" fullWidth sx={{ mb: 2 }} required>
              <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
              <OutlinedInput
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleConfirmPasswordVisibility} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
                disabled={!!user}
              />
              {errors.confirmPassword && (
                <Typography variant="caption" color="error">
                  {errors.confirmPassword}
                </Typography>
              )}
            </FormControl>
          </>
        )}
        <FormControl fullWidth sx={{ mb: 2 }} required>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            name="gender"
            value={formData.gender}
            label="Gender"
            onChange={handleChange}
            sx={{ mb: 2, height: "40px" }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          {errors.gender && (
            <Typography variant="caption" color="error">
              {errors.gender}
            </Typography>
          )}
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }} required>
          <InputLabel id="userType-label">User Type</InputLabel>
          <Select
            labelId="userType-label"
            name="user_type"
            value={formData.user_type}
            label="User Type"
            onChange={handleChange}
            sx={{ mb: 2, height: "40px" }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
          {errors.user_type && (
            <Typography variant="caption" color="error">
              {errors.user_type}
            </Typography>
          )}
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }} required>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            name="role"
            value={formData.role}
            label="Role"
            onChange={handleChange}
            sx={{ mb: 2, height: "40px" }}
          >
            {/* Fetch roles from your backend if available.
                For example, you might map over roles fetched via roleGetApi.
                For now, we include a sample option. */}
            <MenuItem value="">Select Role</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role._id} value={role._id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
          {errors.role && (
            <Typography variant="caption" color="error">
              {errors.role}
            </Typography>
          )}
        </FormControl>
        <Button variant="contained" component="label" sx={{ mb: 2 }}>
          Upload Profile Picture
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {user ? "Update" : "Add"} User
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

UserForm.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    mobile_no: PropTypes.string,
    image: PropTypes.string,
    gender: PropTypes.string,
    user_type: PropTypes.string,
    role: PropTypes.object, // populated role
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default UserForm;
