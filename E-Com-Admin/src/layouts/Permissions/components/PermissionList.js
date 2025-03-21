import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { permissionGetApi, permissionDeleteApi } from "../../../Utils/Urls";

const ActionCell = ({ row, onEdit, handleDelete, permissions }) => {
  const permission = permissions[row.index];
  return (
    <>
      <Button onClick={() => onEdit(permission)}>Edit</Button>
      <Button style={{ color: "red" }} onClick={() => handleDelete(permission._id)}>
        Delete
      </Button>
    </>
  );
};

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  permissions: PropTypes.array.isRequired,
};

const ActionsCellRenderer = ({ row, onEdit, handleDelete, permissions }) => (
  <ActionCell row={row} onEdit={onEdit} handleDelete={handleDelete} permissions={permissions} />
);

ActionsCellRenderer.propTypes = {
  row: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  permissions: PropTypes.array.isRequired,
};

const PermissionList = ({ onEdit, refreshTrigger }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(permissionGetApi)
      .then((response) => {
        setPermissions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching permissions:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    axios
      .put(`${permissionDeleteApi}/${id}`)
      .then(() => {
        setPermissions(permissions.filter((perm) => perm._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting permission:", error);
      });
  };

  const columns = [
    { Header: "Permission ID", accessor: "permissionId", align: "left" },
    { Header: "Tab Permission", accessor: "tab", align: "left" },
    {
      Header: "Actions Permissions",
      accessor: "actions",
      align: "left",
      // eslint-disable-next-line react/prop-types
      Cell: ({ row }) => {
        // eslint-disable-next-line react/prop-types
        const perm = permissions[row.index];
        return (
          <Typography variant="body2">
            {perm.actions
              ? perm.actions
                  .split(",")
                  .map((act) => act.trim())
                  .join(", ")
              : ""}
          </Typography>
        );
      },
    },
    {
      Header: "Actions",
      accessor: "actionButtons",
      align: "center",
      // eslint-disable-next-line react/prop-types
      Cell: ({ row }) => (
        <ActionsCellRenderer
          row={row}
          onEdit={onEdit}
          handleDelete={handleDelete}
          permissions={permissions}
        />
      ),
    },
  ];

  const rows = permissions.map((perm) => ({
    permissionId: perm.permissionId,
    tab: perm.tab,
    actions: "",
    actionButtons: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Permissions
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
                  <Typography>No permissions found.</Typography>
                </Box>
              ) : null
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

PermissionList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default PermissionList;
