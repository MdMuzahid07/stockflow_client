import baseApi from "../../api/baseApi";

export const restockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRestockQueue: builder.query({
      query: () => "/restock",
      providesTags: ["Restock"],
    }),
    restockProduct: builder.mutation({
      query: ({ id, addedStock }) => ({
        url: `/restock/execute/${id}`,
        method: "POST",
        body: { addedStock },
      }),
      invalidatesTags: ["Restock", "Product", "Activity", "Dashboard"],
    }),
    removeFromQueue: builder.mutation({
      query: (productId) => ({
        url: `/restock/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Restock"],
    }),
  }),
});

export const {
  useGetRestockQueueQuery,
  useRestockProductMutation,
  useRemoveFromQueueMutation,
} = restockApi;
