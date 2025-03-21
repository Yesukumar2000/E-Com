import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Avatar, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { imageBaseUrl, bannerGetApi, bannerDeleteApi } from "../../../Utils/Urls";

const ActionCell = ({ row, onEdit, handleDelete, banners }) => {
  const banner = banners[row.index];
  return (
    <>
      <Button onClick={() => onEdit(banner)}>Edit</Button>
      <Button style={{ color: "red" }} onClick={() => handleDelete(banner._id)}>
        Delete
      </Button>
    </>
  );
};

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  banners: PropTypes.array.isRequired,
};

const ActionsCellRenderer = ({ row, onEdit, handleDelete, banners }) => (
  <ActionCell row={row} onEdit={onEdit} handleDelete={handleDelete} banners={banners} />
);

ActionsCellRenderer.propTypes = {
  row: PropTypes.shape({ index: PropTypes.number.isRequired }).isRequired,
  onEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  banners: PropTypes.array.isRequired,
};

const BannerList = ({ onEdit, refreshTrigger }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(bannerGetApi)
      .then((response) => {
        setBanners(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching banners:", error);
        setLoading(false);
      });
  }, [refreshTrigger]);

  const handleDelete = (id) => {
    axios
      .put(`${bannerDeleteApi}/${id}`)
      .then(() => {
        setBanners(banners.filter((banner) => banner._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting banner:", error);
      });
  };

  const columns = [
    { Header: "Banner Type", accessor: "banner_Type", align: "left" },
    { Header: "Banner Name", accessor: "name", align: "left" },
    { Header: "Scroll Order", accessor: "scrollOrderNo", align: "center" },
    {
      Header: "Image",
      accessor: "image",
      align: "center",
      // eslint-disable-next-line react/prop-types
      Cell: ({ cell: { value } }) => {
        if (value) {
          // eslint-disable-next-line react/prop-types
          const imageUrl = value.startsWith("http") ? value : `${imageBaseUrl}/${value}`;
          return (
            <img
              src={imageUrl}
              alt="Banner image"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          );
        } else {
          return "No Image";
        }
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
          banners={banners}
        />
      ),
    },
  ];

  const rows = banners.map((banner) => ({
    banner_Type: banner.banner_Type,
    name: banner.name,
    scrollOrderNo: banner.scrollOrderNo,
    image: banner.image,
    actionButtons: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Banners
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <DataTable
            table={tableData}
            isSorted={false}
            entriesPerPage={true}
            showTotalEntries={true}
            EndBorder
            empty={
              rows.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <Typography>No banners found.</Typography>
                </Box>
              ) : null
            }
          />
        )}
      </CardContent>
    </Card>
  );
};

BannerList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default BannerList;
