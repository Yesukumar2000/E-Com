/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { productTypeGetApi } from "../../../../Utils/Urls";

function ProductTypeList({ onEdit, refreshTrigger }) {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(productTypeGetApi)
      .then((res) => {
        setProductTypes(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product types:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const columns = [
    { Header: "Product Type", accessor: "name", align: "left" },
    {
      Header: "Actions",
      accessor: "actionButtons",
      align: "center",

      Cell: ({ row }) => (
        <Button
          variant="contained"
          style={{ color: "white" }}
          onClick={() => onEdit(productTypes[row.index])}
        >
          Edit
        </Button>
      ),
    },
  ];

  const rows = productTypes.map((type) => ({
    name: type.name,
    actionButtons: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Product Types
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography>Loading...</Typography>
          </Box>
        ) : productTypes.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <Typography>No product types found.</Typography>
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

ProductTypeList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default ProductTypeList;
