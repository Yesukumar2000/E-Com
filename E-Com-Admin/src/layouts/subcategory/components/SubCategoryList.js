import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { imageBaseUrl, subCategoryGetApi, subCategoryDeleteApi } from "../../../Utils/Urls";

const ActionCell = ({ row, onEdit, handleDelete, subCategories }) => {
  const subCat = subCategories[row.index];
  return (
    <>
      <Button onClick={() => onEdit(subCat)}>Edit</Button>
      <Button style={{ color: "red" }} onClick={() => handleDelete(subCat._id)}>
        Delete
      </Button>
    </>
  );
};

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  subCategories: PropTypes.array.isRequired,
};

const ActionsCellRenderer = ({ row, onEdit, handleDelete, subCategories }) => (
  <ActionCell row={row} onEdit={onEdit} handleDelete={handleDelete} subCategories={subCategories} />
);

ActionsCellRenderer.propTypes = {
  row: PropTypes.shape({
    index: PropTypes.number.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  subCategories: PropTypes.array.isRequired,
};

const SubCategoryList = ({ onEdit, refreshTrigger }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${subCategoryGetApi}`)
      .then((response) => {
        setSubCategories(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    axios.put(`${subCategoryDeleteApi}/${id}`).then(() => {
      setSubCategories(subCategories.filter((subCat) => subCat._id !== id));
    });
  };

  const columns = [
    { Header: "SubCategory ID", accessor: "subCategoryId", align: "left" },
    { Header: "Name", accessor: "name", align: "left" },
    {
      Header: "Image",
      accessor: "subCategoryImage",
      align: "center",
      // eslint-disable-next-line react/prop-types
      Cell: ({ cell: { value } }) => {
        if (value) {
          // eslint-disable-next-line react/prop-types
          const imageUrl = value.startsWith("http") ? value : `${imageBaseUrl}/${value}`;
          return (
            <img
              src={imageUrl}
              alt="SubCategory"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
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
    {
      Header: "Category",
      accessor: "category",
      align: "left",
      Cell: ({ cell: { value } }) => {
        // If the category is populated, display its name
        // eslint-disable-next-line react/prop-types
        return value && value.name ? value.name : "N/A";
      },
    },
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
          subCategories={subCategories}
        />
      ),
    },
  ];

  const rows = subCategories.map((subCat) => ({
    subCategoryId: subCat.subCategoryId,
    name: subCat.name,
    subCategoryImage: subCat.subCategoryImage,
    // status: subCat.status,
    category: subCat.category, // expecting populated category
    actions: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          SubCategories
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
                  <Typography>No subcategories found.</Typography>
                </Box>
              ) : null
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

SubCategoryList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default SubCategoryList;
