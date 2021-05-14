import Dashboard from "views/Dashboard";
import Orders from "views/Orders";
import Stock from "views/Stock";
import OrdersOld from "views/OrdersOld";
import StockOld from "views/StockOld";
import OrdersAll from "views/OrdersAll";
import Payments from "views/Payments";
import Invoice from "views/Invoice";
import Customers from "views/Customers";

import Todo from "views/Todo";

// import LockScreenPage from "views/Pages/LockScreenPage.js";
// import LoginPage from "views/Pages/LoginPage.js";
// import PricingPage from "views/Pages/PricingPage.js";
// import RegisterPage from "views/Pages/RegisterPage.js";
// import UserProfile from "views/Pages/UserProfile.js";
// import ErrorPage from "views/Pages/ErrorPage.js";

// import SetSample from "views/SetSample";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PaymentIcon from "@material-ui/icons/Payment";
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
    path: "/orders",
    name: "Заказы склад",
    icon: ShoppingCartIcon,
    component: Orders,
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
    path: "/ordersall",
    name: "Заказы менеджер",
    icon: AddShoppingCartIcon,
    component: OrdersAll,
    layout: "/admin",
    roles: ["admin", "stock"],
  },
  {
    path: "/payments",
    name: "Платежи",
    icon: PaymentIcon,
    component: Payments,
    layout: "/admin",
    roles: ["admin"],
  },
  {
    path: "/invoice",
    name: "ТОРГ-12",
    icon: PaymentIcon,
    component: Invoice,
    layout: "/admin",
    roles: ["ceo", "manager"],
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
    path: "/todo",
    name: "Импорт данных",
    icon: FormatListNumberedIcon,
    component: Todo,
    layout: "/admin",
    roles: ["admin", "stock"],
  },
  {
    path: "/ordersold",
    name: "Заказы Мр",
    icon: ShoppingCartIcon,
    component: OrdersOld,
    layout: "/admin",
    roles: ["admin", "stock"],
  },

  {
    path: "/stockold",
    name: "Склад Мр",
    icon: StoreIcon,
    // state: "pageCollapse",
    component: StockOld,
    layout: "/admin",
    roles: ["admin", "stock"],
  },
  // {
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
  // {
  //   path: "/set-delivery",
  //   name: "Логистика",
  //   mini: "ЛГ",
  //   component: SetDelivery,
  //   layout: "/admin",
  // },
  // {
  //   path: "/set-persons",
  //   name: "Контакты",
  //   mini: "КН",
  //   component: SetPersons,
  //   layout: "/admin",
  // },
  // {
  //   path: "/set-firms",
  //   name: "Организации",
  //   mini: "ОРГ",
  //   component: SetFirms,
  //   layout: "/admin",
  // },
  // {
  //   path: "/set-shops",
  //   name: "Магазины",
  //   mini: "МГ",
  //   component: SetShops,
  //   layout: "/admin",
  // },
  // {
  //   path: "/set-customers",
  //   name: "Заказчики",
  //   mini: "ЗАК",
  //   component: SetCustomers,
  //   layout: "/admin",
  // },
  // {
  //   path: "/set-orders",
  //   name: "Заказы",
  //   mini: "НЗ",
  //   component: SetOrders,
  //   layout: "/admin",
  // },
  // {
  //   path: "/set-todos",
  //   name: "Сделать",
  //   mini: "СД",
  //   component: SetTodos,
  //   layout: "/admin",
  // },
  // ],
  // },
];
export default dashRoutes;
