import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import areaRoutes from './Areas/admin/routes/AreaRoutes.js';
import categoryRoutes from './Categories/routes/admin/categoryRoutes.js';
import SubCategoryRoutes  from './Categories/routes/admin/SubCategoryRoutes.js';
import BussinessTypeRoutes from './BussinessType/routes/BussinessTypeRoutes.js'; 
import CostBaseRoutes from './CostToBase/routes/CostBaseRoutes.js';
import ModuleRoutes from './Admin/Module/routes/ModuleRoutes.js';
import UserRoleRoutes from './Admin/Roles/routes/RoleRoutes.js';
import UserRoutes from './Admin/user/routes/UserRoutes.js';
import AddressRoutes from './Address/Routes/AddressRoutes.js';
import CustomerRoutes from './Customer/Routes/CustomerRoutes.js';
import AuthRoutes from './Admin/user/routes/AuthRoutes.js'; 
import TicketRoutes from './Tickets/Routes/admin/TicketRoutes.js';
import PermissionRoutes from './Permissions/Routes/PermissionRoutes.js';
import RoleRoutes from './Admin/Roles/routes/RoleRoutes.js';
import BannersRoutes from './Banners/Routes/admin/BannersRoutes.js';
import PromoCodesRoutes from './Offers/Routes/admin/PromoCodesRoutes.js';
import GeneralRoutes from "./Settings/General/Routes/admin/GeneralRoutes.js";
import CompanyDetailsRoutes from "./Settings/CompanyDetails/Routes/admin/CompanyDetailsRoutes.js";
import MetaContentRoutes from './Settings/MetaContent/Routes/admin/MetaContentRoutes.js';
import AboutRoutes from './Settings/AboutUs/Routes/admin/AboutRoutes.js';
import ContactUsRoutes from './Settings/ContactUs/Routes/admin/ContactUsRoutes.js';
import PolicyRoutes from './Settings/Policy/Routes/admin/PolicyRoutes.js';
import ProductRoutes from "./Products/admin/Routes/ProductRoutes.js";
import ProductTypeRoutes from "./Products/admin/Routes/ProductTypeRoutes.js";
import CostRoutes from "./Products/admin/Routes/CostRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

// Sample route
app.get('/', (req, res) => {
    res.send('API is running...');
    // console.log("*req*",req);
});

// All Routes
app.use('/api', areaRoutes);
app.use('/api', categoryRoutes);
app.use('/api', SubCategoryRoutes);
app.use('/api', CustomerRoutes);
app.use('/api', TicketRoutes);
app.use('/api', UserRoutes);
app.use('/api', PermissionRoutes);
app.use('/api', RoleRoutes);
app.use('/api', BannersRoutes);
app.use('/api', PromoCodesRoutes);
app.use('/api', GeneralRoutes);
app.use("/api", CompanyDetailsRoutes);
app.use("/api", MetaContentRoutes);
app.use('/api', AboutRoutes);
app.use("/api", ContactUsRoutes);
app.use("/api", PolicyRoutes);
app.use("/api", ProductTypeRoutes);
app.use("/api", ProductRoutes);
app.use("/api", CostRoutes);

app.use('/api/bussinesstype', BussinessTypeRoutes); 
app.use('/api/costbase', CostBaseRoutes); 
app.use('/api/module', ModuleRoutes);

app.use('/api/userrole', UserRoleRoutes);
app.use('/api/address', AddressRoutes);
app.use('/api/auth', AuthRoutes);






// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
.catch((error) => console.error('DB Connection Error:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
