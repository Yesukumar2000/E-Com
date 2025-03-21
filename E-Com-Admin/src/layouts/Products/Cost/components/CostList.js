/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { costGetApi, costDeleteApi, imageBaseUrl } from "../../../../Utils/Urls";

function CostList({ onEdit, refreshTrigger }) {
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(costGetApi)
      .then((res) => {
        // Ensure that the response is an array
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setCosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cost data:", err);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    axios
      .put(`${costDeleteApi}/${id}`)
      .then(() => {
        setCosts(costs.filter((c) => c._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting cost:", err);
      });
  };

  const columns = [
    { Header: "Cost Per Gram", accessor: "costPerGram", align: "center" },
    {
      Header: "Product Type",
      accessor: "productType",
      align: "center",
      Cell: ({ cell: { value } }) => {
        return value && value.name ? value.name : value;
      },
    },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      Cell: ({ row }) => (
        <Box>
          <Button
            variant="contained"
            onClick={() => onEdit(costs[row.index])}
            style={{ color: "white" }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            style={{ color: "white" }}
            onClick={() => handleDelete(costs[row.index]._id)}
            sx={{ ml: 1 }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const rows = costs.map((c) => ({
    costPerGram: c.costPerGram,
    productType: c.productType,
    actions: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Cost Management
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <DataTable
            table={tableData}
            isSorted={false}
            entriesPerPage={false}
            showTotalEntries={false}
            noEndBorder
            empty={
              rows.length === 0 && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <Typography>No cost records found.</Typography>
                </Box>
              )
            }
          />
        )}
      </CardContent>
    </Card>
  );
}

CostList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default CostList;
