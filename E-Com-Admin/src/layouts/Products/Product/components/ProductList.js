/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import PropTypes from "prop-types";
import { productGetApi, productDeleteApi, costGetApi, imageBaseUrl } from "../../../../Utils/Urls";

function ProductList({ onEdit, refreshTrigger }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [costs, setCosts] = useState([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get(productGetApi)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product data:", err);
        setLoading(false);
      });
  }, [refreshTrigger]);
  useEffect(() => {
    axios
      .get(costGetApi)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setCosts(data);
      })
      .catch((err) => {
        console.error("Error fetching cost records:", err);
      });
  }, []);
  const handleDelete = (id) => {
    axios
      .put(`${productDeleteApi}/${id}`)
      .then(() => {
        setProducts(products.filter((p) => p._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting product:", err);
      });
  };
  // Look up cost details for a given product_type id
  const getCostInfo = (productTypeObj) => {
    if (!productTypeObj || !productTypeObj._id) return "N/A";
    const costRecord = costs.find((c) => c._id === productTypeObj._id);
    if (costRecord && costRecord.productType && costRecord.productType.name) {
      return `Type: ${costRecord.productType.name} | Cost: ${costRecord.costPerGram} gram`;
    }
    return "N/A";
  };
  const getCalculatedPrice = (product) => {
    // If it's a direct product, use the saved price
    if (product.whichProduct === "direct") {
      return product.price;
    }
    // For weight-based products, calculate price using weight and costPerGram
    if (product.weight && product.product_type && product.product_type._id) {
      const costRecord = costs.find((c) => c._id === product.product_type._id);
      if (costRecord && costRecord.costPerGram) {
        return product.weight * costRecord.costPerGram;
      }
    }
    return "N/A";
  };
  const columns = [
    { Header: "Which Product", accessor: "whichProduct", align: "center", maxWidth: 200 },
    {
      Header: "Cost Info",
      accessor: "product_type",
      align: "center",
      width: 200,
      Cell: ({ cell: { value } }) => getCostInfo(value),
    },
    {
      Header: "Category",
      accessor: "category",
      align: "center",
      width: 250,
      Cell: ({ cell: { value } }) => (value && value.name ? value.name : "N/A"),
    },
    {
      Header: "Subcategory",
      accessor: "subcategory",
      align: "center",
      Cell: ({ cell: { value } }) => (value && value.name ? value.name : "N/A"),
    },
    { Header: "Name", accessor: "name", align: "center" },
    {
      Header: "Images",
      accessor: "images",
      align: "center",
      Cell: ({ cell: { value } }) =>
        value && value.length > 0
          ? value.map((img, i) => (
              <img
                key={i}
                src={img.startsWith("http") ? img : `${imageBaseUrl}/${img}`}
                alt="product"
                style={{ width: 50, height: 50, marginRight: 5 }}
              />
            ))
          : "No Images",
    },
    { Header: "Stock", accessor: "stock", align: "center" },
    { Header: "Weight", accessor: "weight", align: "center" },
    // { Header: "Price", accessor: "price", align: "center" },
    {
      Header: "Calculated Price",
      accessor: "calculatedPrice",
      align: "center",
      Cell: ({ row }) => getCalculatedPrice(products[row.index]),
    },
    {
      Header: "Actions",
      accessor: "actionButtons",
      align: "center",
      Cell: ({ row }) => (
        <Box>
          <Button
            variant="contained"
            onClick={() => onEdit(products[row.index])}
            style={{ mr: 1, color: "white" }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 1 }}
            style={{ color: "white" }}
            onClick={() => handleDelete(products[row.index]._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const rows = [...products].map((p) => ({
    whichProduct: p.whichProduct,
    product_type: p.product_type,
    category: p.category,
    subcategory: p.subcategory,
    name: p.name,
    images: p.images,
    weight: p.weight,
    stock: p.stock,
    price: p.price,
    actionButtons: "",
  }));

  const tableData = { columns, rows };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Product Management
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <DataTable
            table={tableData}
            isSorted={true}
            entriesPerPage={false}
            showTotalEntries={true}
            EndBorder
            empty={
              rows.length === 0 && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <Typography>No product records found.</Typography>
                </Box>
              )
            }
          />
        )}
      </CardContent>
    </Card>
  );
}

ProductList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  refreshTrigger: PropTypes.any,
};

export default ProductList;
// /* eslint-disable react/prop-types */
// import React, { useState, useEffect } from "react";
// import { Card, CardContent, Typography, Box, Button } from "@mui/material";
// import DataTable from "examples/Tables/DataTable";
// import axios from "axios";
// import PropTypes from "prop-types";
// import { productGetApi, productDeleteApi } from "../../../../Utils/Urls";

// function ProductList({ onEdit, refreshTrigger }) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     axios
//       .get(productGetApi)
//       .then((res) => {
//         // Ensure response is an array
//         const data = Array.isArray(res.data) ? res.data : [res.data];
//         setProducts(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching product data:", err);
//         setLoading(false);
//       });
//   }, [refreshTrigger]);

//   const handleDelete = (id) => {
//     axios
//       .put(`${productDeleteApi}/${id}`)
//       .then(() => {
//         setProducts(products.filter((p) => p._id !== id));
//       })
//       .catch((err) => {
//         console.error("Error deleting product:", err);
//       });
//   };

//   const columns = [
//     { Header: "Which Product", accessor: "whichProduct", align: "center" },
//     {
//       Header: "Cost Info",
//       accessor: "product_type",
//       align: "center",
//       Cell: ({ cell: { value } }) =>
//         // If populated, display the productType name from the Cost document.
//         value && value.productType && value.productType.name
//           ? value.productType.name
//           : value && value.costPerGram
//           ? `Cost: ${value.costPerGram}`
//           : "N/A",
//     },
//     {
//       Header: "Category",
//       accessor: "category",
//       align: "center",
//       Cell: ({ cell: { value } }) => (value && value.name ? value.name : value),
//     },
//     {
//       Header: "Subcategory",
//       accessor: "subcategory",
//       align: "center",
//       Cell: ({ cell: { value } }) => (value && value.name ? value.name : value),
//     },
//     { Header: "Name", accessor: "name", align: "center" },
//     {
//       Header: "Images",
//       accessor: "images",
//       align: "center",
//       Cell: ({ cell: { value } }) =>
//         value && value.length > 0
//           ? value.map((img, i) => (
//               <img
//                 key={i}
//                 src={img}
//                 alt="product"
//                 style={{ width: 50, height: 50, marginRight: 5 }}
//               />
//             ))
//           : "No Images",
//     },
//     { Header: "Weight", accessor: "weight", align: "center" },
//     { Header: "Stock", accessor: "stock", align: "center" },
//     { Header: "Price", accessor: "price", align: "center" },
//     {
//       Header: "Actions",
//       accessor: "actionButtons",
//       align: "center",
//       Cell: ({ row }) => (
//         <Box>
//           <Button
//             variant="contained"
//             onClick={() => onEdit(products[row.index])}
//             sx={{ color: "white" }}
//           >
//             Edit
//           </Button>
//           <Button
//             variant="contained"
//             sx={{ ml: 1, color: "white" }}
//             onClick={() => handleDelete(products[row.index]._id)}
//           >
//             Delete
//           </Button>
//         </Box>
//       ),
//     },
//   ];

//   const rows = products.map((p) => ({
//     whichProduct: p.whichProduct,
//     product_type: p.product_type, // expects populated Cost document
//     category: p.category,
//     subcategory: p.subcategory,
//     name: p.name,
//     images: p.images,
//     weight: p.weight,
//     stock: p.stock,
//     price: p.price,
//     actionButtons: "",
//   }));

//   const tableData = { columns, rows };

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           Product Management
//         </Typography>
//         {loading ? (
//           <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//             <Typography>Loading...</Typography>
//           </Box>
//         ) : (
//           <DataTable
//             table={tableData}
//             isSorted={false}
//             entriesPerPage={false}
//             showTotalEntries={false}
//             noEndBorder
//             empty={
//               rows.length === 0 && (
//                 <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//                   <Typography>No product records found.</Typography>
//                 </Box>
//               )
//             }
//           />
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// ProductList.propTypes = {
//   onEdit: PropTypes.func.isRequired,
//   refreshTrigger: PropTypes.any,
// };

// export default ProductList;
