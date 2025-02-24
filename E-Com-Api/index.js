import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import areaRoutes from './Areas/routes/AreaRoutes.js';
import categoryRoutes from './Categories/routes/categoryRoutes.js';
import SubCategoryRoutes  from './Categories/routes/SubCategoryRoutes.js';
import BussinessTypeRoutes from './BussinessType/routes/BussinessTypeRoutes.js'; 
import CostBaseRoutes from './CostToBase/routes/CostBaseRoutes.js';
import ModuleRoutes from './Admin/Module/routes/ModuleRoutes.js';
import UserRoleRoutes from './Admin/UserRole/routes/UserRoleRoutes.js';
import UserRoutes from './Admin/user/routes/UserRoutes.js';
import AddressRoutes from './Address/Routes/AddressRoutes.js';
import CustomerRoutes from './Customer/Routes/CustomerRoutes.js';
import AuthRoutes from './Admin/user/routes/AuthRoutes.js'; 

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Sample route
app.get('/', (req, res) => {
    res.send('API is running...');
    // console.log("*req*",req);
});

// All Routes
app.use('/api/areas', areaRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', SubCategoryRoutes);
app.use('/api/bussinesstype', BussinessTypeRoutes); 
app.use('/api/costbase', CostBaseRoutes); 
app.use('/api/module', ModuleRoutes);
app.use('/api/userrole', UserRoleRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/address', AddressRoutes);
app.use('/api/customer', CustomerRoutes);
app.use('/api/auth', AuthRoutes);






// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
.catch((error) => console.error('DB Connection Error:', error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
