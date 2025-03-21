import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { roleCreateApi, roleUpdateApi, permissionGetApi } from "../../../Utils/Urls";

function RoleForm({ role, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    permissions: [], // Array of permission ids
  });
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch available permissions
  useEffect(() => {
    setLoading(true);
    axios
      .get(permissionGetApi)
      .then((response) => {
        setAvailablePermissions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching permissions", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        // Assuming role.permissions is an array of permission objects:
        permissions: role.permissions ? role.permissions.map((perm) => perm._id) : [],
      });
    } else {
      setFormData({
        name: "",
        permissions: [],
      });
    }
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      let newPermissions = [...prev.permissions];
      if (checked) {
        newPermissions.push(value);
      } else {
        newPermissions = newPermissions.filter((id) => id !== value);
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Role name is required";
    // Optionally, you can enforce at least one permission
    // if (formData.permissions.length === 0) newErrors.permissions = "At least one permission must be selected";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      name: formData.name,
      permissions: formData.permissions, // send as array
    };
    const apiUrl = role ? `${roleUpdateApi}/${role._id}` : roleCreateApi;
    const method = role ? "put" : "post";
    axios({
      method,
      url: apiUrl,
      data: payload,
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        onSuccess();
        setFormData({ name: "", permissions: [] });
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  if (loading) return <CircularProgress />;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {role ? "Update Role" : "Add Role"}
        </Typography>
        <TextField
          name="name"
          label="Role Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Permissions
          </Typography>
          {availablePermissions.map((perm) => (
            <FormControlLabel
              key={perm._id}
              control={
                <Checkbox
                  value={perm._id}
                  checked={formData.permissions.includes(perm._id)}
                  onChange={handleCheckboxChange}
                />
              }
              label={`${perm.tab} (${perm.actions})`}
            />
          ))}
          {errors.permissions && (
            <Typography variant="caption" color="error">
              {errors.permissions}
            </Typography>
          )}
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" style={{ color: "black" }} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
            {role ? "Update" : "Add"} Role
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

RoleForm.propTypes = {
  role: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    permissions: PropTypes.array, // Array of permission objects
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RoleForm;
