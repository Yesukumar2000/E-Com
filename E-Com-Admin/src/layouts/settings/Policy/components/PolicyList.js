/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { policyGetApi } from "../../../../Utils/Urls";

function PolicyList({ onEdit, onCreate, refreshTrigger }) {
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(policyGetApi)
      .then((response) => {
        setPolicyData(response.data || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching policy info:", error);
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

  if (!policyData || !policyData._id) {
    return (
      <Box p={2}>
        <Typography>No policy information found.</Typography>
        <Button variant="contained" onClick={onCreate} sx={{ mt: 2 }}>
          Create Policy
        </Button>
      </Box>
    );
  }

  const columns = [
    {
      Header: "Terms and Conditions",
      accessor: "termsAndConditions",
      align: "left",
      Cell: ({ value }) => (
        <Box sx={{ maxWidth: 400, maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap" }}>
          {value}
        </Box>
      ),
    },
    {
      Header: "Shipping Policy",
      accessor: "shippingPolicy",
      align: "left",
      Cell: ({ value }) => (
        <Box sx={{ maxWidth: 400, maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap" }}>
          {value}
        </Box>
      ),
    },
    {
      Header: "Privacy Policy",
      accessor: "privacyPolicy",
      align: "left",
      Cell: ({ value }) => (
        <Box sx={{ maxWidth: 400, maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap" }}>
          {value}
        </Box>
      ),
    },
    {
      Header: "Return Policy",
      accessor: "returnPolicy",
      align: "left",
      Cell: ({ value }) => (
        <Box sx={{ maxWidth: 400, maxHeight: 200, overflowY: "auto", whiteSpace: "pre-wrap" }}>
          {value}
        </Box>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      Cell: () => (
        <Button variant="contained" style={{ color: "white" }} onClick={() => onEdit(policyData)}>
          Edit
        </Button>
      ),
    },
  ];

  const rows = [
    {
      termsAndConditions: policyData.termsAndConditions,
      shippingPolicy: policyData.shippingPolicy,
      privacyPolicy: policyData.privacyPolicy,
      returnPolicy: policyData.returnPolicy,
      actions: "",
    },
  ];

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Policy Information
        </Typography>
        <DataTable
          table={tableData}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          EndBorder
        />
      </CardContent>
    </Card>
  );
}

PolicyList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default PolicyList;
