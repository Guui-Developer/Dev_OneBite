const API_URL = import.meta.env.VITE_API_URL;
const API_STAGE = import.meta.env.VITE_API_STAGE;

export const API_BASE_URL = `${API_URL}/${API_STAGE}`;
export const SHOULD_LOG = (typeof import.meta !== "undefined" && import.meta.env.MODE !== "production")
export const IS_DEV = import.meta.env.MODE === "development";
export const API_TIMEOUT_MS = 15000;
