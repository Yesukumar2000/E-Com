import React, { useState, useEffect } from "react";
import { Card, CardContent, TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { aboutCreateApi, aboutUpdateApi, imageBaseUrl } from "../../../../Utils/Urls";

function AboutForm({ data, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    content: "",
  });
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (data) {
      setFormData({
        content: data.content || "",
      });
      if (data.image) {
        const imageUrl = data.image.startsWith("http")
          ? data.image
          : `${imageBaseUrl}/${data.image}`;
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl(null);
      }
      setFile(null);
    } else {
      setFormData({ content: "" });
      setPreviewUrl(null);
      setFile(null);
    }
  }, [data]);

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
      setPreviewUrl(data?.image ? `${imageBaseUrl}/${data.image}` : null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.content) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const submissionData = new FormData();
    submissionData.append("content", formData.content);
    if (file) {
      submissionData.append("image", file);
    }
    const isUpdate = !!data;
    const apiUrl = isUpdate ? `${aboutUpdateApi}/${data._id}` : aboutCreateApi;
    axios({
      method: isUpdate ? "put" : "post",
      url: apiUrl,
      data: submissionData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        onSuccess();
        setFormData({ content: "" });
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
          {data ? "Update About Content" : "Create About Content"}
        </Typography>
        <TextField
          name="content"
          label="Content"
          value={formData.content}
          onChange={handleChange}
          fullWidth
          multiline
          rows={6}
          sx={{ mb: 2 }}
          required
          error={!!errors.content}
          helperText={errors.content}
        />
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" style={{ color: "white" }} component="label">
            Upload Image
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
            {data ? "Update" : "Create"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

AboutForm.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    content: PropTypes.string,
    image: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AboutForm;
