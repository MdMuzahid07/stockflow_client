import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const url = `${baseUrl}/api/v1`;

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Category", "Product", "Order", "Restock", "Activity", "Dashboard"],
  endpoints: () => ({}),
});

export default baseApi;
