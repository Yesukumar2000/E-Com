import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { contactGetApi } from "../../../../Utils/Urls";

function ContactUsList({ onEdit, onCreate, refreshTrigger }) {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(contactGetApi)
      .then((response) => {
        setContactData(response.data || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contact info:", error);
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

  if (!contactData || !contactData._id) {
    return (
      <Box p={2}>
        <Typography>No Contact Us info found.</Typography>
        <Button variant="contained" onClick={onCreate} sx={{ mt: 2 }}>
          Create Contact Info
        </Button>
      </Box>
    );
  }

  const columns = [
    { Header: "Email", accessor: "contactEmail", align: "left" },
    { Header: "Phone", accessor: "contactNumber", align: "left" },
    { Header: "Facebook", accessor: "facebookLink", align: "left" },
    { Header: "Instagram", accessor: "instagramLink", align: "left" },
    { Header: "Google Plus", accessor: "googlePlusLink", align: "left" },
    { Header: "Twitter", accessor: "twitterLink", align: "left" },
    { Header: "YouTube", accessor: "youtubeLink", align: "left" },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      Cell: () => (
        <Button variant="contained" style={{ color: "white" }} onClick={() => onEdit(contactData)}>
          Edit
        </Button>
      ),
    },
  ];

  const rows = [
    {
      contactEmail: contactData.contactEmail,
      contactNumber: contactData.contactNumber,
      facebookLink: contactData.facebookLink,
      instagramLink: contactData.instagramLink,
      googlePlusLink: contactData.googlePlusLink,
      twitterLink: contactData.twitterLink,
      youtubeLink: contactData.youtubeLink,
      actions: "",
    },
  ];

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Contact Us Information
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

ContactUsList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default ContactUsList;
