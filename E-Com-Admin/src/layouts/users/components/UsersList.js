import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Avatar, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { imageBaseUrl, userGetApi, userDeleteApi } from "../../../Utils/Urls";

const ActionCell = ({ row, onEdit, handleDelete, users }) => {
  const user = users[row.index];
  return (
    <>
      <Button onClick={() => onEdit(user)}>Edit</Button>
      <Button style={{ color: "red" }} onClick={() => handleDelete(user._id)}>
        Delete
      </Button>
    </>
  );
};

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};

const ActionsCellRenderer = ({ row, onEdit, handleDelete, users }) => (
  <ActionCell row={row} onEdit={onEdit} handleDelete={handleDelete} users={users} />
);

ActionsCellRenderer.propTypes = {
  row: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};

const UsersList = ({ onEdit, refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(userGetApi)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    axios
      .put(`${userDeleteApi}/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const columns = [
    { Header: "User ID", accessor: "userId", align: "left" },
    {
      Header: "Image",
      accessor: "image",
      align: "center",
      // eslint-disable-next-line react/prop-types
      Cell: ({ cell: { value } }) =>
        value ? (
          <Avatar
            // eslint-disable-next-line react/prop-types
            src={value.startsWith("http") ? value : `${imageBaseUrl}/${value}`}
            alt="User"
            sx={{ width: 50, height: 50 }}
          />
        ) : (
          <Avatar sx={{ width: 50, height: 50 }}>U</Avatar>
        ),
    },
    { Header: "Name", accessor: "name", align: "left" },
    { Header: "Last Name", accessor: "lastname", align: "left" },
    { Header: "Email", accessor: "email", align: "left" },
    { Header: "Mobile No", accessor: "mobile_no", align: "left" },
    {
      Header: "Role",
      accessor: "role",
      align: "left",
      // eslint-disable-next-line react/prop-types
      Cell: ({ cell: { value } }) => (value ? value.name : "N/A"),
    },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      // eslint-disable-next-line react/prop-types
      Cell: ({ row }) => (
        <ActionsCellRenderer row={row} onEdit={onEdit} handleDelete={handleDelete} users={users} />
      ),
    },
  ];

  const rows = users.map((user) => ({
    userId: user.userId || `U-${user._id.slice(-4)}`,
    image: user.image,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    mobile_no: user.mobile_no,
    role: user.role, // Ensure role is passed correctly
    actions: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Users
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
                  <Typography>No users found.</Typography>
                </Box>
              ) : null
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

UsersList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default UsersList;
