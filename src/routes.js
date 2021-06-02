import Dashboard from "views/Dashboard/Dashboard";
import OrdersStock from "views/OrdersStock/OrdersStock";
import Stock from "views/Stock/Stock";
import OrdersManager from "views/OrdersManager/OrdersManager";
import Customers from "views/Customers/Customers";

import ImportData from "views/ImportData/ImportData";

// import LoginPage from "views/Pages/LoginPage.js";
// import PricingPage from "views/Pages/PricingPage.js";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
// import PaymentIcon from "@material-ui/icons/Payment";
import PeopleIcon from "@material-ui/icons/People";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
// import SettingsIcon from "@material-ui/icons/Settings";
import StoreIcon from "@material-ui/icons/Store";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Инфо",
    icon: DashboardIcon,
    component: Dashboard,
    layout: "/admin",
    roles: ["admin"],
  },
  {
    path: "/ordersstock",
    name: "Склад заказы",
    icon: ShoppingCartIcon,
    component: OrdersStock,
    layout: "/admin",
    roles: ["admin", "stock"],
  },
  {
    path: "/stock",
    name: "Склад",
    icon: StoreIcon,
    component: Stock,
    layout: "/admin",
    roles: ["admin", "stock"],
  },
  {
    path: "/ordersmanager",
    name: "Заказы менеджер",
    icon: AddShoppingCartIcon,
    component: OrdersManager,
    layout: "/admin",
    roles: ["admin", "stock"],
  },
  {
    path: "/customers",
    name: "Клиенты",
    icon: PeopleIcon,
    component: Customers,
    layout: "/admin",
    roles: ["admin", "stock"],
  },
  {
    path: "/import",
    name: "Импорт данных",
    icon: FormatListNumberedIcon,
    component: ImportData,
    layout: "/admin",
    roles: ["admin", "stock"],
  },

  // collapse: true,
  // name: "Настройки",
  // icon: SettingsIcon,
  // state: "pageCollapse",
  // views: [
  //   {
  //     path: "/set-sample",
  //     name: "Проба",
  //     mini: "ПР",
  //     component: SetSample,
  //     layout: "/admin",
  //   },
];
export default dashRoutes;
