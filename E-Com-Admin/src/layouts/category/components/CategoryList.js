import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { imageBaseUrl, categoryGetApi, categoryDeleteApi } from "../../../Utils/Urls";
const ActionCell = ({ row, onEdit, handleDelete, categories }) => {
  const cat = categories[row.index];
  return (
    <>
      <Button onClick={() => onEdit(cat)}>Edit</Button>
      <Button style={{ color: "red" }} onClick={() => handleDelete(cat._id)}>
        Delete
      </Button>
    </>
  );
};

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};

const ActionsCellRenderer = ({ row, onEdit, handleDelete, categories }) => (
  <ActionCell row={row} onEdit={onEdit} handleDelete={handleDelete} categories={categories} />
);

ActionsCellRenderer.propTypes = {
  row: PropTypes.shape({
    index: PropTypes.number.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};

const CategoryList = ({ onEdit, refreshTrigger }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${categoryGetApi}`)
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    axios.put(`${categoryDeleteApi}/${id}`).then(() => {
      setCategories(categories.filter((cat) => cat._id !== id));
    });
  };

  const columns = [
    { Header: "Category ID", accessor: "categoryId", align: "left" },
    { Header: "Name", accessor: "name", align: "left" },
    {
      Header: "Image",
      accessor: "categoryImage",
      align: "center",
      // eslint-disable-next-line react/prop-types
      Cell: ({ cell: { value } }) => {
        if (value) {
          // eslint-disable-next-line react/prop-types
          const imageUrl = value.startsWith("http") ? value : `${imageBaseUrl}/${value}`;
          return (
            <img src={imageUrl} alt="Category" style={{ maxWidth: "100px", maxHeight: "100px" }} />
          );
        } else {
          return "No Image";
        }
      },
    },
    // {
    //   Header: "Status",
    //   accessor: "status",
    //   align: "center",
    //   Cell: ({ cell: { value } }) => (value === 1 ? "Active" : "Inactive"),
    // },
    // { Header: "Area", accessor: "area", align: "left" },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      // eslint-disable-next-line react/prop-types
      Cell: ({ row }) => (
        <ActionsCellRenderer
          row={row}
          onEdit={onEdit}
          handleDelete={handleDelete}
          categories={categories}
        />
      ),
    },
  ];

  const rows = categories.map((cat) => ({
    categoryId: cat.categoryId,
    name: cat.name,
    categoryImage: cat.categoryImage,
    // status: cat.status,
    // area: cat.area,
    actions: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Categories
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
              rows.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <Typography>No categories found.</Typography>
                </Box>
              ) : null
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

CategoryList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default CategoryList;
