import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { contactCreateApi, contactUpdateApi } from "../../../../Utils/Urls";

function ContactUsForm({ data, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    contactEmail: "",
    contactNumber: "",
    facebookLink: "",
    instagramLink: "",
    googlePlusLink: "",
    twitterLink: "",
    youtubeLink: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({
        contactEmail: data.contactEmail || "",
        contactNumber: data.contactNumber || "",
        facebookLink: data.facebookLink || "",
        instagramLink: data.instagramLink || "",
        googlePlusLink: data.googlePlusLink || "",
        twitterLink: data.twitterLink || "",
        youtubeLink: data.youtubeLink || "",
      });
    } else {
      setFormData({
        contactEmail: "",
        contactNumber: "",
        facebookLink: "",
        instagramLink: "",
        googlePlusLink: "",
        twitterLink: "",
        youtubeLink: "",
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
    if (!formData.contactEmail) newErrors.contactEmail = "Email is required";
    if (!formData.contactNumber) newErrors.contactNumber = "Phone number is required";
    if (!formData.facebookLink) newErrors.facebookLink = "Facebook link is required";
    if (!formData.instagramLink) newErrors.instagramLink = "Instagram link is required";
    if (!formData.googlePlusLink) newErrors.googlePlusLink = "Google Plus link is required";
    if (!formData.twitterLink) newErrors.twitterLink = "Twitter link is required";
    if (!formData.youtubeLink) newErrors.youtubeLink = "YouTube link is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const isUpdate = !!data;
    const url = isUpdate ? `${contactUpdateApi}/${data._id}` : contactCreateApi;
    try {
      await axios({
        method: isUpdate ? "put" : "post",
        url,
        data: formData,
        headers: { "Content-Type": "application/json" },
      });
      onSuccess();
    } catch (error) {
      console.error("Error saving contact info:", error);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {data ? "Update Contact Us Information" : "Create Contact Us Information"}
        </Typography>
        <TextField
          name="contactEmail"
          label="Email"
          value={formData.contactEmail}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.contactEmail}
          helperText={errors.contactEmail}
        />
        <TextField
          name="contactNumber"
          label="Phone Number"
          value={formData.contactNumber}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.contactNumber}
          helperText={errors.contactNumber}
        />
        <TextField
          name="facebookLink"
          label="Facebook"
          value={formData.facebookLink}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.facebookLink}
          helperText={errors.facebookLink}
        />
        <TextField
          name="instagramLink"
          label="Instagram"
          value={formData.instagramLink}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.instagramLink}
          helperText={errors.instagramLink}
        />
        <TextField
          name="googlePlusLink"
          label="Google Plus"
          value={formData.googlePlusLink}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.googlePlusLink}
          helperText={errors.googlePlusLink}
        />
        <TextField
          name="twitterLink"
          label="Twitter"
          value={formData.twitterLink}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.twitterLink}
          helperText={errors.twitterLink}
        />
        <TextField
          name="youtubeLink"
          label="YouTube"
          value={formData.youtubeLink}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          error={!!errors.youtubeLink}
          helperText={errors.youtubeLink}
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

ContactUsForm.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    contactEmail: PropTypes.string,
    contactNumber: PropTypes.string,
    facebookLink: PropTypes.string,
    instagramLink: PropTypes.string,
    googlePlusLink: PropTypes.string,
    twitterLink: PropTypes.string,
    youtubeLink: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ContactUsForm;
