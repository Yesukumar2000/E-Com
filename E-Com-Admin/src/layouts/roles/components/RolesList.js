import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { roleGetApi, roleDeleteApi } from "../../../Utils/Urls";

const ActionCell = ({ row, onEdit, handleDelete, roles }) => {
  const role = roles[row.index];
  return (
    <>
      <Button onClick={() => onEdit(role)}>Edit</Button>
      <Button style={{ color: "red" }} onClick={() => handleDelete(role._id)}>
        Delete
      </Button>
    </>
  );
};

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
};

const ActionsCellRenderer = ({ row, onEdit, handleDelete, roles }) => (
  <ActionCell row={row} onEdit={onEdit} handleDelete={handleDelete} roles={roles} />
);

ActionsCellRenderer.propTypes = {
  row: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
};

const RolesList = ({ onEdit, refreshTrigger }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(roleGetApi)
      .then((response) => {
        setRoles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    axios
      .put(`${roleDeleteApi}/${id}`)
      .then(() => {
        setRoles(roles.filter((role) => role._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting role:", error);
      });
  };

  const columns = [
    { Header: "Role ID", accessor: "roleId", align: "left" },
    { Header: "Role Name", accessor: "name", align: "left" },
    {
      Header: "Permissions",
      accessor: "permissions",
      align: "center",
      Cell: ({ cell: { value }, row }) => {
        const role = roles[row.index];
        if (role.permissions && role.permissions.length > 0) {
          return role.permissions.map((perm) => perm.tab).join(", ");
        }
        return "";
      },
    },
    {
      Header: "Actions",
      accessor: "actionButtons",
      align: "center",
      // eslint-disable-next-line react/prop-types
      Cell: ({ row }) => (
        <Box>
          <ActionsCellRenderer
            row={row}
            onEdit={onEdit}
            handleDelete={handleDelete}
            roles={roles}
          />
        </Box>
      ),
    },
  ];

  const rows = roles.map((role) => ({
    roleId: role.roleId || `ROLE-${role._id.slice(-4)}`,
    name: role.name,
    permissions: role.permissions,
    actionButtons: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Roles
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
                  <Typography>No roles found.</Typography>
                </Box>
              ) : null
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

RolesList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default RolesList;
