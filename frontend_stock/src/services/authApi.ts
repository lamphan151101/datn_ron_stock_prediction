import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "//localhost:5000",
    }),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (body: { email: String; password: String }) => {
                return {
                    url: "/login",
                    method: "post",
                    body
                };
            },
        }),
    }),
});

export const { useLoginUserMutation } = authApi
