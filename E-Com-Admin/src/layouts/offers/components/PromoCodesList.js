import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { promocodeGetApi, promocodeDeleteApi } from "../../../Utils/Urls";

const ActionCell = ({ row, onEdit, handleDelete, promos }) => {
  const promo = promos[row.index];
  return (
    <>
      <Button onClick={() => onEdit(promo)}>Edit</Button>
      <Button style={{ color: "red" }} onClick={() => handleDelete(promo._id)}>
        Delete
      </Button>
    </>
  );
};

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  promos: PropTypes.array.isRequired,
};

const ActionsCellRenderer = ({ row, onEdit, handleDelete, promos }) => (
  <ActionCell row={row} onEdit={onEdit} handleDelete={handleDelete} promos={promos} />
);

ActionsCellRenderer.propTypes = {
  row: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  promos: PropTypes.array.isRequired,
};

const PromoCodesList = ({ onEdit, refreshTrigger }) => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(promocodeGetApi)
      .then((response) => {
        setPromos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching promo codes:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    axios
      .put(`${promocodeDeleteApi}/${id}`)
      .then(() => {
        setPromos(promos.filter((promo) => promo._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting promo code:", error);
      });
  };

  const columns = [
    { Header: "Coupon Code", accessor: "couponCode", align: "left" },
    { Header: "Discount %", accessor: "discountPercentage", align: "center" },
    { Header: "Max Discount Price", accessor: "maxDiscountPrice", align: "center" },
    { Header: "Min Order Price", accessor: "minOrderPrice", align: "center" },
    { Header: "Use Per User", accessor: "usePerUser", align: "center" },
    { Header: "Expiry Date", accessor: "expiryDate", align: "center" },
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
          promos={promos}
        />
      ),
    },
  ];

  const rows = promos.map((promo) => ({
    couponCode: promo.couponCode,
    discountPercentage: promo.discountPercentage,
    maxDiscountPrice: promo.maxDiscountPrice,
    minOrderPrice: promo.minOrderPrice,
    usePerUser: promo.usePerUser,
    expiryDate: new Date(promo.expiryDate).toLocaleDateString(),
    actionButtons: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Promo Codes
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
                  <Typography>No promo codes found.</Typography>
                </Box>
              ) : null
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

PromoCodesList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default PromoCodesList;
