/**
 * Application constants
 * Centralize config values used across the POS system
 */

export const APP_NAME = "Restaurant POS";

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  DASHBOARD_MENU: "/dashboard/menu",
  DASHBOARD_ORDERS: "/dashboard/orders",
  DASHBOARD_PAYMENTS: "/dashboard/payments",
  DASHBOARD_CUSTOMERS: "/dashboard/customers",
  DASHBOARD_USERS: "/dashboard/users",
  DASHBOARD_INVENTORY: "/dashboard/inventory",
  DASHBOARD_BRANCHES: "/dashboard/branches",
  DASHBOARD_CALCULATOR: "/dashboard/calculator",
  ORDERS: "/orders",
  MENU: "/menu",
  TABLES: "/tables",
  REPORTS: "/reports",
  SETTINGS: "/settings",
} as const;
