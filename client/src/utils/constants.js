export const APP_NAME = "SplitLink";

export const API_ENDPOINTS = {
  GROUPS: "/api/groups",
  CREATE_GROUP: "/api/groups",
  JOIN_GROUP: (inviteCode) => `/api/groups/${inviteCode}/join`,
  LOGIN: (inviteCode) => `/api/groups/${inviteCode}/login`,
  DASHBOARD: (inviteCode) => `/api/groups/${inviteCode}`,
  EXPENSES: (inviteCode) => `/api/groups/${inviteCode}/expenses`,
  LEDGER: (inviteCode) => `/api/groups/${inviteCode}/ledger`,
  SETTLEMENTS: (inviteCode) => `/api/groups/${inviteCode}/settlements`,
  EXPENSE: (expenseId) => `/api/expenses/${expenseId}`,
};

export const STORAGE_KEYS = {
  AUTH_SESSION: "splitlink.auth.session",
};

export const DEFAULTS = {
  CURRENCY: "INR",
  LOCALE: "en-IN",
  DATE_FORMAT: "en-IN",
  RECENT_EXPENSES_LIMIT: 5,
};
