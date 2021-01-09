import Dashboard from 'views/Dashboard';
import Orders from 'views/Orders';
import Payments from 'views/Payments';
import Customers from 'views/Customers';
import Stock from 'views/Stock';
import Todo from 'views/Todo';
// import OrderFromProduction from "views/OrderFromProduction";
// import OrderFromStock from "views/OrderFromStock";
// import StockCorrect from "views/StockCorrect";
// import Setting from "views/Setting";
import SetSample from 'views/SetSample';
import SetDelivery from 'views/SetDelivery';
import SetPersons from 'views/SetPersons';
import SetFirms from 'views/SetFirms';
import SetShops from 'views/SetShops';
import SetCustomers from 'views/SetCustomers';
import SetOrders from 'views/SetOrders';
import SetTodos from 'views/SetTodos';

// @material-ui/icons
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PaymentIcon from '@material-ui/icons/Payment';
import PeopleIcon from '@material-ui/icons/People';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import SettingsIcon from '@material-ui/icons/Settings';

var dashRoutes = [
  {
    path: '/dashboard',
    name: 'Инфо',
    icon: DashboardIcon,
    component: Dashboard,
    layout: '/admin',
  },
  {
    path: '/orders',
    name: 'Заказы',
    icon: ShoppingCartIcon,
    component: Orders,
    layout: '/admin',
  },
  {
    path: '/payments',
    name: 'Платежи',
    icon: PaymentIcon,
    component: Payments,
    layout: '/admin',
  },
  {
    path: '/customers',
    name: 'Клиенты',
    icon: PeopleIcon,
    component: Customers,
    layout: '/admin',
  },
  {
    path: '/todo',
    name: 'Сделать',
    icon: FormatListNumberedIcon,
    component: Todo,
    layout: '/admin',
  },
  {
    // collapse: true,
    path: '/stock',
    name: 'Склад',
    icon: SettingsIcon,
    // state: "pageCollapse",
    component: Stock,
    layout: '/admin',
    // views: [
    //   {
    //     path: "/stock",
    //     name: "Склад состояние",
    //     mini: "СК",
    //     component: Stock,
    //     layout: "/admin"
    //   },
    //   {
    //     path: "/order-production",
    //     name: "Приемка",
    //     mini: "ПР",
    //     component: OrderFromProduction,
    //     layout: "/admin"
    //   },
    //   {
    //     path: "/order-stock",
    //     name: "Набор со склада",
    //     mini: "НБ",
    //     component: OrderFromStock,
    //     layout: "/admin"
    //   },
    //   {
    //     path: "/stock-correct",
    //     name: "Корректировки",
    //     mini: "КР",
    //     component: StockCorrect,
    //     layout: "/admin"
    //   }
    // ]
  },
  {
    collapse: true,
    name: 'Настройки',
    icon: SettingsIcon,
    state: 'pageCollapse',
    views: [
      {
        path: '/set-sample',
        name: 'Проба',
        mini: 'ПР',
        component: SetSample,
        layout: '/admin',
      },
      {
        path: '/set-delivery',
        name: 'Логистика',
        mini: 'ЛГ',
        component: SetDelivery,
        layout: '/admin',
      },
      {
        path: '/set-persons',
        name: 'Контакты',
        mini: 'КН',
        component: SetPersons,
        layout: '/admin',
      },
      {
        path: '/set-firms',
        name: 'Организации',
        mini: 'ОРГ',
        component: SetFirms,
        layout: '/admin',
      },
      {
        path: '/set-shops',
        name: 'Магазины',
        mini: 'МГ',
        component: SetShops,
        layout: '/admin',
      },
      {
        path: '/set-customers',
        name: 'Заказчики',
        mini: 'ЗАК',
        component: SetCustomers,
        layout: '/admin',
      },
      {
        path: '/set-orders',
        name: 'Заказы',
        mini: 'НЗ',
        component: SetOrders,
        layout: '/admin',
      },
      {
        path: '/set-todos',
        name: 'Сделать',
        mini: 'СД',
        component: SetTodos,
        layout: '/admin',
      },
    ],
  },
];
export default dashRoutes;
