import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { permissionCreateApi, permissionUpdateApi } from "../../../Utils/Urls";

function PermissionForm({ permission, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    tab: "",
    actions: { create: false, edit: false, delete: false },
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (permission) {
      // Parse actions string into booleans
      const actionsObj = { create: false, edit: false, delete: false };
      if (permission.actions) {
        permission.actions.split(",").forEach((act) => {
          const trimmed = act.trim();
          if (trimmed in actionsObj) {
            actionsObj[trimmed] = true;
          }
        });
      }
      setFormData({
        tab: permission.tab || "",
        actions: actionsObj,
      });
    } else {
      setFormData({
        tab: "",
        actions: { create: false, edit: false, delete: false },
      });
    }
  }, [permission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, actions: { ...prev.actions, [name]: checked } }));
    setErrors((prev) => ({ ...prev, actions: "" }));
  };

  const handleSelectAllChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      actions: { create: checked, edit: checked, delete: checked },
    }));
    setErrors((prev) => ({ ...prev, actions: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.tab) newErrors.tab = "Tab is required";
    // Ensure at least one action is selected
    const actionsValues = Object.values(formData.actions);
    if (!actionsValues.some((val) => val === true)) {
      newErrors.actions = "At least one action must be selected";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert actions object into a comma-separated string (only actions that are true)
    const actionsArr = [];
    Object.keys(formData.actions).forEach((action) => {
      if (formData.actions[action]) actionsArr.push(action);
    });

    const submissionData = {
      tab: formData.tab,
      actions: actionsArr.join(","),
    };

    const apiUrl = permission ? `${permissionUpdateApi}/${permission._id}` : permissionCreateApi;
    const method = permission ? "put" : "post";

    axios({
      method,
      url: apiUrl,
      data: submissionData,
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        onSuccess();
        setFormData({ tab: "", actions: { create: false, edit: false, delete: false } });
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {permission ? "Update Permission" : "Add Permission"}
        </Typography>
        <TextField
          name="tab"
          label="Tab Permission"
          value={formData.tab}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.tab}
          helperText={errors.tab}
        />
        <Box sx={{ mb: 2 }}>
          <Box display="flex" alignItems="left">
            <FormControlLabel
              control={
                <Checkbox
                  name="selectAll"
                  onChange={handleSelectAllChange}
                  checked={
                    formData.actions.create && formData.actions.edit && formData.actions.delete
                  }
                />
              }
            />
            <Typography variant="subtitle1" gutterBottom>
              Action Permissions
            </Typography>
          </Box>
          <Box sx={{ marginLeft: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="create"
                  checked={formData.actions.create}
                  onChange={handleCheckboxChange}
                />
              }
              label="Create"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="edit"
                  checked={formData.actions.edit}
                  onChange={handleCheckboxChange}
                />
              }
              label="Edit"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="delete"
                  checked={formData.actions.delete}
                  onChange={handleCheckboxChange}
                />
              }
              label="Delete"
            />
          </Box>
          {errors.actions && (
            <Typography variant="caption" color="error">
              {errors.actions}
            </Typography>
          )}
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" style={{ color: "black" }} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
            {permission ? "Update" : "Add"} Permission
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

PermissionForm.propTypes = {
  permission: PropTypes.shape({
    _id: PropTypes.string,
    tab: PropTypes.string,
    actions: PropTypes.string, // comma-separated string
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PermissionForm;
