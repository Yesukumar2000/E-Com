import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { companyDetailsGetApi } from "../../../../Utils/Urls";

const ActionCell = ({ row, onEdit, companies }) => {
  const company = companies[row.index];
  return <Button onClick={() => onEdit(company)}>Edit</Button>;
};

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  companies: PropTypes.array.isRequired,
};

const ActionsCellRenderer = ({ row, onEdit, companies }) => (
  <ActionCell row={row} onEdit={onEdit} companies={companies} />
);

ActionsCellRenderer.propTypes = {
  row: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
  onEdit: PropTypes.func.isRequired,
  companies: PropTypes.array.isRequired,
};

function CompanyDetailsList({ onEdit, onCreate, refreshTrigger }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(companyDetailsGetApi)
      .then((response) => {
        setCompanies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching company details:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const columns = [
    { Header: "Company Name", accessor: "companyName", align: "left" },
    { Header: "GST No", accessor: "gstNo", align: "left" },
    { Header: "Mobile No", accessor: "mobileNo", align: "left" },
    { Header: "Email", accessor: "email", align: "left" },
    { Header: "Address", accessor: "address", align: "left" },
    // {
    //   Header: "Actions",
    //   accessor: "actionButtons",
    //   align: "center",
    //   // eslint-disable-next-line react/prop-types
    //   Cell: ({ row }) => <ActionsCellRenderer row={row} onEdit={onEdit} companies={companies} />,
    // },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      // eslint-disable-next-line react/prop-types
      Cell: ({ row }) => (
        <Button
          variant="contained"
          style={{ color: "white" }}
          row={row}
          // eslint-disable-next-line react/prop-types
          onClick={() => onEdit(companies[row.index])}
        >
          Edit
        </Button>
      ),
    },
  ];

  const rows = companies.map((c) => ({
    companyName: c.companyName,
    gstNo: c.gstNo,
    mobileNo: c.mobileNo,
    email: c.email,
    address: c.address,
    actionButtons: "",
  }));

  const tableData = { columns, rows };

  if (loading) {
    return (
      <Box p={2}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (companies.length === 0) {
    return (
      <Box p={2}>
        <Typography>No company details found.</Typography>
        <Button variant="contained" onClick={onCreate} sx={{ mt: 2 }}>
          New Company Details
        </Button>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Company Details
        </Typography>
        <DataTable
          table={tableData}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          noEndBorder
        />
      </CardContent>
    </Card>
  );
}

CompanyDetailsList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default CompanyDetailsList;
