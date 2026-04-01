/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "../../api/baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadSingleFile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/uploads/single",
        method: "POST",
        body: formData,
      }),
    }),
    uploadMultipleFiles: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/uploads/multiple",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadSingleFileMutation, useUploadMultipleFilesMutation } =
  uploadApi;
