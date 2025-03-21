import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Typography,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import {
  productCreateApi,
  productUpdateApi,
  categoryGetApi,
  subCategoryGetApi,
  costGetApi,
  imageBaseUrl,
} from "../../../../Utils/Urls";

function ProductForm({ product, onSuccess, onCancel }) {
  // "whichProduct" can be "weightBased" or "direct"
  const [whichProduct, setWhichProduct] = useState("");
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    name: "",
    description: "",
    specification: "",
    size: "",
    weight: "",
    stock: "",
  });
  // For direct product, user can manually enter a price
  const [manualPrice, setManualPrice] = useState("");
  // Computed price for weight-based products (read-only), initial 0
  const [computedPrice, setComputedPrice] = useState("0");
  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]);
  const [costDetails, setCostDetails] = useState([]); // Contains cost info including costPerGram
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch categories, subcategories, and cost details on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(categoryGetApi);
        setCategories(categoriesResponse.data);

        const subcategoriesResponse = await axios.get(subCategoryGetApi);
        setSubcategories(subcategoriesResponse.data);

        const costDetailsResponse = await axios.get(costGetApi);
        setCostDetails(costDetailsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      // Determine mode: if weight > 0, use weightBased; otherwise, direct.
      const mode = product.weight && Number(product.weight) > 0 ? "weightBased" : "direct";
      setWhichProduct(mode);
      setFormData({
        category: product.category ? product.category._id : "",
        subcategory: product.subcategory ? product.subcategory._id : "",
        name: product.name || "",
        description: product.description || "",
        specification: product.specification || "",
        size: product.size || "",
        weight: product.weight ? product.weight.toString() : "",
        stock: product.stock ? product.stock.toString() : "",
      });
      if (mode === "direct") {
        setManualPrice(product.price ? product.price.toString() : "");
      } else {
        setComputedPrice(product.price ? product.price.toString() : "0");
      }
      if (product.images) {
        const previews = Array.isArray(product.images)
          ? product.images.map((img) => (img.startsWith("http") ? img : `${imageBaseUrl}/${img}`))
          : [];
        setImagePreviews(previews);
      }
      setSelectedProductType(product.product_type ? product.product_type._id : "");
    } else {
      // Reset form for new product
      setFormData({
        category: "",
        subcategory: "",
        name: "",
        description: "",
        specification: "",
        size: "",
        weight: "",
        stock: "",
      });
      setWhichProduct("");
      setManualPrice("");
      setImagePreviews([]);
      setImages([]);
      setSelectedProductType("");
      setComputedPrice("0");
    }
  }, [product]);

  // Re-calculate computed price for weight-based products
  useEffect(() => {
    if (whichProduct === "weightBased" && formData.weight && selectedProductType) {
      const selectedType = costDetails.find((cd) => cd._id === selectedProductType);
      if (selectedType && selectedType.costPerGram) {
        const priceCalc = Number(formData.weight) * Number(selectedType.costPerGram);
        setComputedPrice(priceCalc.toFixed(2)); // Format to 2 decimals
      } else {
        setComputedPrice("0");
      }
    } else {
      setComputedPrice("0");
    }
  }, [whichProduct, formData.weight, selectedProductType, costDetails]);

  // Generic change handler for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handler for the "Which Product" field
  const handleWhichProductChange = (e) => {
    setWhichProduct(e.target.value);
    if (e.target.value === "direct") {
      setFormData((prev) => ({ ...prev, weight: "" }));
      setSelectedProductType("");
      setComputedPrice("0");
    }
    setErrors((prev) => ({ ...prev, whichProduct: "" }));
  };

  // Handler for product type change (for weight-based products)
  const handleProductTypeChange = (e) => {
    setSelectedProductType(e.target.value);
    setErrors((prev) => ({ ...prev, productType: "" }));
  };

  // Handler for file input change; creates preview URLs
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Validate required fields
  const validate = () => {
    const newErrors = {};
    if (!whichProduct) newErrors.whichProduct = "Please select a product mode";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subcategory) newErrors.subcategory = "Subcategory is required";
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (whichProduct === "weightBased") {
      if (!formData.weight) newErrors.weight = "Weight is required for weight based product";
      if (!selectedProductType)
        newErrors.productType = "Product type is required for weight based product";
    }
    if (whichProduct === "direct") {
      if (!manualPrice) newErrors.manualPrice = "Price is required for direct product";
    }
    if (!formData.stock) newErrors.stock = "Stock is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit the form data to the appropriate API endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const submissionData = new FormData();
    // Append common fields
    for (const key in formData) {
      submissionData.append(key, formData[key]);
    }
    submissionData.append("whichProduct", whichProduct);
    if (whichProduct === "direct") {
      submissionData.append("price", Number(manualPrice));
    }
    if (whichProduct === "weightBased") {
      submissionData.append("product_type", selectedProductType);
      submissionData.append("price", Number(computedPrice));
    }
    images.forEach((file) => {
      submissionData.append("images", file);
    });
    const apiUrl = product ? `${productUpdateApi}/${product._id}` : productCreateApi;
    try {
      await axios({
        method: product ? "put" : "post",
        url: apiUrl,
        data: submissionData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess();
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {product ? "Update Product" : "Add Product"}
        </Typography>
        {/* Which Product Field */}
        <FormControl fullWidth error={!!errors.whichProduct}>
          <InputLabel id="which-product-label">Which Product</InputLabel>
          <Select
            sx={{ mb: 2, height: 40 }}
            labelId="which-product-label"
            value={whichProduct}
            onChange={handleWhichProductChange}
            label="Which Product"
          >
            <MenuItem value="weightBased">Weight Based Product</MenuItem>
            <MenuItem value="direct">Direct Product</MenuItem>
          </Select>
          {errors.whichProduct && (
            <Typography variant="caption" color="error">
              {errors.whichProduct}
            </Typography>
          )}
        </FormControl>
        {/* For weight-based product: show product type, weight, and calculated price */}
        {whichProduct === "weightBased" && (
          <>
            <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.productType}>
              <InputLabel id="product-type-label">Product Type</InputLabel>
              <Select
                sx={{ mb: 1, height: 40 }}
                labelId="product-type-label"
                name="product_type"
                value={selectedProductType}
                onChange={handleProductTypeChange}
                label="Product Type"
              >
                {costDetails.map((cost) => (
                  <MenuItem key={cost._id} value={cost._id}>
                    {cost.productType?.name || "N/A"}
                  </MenuItem>
                ))}
              </Select>
              {errors.productType && (
                <Typography variant="caption" color="error">
                  {errors.productType}
                </Typography>
              )}
            </FormControl>

            <TextField
              name="weight"
              label="Weight (in grams)"
              value={formData.weight}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              required
              error={!!errors.weight}
              helperText={errors.weight}
            />
            <TextField
              label="Price (Calculated As Per Weight)"
              value={computedPrice}
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{ readOnly: true }}
            />
          </>
        )}
        {/* For Direct Product: show editable price */}
        {whichProduct === "direct" && (
          <TextField
            name="manualPrice"
            label="Price"
            value={manualPrice}
            onChange={(e) => setManualPrice(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            required
            error={!!errors.manualPrice}
            helperText={errors.manualPrice}
          />
        )}
        {/* Common Fields */}
        {/* <FormControl fullWidth sx={{ mb: 2 }} required error={!!error}>
         </FormControl> */}
        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.category}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            sx={{ mb: 1, height: 40 }}
            name="category"
            value={formData.category}
            onChange={handleChange}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          {errors.category && (
            <Typography variant="caption" color="error">
              {errors.category}
            </Typography>
          )}
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.subcategory}>
          <InputLabel id="subcategory-label">Subcategory</InputLabel>
          <Select
            labelId="subcategory-label"
            sx={{ mb: 1, height: 40 }}
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            label="Subcategory"
          >
            {subcategories.map((sub) => (
              <MenuItem key={sub._id} value={sub._id}>
                {sub.name}
              </MenuItem>
            ))}
          </Select>
          {errors.subcategory && (
            <Typography variant="caption" color="error">
              {errors.subcategory}
            </Typography>
          )}
        </FormControl>
        <TextField
          name="name"
          label="Product Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
          required
          error={!!errors.description}
          helperText={errors.description}
        />
        <TextField
          name="specification"
          label="Specification"
          value={formData.specification}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <TextField
          name="size"
          label="Size"
          value={formData.size}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          name="stock"
          label="Stock"
          value={formData.stock}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
          required
          error={!!errors.stock}
          helperText={errors.stock}
        />
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" style={{ color: "white" }} component="label">
            Upload Product Images
            <input type="file" multiple hidden onChange={handleImagesChange} />
          </Button>
          {imagePreviews.length > 0 && (
            <Box mt={2} display="flex" gap={2} flexWrap="wrap">
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Preview ${idx}`}
                  style={{ maxWidth: "150px", maxHeight: "150px", objectFit: "cover" }}
                />
              ))}
            </Box>
          )}
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" style={{ color: "black" }} onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
            {product ? "Update" : "Add"} Product
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

ProductForm.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    product_type: PropTypes.object,
    category: PropTypes.object,
    subcategory: PropTypes.object,
    name: PropTypes.string,
    description: PropTypes.string,
    specification: PropTypes.string,
    images: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    size: PropTypes.string,
    weight: PropTypes.number,
    stock: PropTypes.number,
    price: PropTypes.number,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ProductForm;

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Select,
//   FormControl,
//   MenuItem,
//   InputLabel,
// } from "@mui/material";
// import axios from "axios";
// import PropTypes from "prop-types";
// import {
//   productCreateApi,
//   productUpdateApi,
//   costGetApi, // fetching Cost records
//   categoryGetApi,
//   subCategoryGetApi,
// } from "../../../../Utils/Urls";

// function ProductForm({ productRecord, onSuccess, onCancel }) {
//   const [whichProduct, setWhichProduct] = useState("");
//   const [selectedCost, setSelectedCost] = useState(""); // Cost record id
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedSubcategory, setSelectedSubcategory] = useState("");
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [specification, setSpecification] = useState("");
//   const [size, setSize] = useState("");
//   const [weight, setWeight] = useState("");
//   const [stock, setStock] = useState("");
//   const [images, setImages] = useState([]);
//   const [price, setPrice] = useState("");
//   const [costs, setCosts] = useState([]); // List of Cost records
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [error, setError] = useState("");
//   const [imagePreviews, setImagePreviews] = useState([]);

//   // Fetch costs, categories, and subcategories
//   useEffect(() => {
//     axios
//       .get(costGetApi)
//       .then((res) => {
//         const data = Array.isArray(res.data) ? res.data : [res.data];
//         setCosts(data);
//       })
//       .catch((err) => console.error("Error fetching cost records:", err));

//     axios
//       .get(categoryGetApi)
//       .then((res) => setCategories(res.data))
//       .catch((err) => console.error("Error fetching categories:", err));

//     axios
//       .get(subCategoryGetApi)
//       .then((res) => setSubcategories(res.data))
//       .catch((err) => console.error("Error fetching subcategories:", err));
//   }, []);

//   // Populate fields if editing an existing product
//   useEffect(() => {
//     if (productRecord) {
//       setWhichProduct(productRecord.whichProduct || "");
//       setSelectedCost(productRecord.product_type?._id || productRecord.product_type || "");
//       setSelectedCategory(productRecord.category?._id || productRecord.category || "");
//       setSelectedSubcategory(productRecord.subcategory?._id || productRecord.subcategory || "");
//       setName(productRecord.name || "");
//       setDescription(productRecord.description || "");
//       setSpecification(productRecord.specification || "");
//       setSize(productRecord.size || "");
//       setWeight(productRecord.weight || "");
//       setStock(productRecord.stock || "");
//       setImages(Array.isArray(productRecord.images) ? productRecord.images : []);
//       setPrice(productRecord.price || ""); // Existing price from record
//       setImagePreviews(
//         productRecord.images?.map((img) =>
//           img.startsWith("http") ? img : `${imageBaseUrl}/${img}`
//         ) || []
//       );
//     } else {
//       // Reset fields if no productRecord is provided
//       setWhichProduct("");
//       setSelectedCost("");
//       setSelectedCategory("");
//       setSelectedSubcategory("");
//       setName("");
//       setDescription("");
//       setSpecification("");
//       setSize("");
//       setWeight("");
//       setStock("");
//       setImages([]);
//       setPrice("");
//       setImagePreviews([]);
//     }
//   }, [productRecord]);

//   // Dynamically calculate price when weight or selected cost changes
//   useEffect(() => {
//     if (weight && selectedCost && costs.length > 0) {
//       const costRecord = costs.find((c) => c._id === selectedCost);
//       if (costRecord && costRecord.costPerGram) {
//         setPrice(Number(weight) * costRecord.costPerGram);
//       } else {
//         setPrice(0);
//       }
//     } else {
//       setPrice("");
//     }
//   }, [weight, selectedCost, costs]);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages(files);
//     setImagePreviews(files.map((file) => URL.createObjectURL(file)));
//   };

//   const handleSubmit = async () => {
//     // Validate required fields
//     if (!selectedCategory || !selectedSubcategory || !name || !description || !weight || !stock) {
//       setError("Please fill in all required fields.");
//       return;
//     }
//     setError("");

//     try {
//       const formData = new FormData();
//       formData.append("whichProduct", whichProduct);
//       formData.append("product_type", selectedCost);
//       formData.append("category", selectedCategory);
//       formData.append("subcategory", selectedSubcategory);
//       formData.append("name", name);
//       formData.append("description", description);
//       formData.append("specification", specification);
//       formData.append("size", size);
//       formData.append("weight", weight);
//       formData.append("stock", stock);
//       // Optionally, append the calculated price if needed on the backend
//       formData.append("price", price);

//       // Append image files if provided (only new files)
//       for (let i = 0; i < images.length; i++) {
//         if (images[i] instanceof File) {
//           formData.append("images", images[i]);
//         }
//       }

//       if (productRecord) {
//         await axios.put(`${productUpdateApi}/${productRecord._id}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else {
//         await axios.post(productCreateApi, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }
//       onSuccess();
//     } catch (err) {
//       console.error("Error saving product:", err);
//       setError(err.response?.data?.message || "Error saving product");
//     }
//   };

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           {productRecord ? "Update Product" : "Add Product"}
//         </Typography>
//         <TextField
//           label="Which Product"
//           fullWidth
//           value={whichProduct}
//           onChange={(e) => setWhichProduct(e.target.value)}
//           margin="normal"
//           required
//         />
//         <FormControl fullWidth sx={{ mb: 2 }}>
//           <InputLabel id="cost-select-label">Cost</InputLabel>
//           <Select
//             labelId="cost-select-label"
//             id="cost-select"
//             value={selectedCost}
//             label="Cost"
//             fullWidth
//             onChange={(e) => setSelectedCost(e.target.value)}
//           >
//             <MenuItem value="">
//               <em>Select Cost</em>
//             </MenuItem>
//             {costs.map((c) => (
//               <MenuItem key={c._id} value={c._id}>
//                 {c.productType && c.productType.name
//                   ? c.productType.name
//                   : `Cost: ${c.costPerGram}`}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <FormControl fullWidth sx={{ mb: 2 }} required>
//           <InputLabel id="category-select-label">Category</InputLabel>
//           <Select
//             labelId="category-select-label"
//             id="category-select"
//             value={selectedCategory}
//             label="Category"
//             onChange={(e) => setSelectedCategory(e.target.value)}
//           >
//             <MenuItem value="">
//               <em>Select Category</em>
//             </MenuItem>
//             {categories.map((cat) => (
//               <MenuItem key={cat._id} value={cat._id}>
//                 {cat.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <FormControl fullWidth sx={{ mb: 2 }} required>
//           <InputLabel id="subcategory-select-label">Subcategory</InputLabel>
//           <Select
//             labelId="subcategory-select-label"
//             id="subcategory-select"
//             value={selectedSubcategory}
//             label="Subcategory"
//             onChange={(e) => setSelectedSubcategory(e.target.value)}
//           >
//             <MenuItem value="">
//               <em>Select Subcategory</em>
//             </MenuItem>
//             {subcategories.map((sub) => (
//               <MenuItem key={sub._id} value={sub._id}>
//                 {sub.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <TextField
//           label="Name"
//           fullWidth
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           margin="normal"
//           required
//         />
//         <TextField
//           label="Description"
//           fullWidth
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           margin="normal"
//           required
//         />
//         <TextField
//           label="Specification"
//           fullWidth
//           value={specification}
//           onChange={(e) => setSpecification(e.target.value)}
//           margin="normal"
//         />
//         <TextField
//           label="Size"
//           fullWidth
//           value={size}
//           onChange={(e) => setSize(e.target.value)}
//           margin="normal"
//         />
//         <TextField
//           label="Weight"
//           fullWidth
//           value={weight}
//           onChange={(e) => setWeight(e.target.value)}
//           margin="normal"
//           required
//           type="number"
//         />
//         {/* Dynamic price display */}
//         {weight && selectedCost && price !== "" && (
//           <Typography variant="subtitle1" sx={{ mt: 1 }}>
//             Calculated Price: {price}
//           </Typography>
//         )}
//         <TextField
//           label="Stock"
//           fullWidth
//           value={stock}
//           onChange={(e) => setStock(e.target.value)}
//           margin="normal"
//           required
//           type="number"
//         />
//         <Box sx={{ my: 2 }}>
//           <Button variant="contained" component="label">
//             Upload Images
//             <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
//           </Button>
//           {images && images.length > 0 && (
//             <Box mt={1}>
//               {Array.from(images).map((img, index) => (
//                 <Typography key={index} variant="caption">
//                   {img.name || img}
//                 </Typography>
//               ))}
//             </Box>
//           )}
//         </Box>
//         {error && (
//           <Typography variant="caption" color="error" sx={{ mb: 2, display: "block" }}>
//             {error}
//           </Typography>
//         )}
//         <Box>
//           <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmit}>
//             Save
//           </Button>
//           <Button variant="outlined" onClick={onCancel}>
//             Cancel
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }

// ProductForm.propTypes = {
//   productRecord: PropTypes.shape({
//     _id: PropTypes.string,
//     whichProduct: PropTypes.string,
//     product_type: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     category: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     subcategory: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
//     name: PropTypes.string,
//     description: PropTypes.string,
//     specification: PropTypes.string,
//     size: PropTypes.string,
//     weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     images: PropTypes.oneOfType([PropTypes.array]),
//   }),
//   onSuccess: PropTypes.func.isRequired,
//   onCancel: PropTypes.func.isRequired,
// };

// export default ProductForm;
