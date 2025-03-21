/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { aboutGetApi, imageBaseUrl } from "../../../../Utils/Urls";

function AboutList({ onEdit, onCreate, refreshTrigger }) {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(aboutGetApi)
      .then((response) => {
        // If backend returns a single document, use it; otherwise, set null
        setAboutData(response.data || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching about content:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Box p={2}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!aboutData || !aboutData._id) {
    return (
      <Box p={2}>
        <Typography>No About content found.</Typography>
        <Box mt={2}>
          <Button variant="contained" onClick={onCreate}>
            Create About Content
          </Button>
        </Box>
      </Box>
    );
  }

  // Create table columns
  const columns = [
    {
      Header: "Image",
      accessor: "image",
      align: "center",
      Cell: ({ cell: { value } }) =>
        value ? (
          <img
            src={value.startsWith("http") ? value : `${imageBaseUrl}/${value}`}
            alt="About"
            style={{ maxWidth: "250px", maxHeight: "130px" }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      Header: "Content",
      accessor: "content",
      align: "left",
      // eslint-disable-next-line react/prop-types
      Cell: ({ cell: { value } }) => (
        <div style={{ width: "500px", height: "200px", overflowY: "auto" }}>{value}</div>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      Cell: ({ row }) => (
        <Button variant="contained" style={{ color: "white" }} onClick={() => onEdit(aboutData)}>
          Edit
        </Button>
      ),
    },
  ];

  // Wrap the single record in an array to create one table row
  const rows = [
    {
      content: aboutData.content,
      image: aboutData.image,
      actions: "",
    },
  ];

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          About Content
        </Typography>
        <DataTable
          table={tableData}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          noEndBorder
        />
      </CardContent>
    </Card>
  );
}

AboutList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default AboutList;
