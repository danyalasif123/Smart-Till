import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiTruck,
  FiRotateCcw,
} from "react-icons/fi";

export const navItems = [

  {
    label: "Dashboard",
    icon: FiHome,
    to: "/admin",
  },

  {
    label: "POS",
    icon: FiShoppingCart,
    to: "/admin/pos",
  },

  {
    label: "Sales",
    icon: FiBarChart2,

    children: [

      {
        label: "Sales",
        to: "/admin/sales",
      },

      {
        label: "Sale Returns",
        to: "/admin/sale-returns",
      },

    ],
  },

  {
    label: "Purchases",
    icon: FiTruck,

    children: [

      {
        label: "Purchases",
        to: "/admin/purchases",
      },

      {
        label: "Purchase Returns",
        to: "/admin/purchase-returns",
      },

    ],
  },

  {
    label: "Inventory",
    icon: FiPackage,

    children: [

      {
        label: "Products",
        to: "/admin/products",
      },

      {
        label: "Categories",
        to: "/admin/categories",
      },

      {
        label: "Inventory",
        to: "/admin/inventory",
      },

    ],
  },

  {
    label: "Contacts",
    icon: FiUsers,

    children: [

      {
        label: "Customers",
        to: "/admin/customers",
      },

      {
        label: "Suppliers",
        to: "/admin/suppliers",
      },

    ],
  },

  {
    label: "Administration",
    icon: FiSettings,

    children: [

      {
        label: "Users",
        to: "/admin/users",
      },

      {
        label: "Reports",
        to: "/admin/reports",
      },

      {
        label: "Settings",
        to: "/admin/settings",
      },

    ],
  },

];