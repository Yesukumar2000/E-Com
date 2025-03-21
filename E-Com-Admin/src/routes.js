/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Category from "layouts/category";
import Subcategory from "layouts/subcategory";
import Customer from "layouts/customers";
import Area from "layouts/areas";
import Ticket from "layouts/Tickets";
import Permissions from "layouts/Permissions";
import Users from "layouts/users";
import Roles from "layouts/roles";
import PromoCodes from "layouts/offers";
import Banners from "layouts/banners";
import General from "layouts/settings/General";
import CompanyDetails from "layouts/settings/CompanyDetails";
import MetaContent from "layouts/settings/MetaContent";
import AboutUs from "layouts/settings/AboutUs";
import ContactUs from "layouts/settings/ContactUs";
import Policy from "layouts/settings/Policy";
import ProductType from "layouts/Products/ProductType";
import Cost from "layouts/Products/Cost";
import Product from "layouts/Products/Product";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Category Manage",
    key: "category-manage",
    icon: <Icon fontSize="small">assignment</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "Categories",
        key: "categories",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/category",
        component: <Category />,
      },
      {
        type: "collapse",
        name: "Subcategories",
        key: "subcategories",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/subcategory",
        component: <Subcategory />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Area Manage",
    key: "area",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/area",
    component: <Area />,
  },
  {
    type: "collapse",
    name: "Customer Manage",
    key: "customer-manage",
    icon: <Icon fontSize="small">person</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "Customers",
        key: "customers",
        icon: <Icon fontSize="small">person</Icon>,
        route: "/customer",
        component: <Customer />,
      },
      {
        type: "collapse",
        name: "Ticket Manage",
        key: "ticket-manage",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/tickets",
        component: <Ticket />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Product Manage",
    key: "product-manage",
    icon: <Icon fontSize="small">assignment</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "Product Type",
        key: "product type",
        icon: <Icon fontSize="small">table_view</Icon>,
        route: "/product-type",
        component: <ProductType />,
      },
      {
        type: "collapse",
        name: "Cost",
        key: "cost",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/cost",
        component: <Cost />,
      },
      {
        type: "collapse",
        name: "Product",
        key: "product",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/product",
        component: <Product />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Dashboard Users",
    key: "dashboard-users",
    icon: <Icon fontSize="small">table_view</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "Permissions",
        key: "permissions",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/permissions",
        component: <Permissions />,
      },
      {
        type: "collapse",
        name: "Roles",
        key: "roles",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/roles",
        component: <Roles />,
      },
      {
        type: "collapse",
        name: "Users",
        key: "users",
        icon: <Icon fontSize="small">person</Icon>,
        route: "/users",
        component: <Users />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Banner Manage",
    key: "banner-manage",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/banners",
    component: <Banners />,
  },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
  {
    type: "collapse",
    name: "Offer Manage",
    key: "offer-manage",
    icon: <Icon fontSize="small">assignment</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "Promo Codes",
        key: "promo codes",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/promocode",
        component: <PromoCodes />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Settings",
    key: "settings",
    icon: <Icon fontSize="small">table_view</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "General Infomation",
        key: "general infomation",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/general",
        component: <General />,
      },
      {
        type: "collapse",
        name: "Companty Details",
        key: "company details",
        icon: <Icon fontSize="small">table_view</Icon>,
        route: "/company-details",
        component: <CompanyDetails />,
      },
      {
        type: "collapse",
        name: "Meta Content",
        key: "meta content",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/meta-content",
        component: <MetaContent />,
      },
      {
        type: "collapse",
        name: "Abouts Us",
        key: "about us",
        icon: <Icon fontSize="small">assignment</Icon>,
        route: "/about-us",
        component: <AboutUs />,
      },
      {
        type: "collapse",
        name: "Contact Us",
        key: "contact us",
        icon: <Icon fontSize="small">table_view</Icon>,
        route: "/contact-us",
        component: <ContactUs />,
      },
      {
        type: "collapse",
        name: "Policy Manage",
        key: "policy manage",
        icon: <Icon fontSize="small">table_view</Icon>,
        route: "/policy-manage",
        component: <Policy />,
      },
    ],
  },
];

export default routes;
