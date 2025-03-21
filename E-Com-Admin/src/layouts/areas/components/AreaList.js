import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { areaGetApi, areaDeleteApi } from "../../../Utils/Urls";

const ActionCell = ({ row, onEdit, handleDelete, areas }) => {
  const area = areas[row.index];
  return (
    <>
      <Button onClick={() => onEdit(area)}>Edit</Button>
      <Button style={{ color: "red" }} onClick={() => handleDelete(area._id)}>
        Delete
      </Button>
    </>
  );
};

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  areas: PropTypes.array.isRequired,
};

const ActionsCellRenderer = ({ row, onEdit, handleDelete, areas }) => (
  <ActionCell row={row} onEdit={onEdit} handleDelete={handleDelete} areas={areas} />
);

ActionsCellRenderer.propTypes = {
  row: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  areas: PropTypes.array.isRequired,
};

const AreaList = ({ onEdit, refreshTrigger }) => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(areaGetApi)
      .then((response) => {
        setAreas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    axios
      .put(`${areaDeleteApi}/${id}`)
      .then(() => {
        setAreas(areas.filter((area) => area._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting area:", error);
      });
  };

  const columns = [
    { Header: "Area ID", accessor: "areaId", align: "left" },
    { Header: "Area Name", accessor: "areaName", align: "left" },
    {
      Header: "Category",
      accessor: "category",
      align: "left",
      Cell: ({ cell: { value } }) => {
        if (value && Array.isArray(value) && value.length > 0) {
          const categoryNames = value.map((cat) => cat.name);
          if (categoryNames.length <= 3) {
            return categoryNames.join(", ");
          } else {
            return `${categoryNames.slice(0, 3).join(", ")} ...`;
          }
        } else {
          return "N/A";
        }
      },
    },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      // eslint-disable-next-line react/prop-types
      Cell: ({ row }) => (
        <ActionsCellRenderer row={row} onEdit={onEdit} handleDelete={handleDelete} areas={areas} />
      ),
    },
  ];

  const rows = areas.map((area) => ({
    areaId: area.areaId,
    areaName: area.areaName,
    category: area.category,
    actions: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Areas
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <DataTable
            table={tableData}
            isSorted={true}
            entriesPerPage={true}
            showTotalEntries={true}
            EndBorder
            empty={
              rows.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <Typography>No areas found.</Typography>
                </Box>
              ) : null
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

AreaList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default AreaList;
