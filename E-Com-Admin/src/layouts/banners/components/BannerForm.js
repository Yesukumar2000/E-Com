import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { imageBaseUrl, bannerCreateApi, bannerUpdateApi, bannerGetApi } from "../../../Utils/Urls";

function BannerForm({ banner, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    banner_Type: "",
    name: "",
    scrollOrderNo: "",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [existingBanners, setExistingBanners] = useState([]);

  // Fetch existing banners for uniqueness check
  useEffect(() => {
    axios
      .get(bannerGetApi)
      .then((response) => {
        setExistingBanners(response.data);
      })
      .catch((error) => console.error("Error fetching banners", error));
  }, []);

  useEffect(() => {
    if (banner) {
      setFormData({
        banner_Type: banner.banner_Type || "",
        name: banner.name || "",
        scrollOrderNo: banner.scrollOrderNo ? banner.scrollOrderNo.toString() : "",
      });
      if (banner.image) {
        const imageUrl = banner.image.startsWith("http")
          ? banner.image
          : `${imageBaseUrl}/${banner.image}`;
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl(null);
      }
      setFile(null);
    } else {
      setFormData({ banner_Type: "", name: "", scrollOrderNo: "" });
      setPreviewUrl(null);
      setFile(null);
    }
  }, [banner]);

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
      setPreviewUrl(banner?.image ? `${imageBaseUrl}/${banner.image}` : null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.banner_Type) newErrors.banner_Type = "Banner type is required";
    if (!formData.name) newErrors.name = "Banner name is required";
    if (!formData.scrollOrderNo) {
      newErrors.scrollOrderNo = "Scroll order number is required";
    } else {
      const orderNo = Number(formData.scrollOrderNo);
      if (isNaN(orderNo)) {
        newErrors.scrollOrderNo = "Scroll order must be a valid number";
      } else {
        // Check uniqueness among banners with the same banner_Type.
        const exists = existingBanners.find(
          (b) =>
            b.banner_Type === formData.banner_Type &&
            b.scrollOrderNo === orderNo &&
            (!banner || b._id !== banner._id)
        );
        if (exists) {
          newErrors.scrollOrderNo = `This scroll order number already exists in ${formData.banner_Type}, try another number`;
        }
      }
    }

    if (!file && !banner?.image) newErrors.image = "Banner image is required"; // Validate image

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const submissionData = new FormData();
    submissionData.append("banner_Type", formData.banner_Type);
    submissionData.append("name", formData.name);
    submissionData.append("scrollOrderNo", formData.scrollOrderNo);
    if (file) {
      submissionData.append("image", file);
    }
    const apiUrl = banner ? `${bannerUpdateApi}/${banner._id}` : bannerCreateApi;
    axios({
      method: banner ? "put" : "post",
      url: apiUrl,
      data: submissionData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        onSuccess();
        setFormData({ banner_Type: "", name: "", scrollOrderNo: "" });
        setPreviewUrl(null);
        setFile(null);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {banner ? "Update Banner" : "Add Banner"}
        </Typography>
        <FormControl fullWidth required error={errors.banner_Type}>
          <InputLabel id="Banner-select-label">Banner Type</InputLabel>
          <Select
            label="Banner Type"
            labelId="Banner-select-label"
            name="banner_Type"
            id="Banner-select"
            value={formData.banner_Type}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2, height: "40px" }}
            required
            select
          >
            <MenuItem value="Homepage">Homepage</MenuItem>
            <MenuItem value="Category">Category</MenuItem>
          </Select>
          {errors.banner_Type && (
            <Typography variant="caption" color="error" sx={{ mb: 2, display: "block" }}>
              {errors.banner_Type}
            </Typography>
          )}
        </FormControl>
        <TextField
          name="name"
          label="Banner Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          name="scrollOrderNo"
          label="Scroll Order No"
          value={formData.scrollOrderNo}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.scrollOrderNo}
          helperText={errors.scrollOrderNo}
        />
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" style={{ color: "white" }} component="label">
            Upload Banner Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {/* Image Preview */}
          {previewUrl && (
            <Box mt={2} required>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: "200px", maxHeight: "200px", display: "block" }}
              />
            </Box>
          )}

          {/* Recommended Image Size Message */}
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: "block" }}>
            Recommended size is 3.1 (1200x400) pixels
          </Typography>

          {/* Validation Error Message for Image */}
          {errors.image && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
              {errors.image}
            </Typography>
          )}
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" style={{ color: "black" }} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
            {banner ? "Update" : "Add"} Banner
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

BannerForm.propTypes = {
  banner: PropTypes.shape({
    _id: PropTypes.string,
    banner_Type: PropTypes.string,
    name: PropTypes.string,
    image: PropTypes.string,
    scrollOrderNo: PropTypes.number,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default BannerForm;
