import baseApi from "../../api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
    getAnalytics: builder.query({
      query: () => "/dashboard/analytics",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetStatsQuery, useGetAnalyticsQuery } = dashboardApi;
