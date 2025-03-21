// CustomerList.js
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Box, Avatar } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { imageBaseUrl, customerDeleteApi, customerGetApi } from "Utils/Urls";

const ActionCell = ({ row, onEdit, handleDelete, customers }) => {
  const customer = customers[row.index];
  return (
    <>
      <Button onClick={() => onEdit(customer)}>Edit</Button>
      <Button style={{ color: "red" }} onClick={() => handleDelete(customer._id)}>
        Delete
      </Button>
    </>
  );
};

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  customers: PropTypes.array.isRequired,
};

const ActionsCellRenderer = ({ row, onEdit, handleDelete, customers }) => (
  <ActionCell row={row} onEdit={onEdit} handleDelete={handleDelete} customers={customers} />
);

ActionsCellRenderer.propTypes = {
  row: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  customers: PropTypes.array.isRequired,
};

const CustomerList = ({ onEdit, refreshTrigger }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(customerGetApi)
      .then((response) => {
        setCustomers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    axios
      .put(`${customerDeleteApi}/${id}`)
      .then(() => {
        setCustomers(customers.filter((customer) => customer._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };

  const columns = [
    { Header: "Image", accessor: "image", align: "center" },
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Last Name", accessor: "lastName", align: "left" },
    { Header: "Email", accessor: "email", align: "left" },
    { Header: "Mobile No", accessor: "mobileNo", align: "left" },
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
          customers={customers}
        />
      ),
    },
  ];

  const rows = customers.map((customer) => ({
    image: customer.profilePic ? (
      <Avatar
        src={
          customer.profilePic.startsWith("http")
            ? customer.profilePic
            : `${imageBaseUrl}/${customer.profilePic}`
        }
        alt={customer.name}
        sx={{ width: 50, height: 50 }}
      />
    ) : (
      <Avatar sx={{ width: 50, height: 50 }}>{customer.name.charAt(0)}</Avatar>
    ),
    name: customer.name,
    lastName: customer.lastName,
    email: customer.email,
    mobileNo: customer.mobileNo,
    actions: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Customers
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
                  <Typography>No customers found.</Typography>
                </Box>
              ) : null
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

CustomerList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default CustomerList;
