import baseApi from "../../api/baseApi";

export const activityLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentLogs: builder.query({
      query: () => "/activity-logs",
      providesTags: ["Activity"],
    }),
  }),
});

export const { useGetRecentLogsQuery } = activityLogApi;
