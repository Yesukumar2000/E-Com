import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { imageBaseUrl, generalCreateApi, generalUpdateApi } from "../../../../Utils/Urls";

function GeneralForm({ data, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    siteName: "",
    footerCopyright: "",
    currencySymbol: "",
  });
  const [siteLogoFile, setSiteLogoFile] = useState(null);
  const [footerLogoFile, setFooterLogoFile] = useState(null);
  const [siteLogoPreview, setSiteLogoPreview] = useState(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        siteName: data.siteName || "",
        footerCopyright: data.footerCopyright || "",
        currencySymbol: data.currencySymbol || "",
      });
      if (data.siteLogo) {
        setSiteLogoPreview(`${imageBaseUrl}/${data.siteLogo}`);
      }
      if (data.footerLogo) {
        setFooterLogoPreview(`${imageBaseUrl}/${data.footerLogo}`);
      }
    } else {
      setFormData({
        siteName: "",
        footerCopyright: "",
        currencySymbol: "",
      });
      setSiteLogoPreview(null);
      setFooterLogoPreview(null);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSiteLogoChange = (e) => {
    const file = e.target.files[0];
    setSiteLogoFile(file);
    if (file) {
      setSiteLogoPreview(URL.createObjectURL(file));
    } else {
      setSiteLogoPreview(data?.siteLogo ? `${imageBaseUrl}/${data.siteLogo}` : null);
    }
  };

  const handleFooterLogoChange = (e) => {
    const file = e.target.files[0];
    setFooterLogoFile(file);
    if (file) {
      setFooterLogoPreview(URL.createObjectURL(file));
    } else {
      setFooterLogoPreview(data?.footerLogo ? `${imageBaseUrl}/${data.footerLogo}` : null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.siteName) newErrors.siteName = "Site name is required";
    if (!formData.footerCopyright)
      newErrors.footerCopyright = "Footer copyright message is required";
    if (!formData.currencySymbol) newErrors.currencySymbol = "Currency symbol is required";
    if (!siteLogoFile && !data?.siteLogo) newErrors.siteLogo = "Site logo is required";
    if (!footerLogoFile && !data?.footerLogo) newErrors.footerLogo = "Footer logo is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const isUpdate = !!data;
    const url = isUpdate ? generalUpdateApi : generalCreateApi;
    const submissionData = new FormData();
    submissionData.append("siteName", formData.siteName);
    submissionData.append("footerCopyright", formData.footerCopyright);
    submissionData.append("currencySymbol", formData.currencySymbol);

    if (siteLogoFile) {
      submissionData.append("siteLogo", siteLogoFile);
    }
    if (footerLogoFile) {
      submissionData.append("footerLogo", footerLogoFile);
    }
    if (isUpdate && data._id) {
      submissionData.append("id", data._id);
    }

    axios({
      method: isUpdate ? "put" : "post",
      url,
      data: submissionData,
      headers: { "Content-Type": "multipart/form-data" },
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
          {data ? "Update General Settings" : "Create General Settings"}
        </Typography>
        <TextField
          name="siteName"
          label="Site Name"
          value={formData.siteName}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.siteName}
          helperText={errors.siteName}
        />
        <TextField
          name="footerCopyright"
          label="Footer Copyright Message"
          value={formData.footerCopyright}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.footerCopyright}
          helperText={errors.footerCopyright}
        />
        <TextField
          name="currencySymbol"
          label="Currency Symbol"
          value={formData.currencySymbol}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.currencySymbol}
          helperText={errors.currencySymbol}
        />
        <Box display="flex" gap={4} mb={2}>
          <Box>
            <Typography variant="caption">Site Logo</Typography>
            <Button
              variant="contained"
              component="label"
              sx={{ display: "block", mt: 1 }}
              style={{ color: "white" }}
            >
              Upload
              <input type="file" hidden onChange={handleSiteLogoChange} />
            </Button>
            {siteLogoPreview && (
              <Box mt={2}>
                <img
                  src={siteLogoPreview}
                  alt="Site Logo Preview"
                  style={{ maxWidth: "200px", maxHeight: "150px" }}
                />
              </Box>
            )}
            {errors.siteLogo && (
              <Typography variant="caption" color="error">
                {errors.siteLogo}
              </Typography>
            )}
          </Box>
          <Box>
            <Typography variant="caption">Footer Logo</Typography>
            <Button
              variant="contained"
              component="label"
              sx={{ display: "block", mt: 1 }}
              style={{ color: "white" }}
            >
              Upload
              <input type="file" hidden onChange={handleFooterLogoChange} />
            </Button>
            {footerLogoPreview && (
              <Box mt={2}>
                <img
                  src={footerLogoPreview}
                  alt="Footer Logo Preview"
                  style={{ maxWidth: "200px", maxHeight: "150px" }}
                />
              </Box>
            )}
            {errors.footerLogo && (
              <Typography variant="caption" color="error">
                {errors.footerLogo}
              </Typography>
            )}
          </Box>
        </Box>
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

GeneralForm.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    siteName: PropTypes.string,
    footerCopyright: PropTypes.string,
    currencySymbol: PropTypes.string,
    siteLogo: PropTypes.string,
    footerLogo: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default GeneralForm;
