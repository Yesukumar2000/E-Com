import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { imageBaseUrl, generalGetApi } from "../../../../Utils/Urls";

function GeneralList({ onEdit, onCreate, refreshTrigger }) {
  const [generalDoc, setGeneralDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(generalGetApi)
      .then((response) => {
        setGeneralDoc(response.data || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching general info:", error);
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

  if (!generalDoc || !generalDoc._id) {
    return (
      <Box p={2}>
        <Typography>No general settings found.</Typography>
        <Button variant="contained" onClick={onCreate} sx={{ mt: 2 }}>
          Create
        </Button>
      </Box>
    );
  }

  const columns = [
    { Header: "Site Name", accessor: "siteName", align: "left" },
    { Header: "Footer Copyright", accessor: "footerCopyright", align: "left" },
    { Header: "Currency Symbol", accessor: "currencySymbol", align: "left" },
    {
      Header: "Site Logo",
      accessor: "siteLogo",
      align: "center",
      // eslint-disable-next-line react/prop-types
      Cell: ({ cell: { value } }) =>
        value ? (
          <Avatar src={`${imageBaseUrl}/${value}`} alt="Site Logo" sx={{ width: 90, height: 90 }} />
        ) : (
          <Avatar sx={{ width: 75, height: 75 }}>N/A</Avatar>
        ),
    },
    {
      Header: "Footer Logo",
      accessor: "footerLogo",
      align: "center",
      // eslint-disable-next-line react/prop-types
      Cell: ({ cell: { value } }) =>
        value ? (
          <Avatar
            src={`${imageBaseUrl}/${value}`}
            alt="Footer Logo"
            sx={{ width: 90, height: 90 }}
          />
        ) : (
          <Avatar sx={{ width: 75, height: 75 }}>N/A</Avatar>
        ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      Cell: () => (
        <Button variant="contained" style={{ color: "white" }} onClick={() => onEdit(generalDoc)}>
          Edit
        </Button>
      ),
    },
  ];

  const rows = [
    {
      siteName: generalDoc.siteName,
      footerCopyright: generalDoc.footerCopyright,
      currencySymbol: generalDoc.currencySymbol,
      siteLogo: generalDoc.siteLogo,
      footerLogo: generalDoc.footerLogo,
      actions: "",
    },
  ];

  const tableData = { columns, rows };

  return (
    <Box p={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        General Information
      </Typography>
      <DataTable
        table={tableData}
        isSorted={false}
        entriesPerPage={false}
        showTotalEntries={false}
        noEndBorder
      />
    </Box>
  );
}

GeneralList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default GeneralList;
