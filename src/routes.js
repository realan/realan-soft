import Dashboard from "views/Dashboard/Dashboard";
import OrdersStock from "views/Stock/OrdersStock";
import Stock from "views/Stock/Stock";
import StockDashboard from "views/Stock/StockDashboard";
import StockHistory from "views/Stock/StockHistory";
import OrdersManager from "views/OrdersManager/OrdersManager";
import Customers from "views/Customers/Customers";

import ImportData from "views/ImportData/ImportData";

// import LoginPage from "views/Pages/LoginPage.js";
// import PricingPage from "views/Pages/PricingPage.js";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
// import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
// import PaymentIcon from "@material-ui/icons/Payment";
import PeopleIcon from "@material-ui/icons/People";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import EmojiTransportationIcon from "@material-ui/icons/EmojiTransportation";
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
    path: "/suppliers",
    name: "Поставщики",
    icon: EmojiTransportationIcon,
    component: OrdersStock,
    layout: "/admin",
    roles: ["admin", "stock"],
  },
  {
    name: "Склад",
    icon: StoreIcon,
    roles: ["admin", "stock"],
    collapse: true,
    state: "pageCollapse",
    views: [
      {
        path: "/stock-dashboard",
        name: "Инфо",
        mini: "ИНФ",
        component: StockDashboard,
        layout: "/admin",
      },
      {
        path: "/stock-pickup",
        name: "Приемка заказа",
        mini: "ПЗ",
        component: Stock,
        layout: "/admin",
      },
      {
        path: "/stock-history",
        name: "История приемки",
        mini: "ИСТ",
        component: StockHistory,
        layout: "/admin",
      },
      {
        path: "/stock-orders",
        name: "Заказы",
        mini: "ЗК",
        component: OrdersStock,
        layout: "/admin",
      },
      {
        path: "/stock-packing",
        name: "Упаковка",
        mini: "УП",
        component: OrdersStock,
        layout: "/admin",
      },
      {
        path: "/stock-old",
        name: "Старая версия",
        mini: "СТ",
        component: Stock,
        layout: "/admin",
      },
    ],
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
  // ]
];
export default dashRoutes;
