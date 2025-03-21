import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { metaGetApi } from "../../../../Utils/Urls";
import styled from "@emotion/styled";

function MetaContentList({ onEdit, onCreate, refreshTrigger }) {
  const [metaContents, setMetaContents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(metaGetApi)
      .then((response) => {
        // If the backend returns a single document, wrap it in an array.
        const data = response.data
          ? Array.isArray(response.data)
            ? response.data
            : [response.data]
          : [];
        setMetaContents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching meta content:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const columns = [
    { Header: "Meta Title", accessor: "metaTitle", align: "left" },
    {
      Header: "Meta Description",
      accessor: "metaDescription",
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
      // eslint-disable-next-line react/prop-types
      Cell: ({ row }) => (
        // eslint-disable-next-line react/prop-types
        <Button
          variant="contained"
          style={{ color: "white" }}
          // eslint-disable-next-line react/prop-types
          onClick={() => onEdit(metaContents[row.index])}
        >
          Edit
        </Button>
      ),
    },
  ];

  const rows = metaContents.map((meta) => ({
    metaTitle: meta.metaTitle,
    metaDescription: meta.metaDescription,
    actions: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Meta Content
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography>Loading...</Typography>
          </Box>
        ) : rows.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <Typography>No meta content found.</Typography>
            <Button
              variant="contained"
              style={{ color: "white" }}
              onClick={onCreate}
              sx={{ mt: 2 }}
            >
              Create Meta Content
            </Button>
          </Box>
        ) : (
          <DataTable
            table={tableData}
            isSorted={false}
            entriesPerPage={false}
            showTotalEntries={false}
            noEndBorder
          />
        )}
      </CardContent>
    </Card>
  );
}

MetaContentList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default MetaContentList;
