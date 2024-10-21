import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery: fetchBaseQuery({
      baseUrl: " http://localhost:3001",
      // baseUrl: "https://api.agteach.site",
      credentials: "include",
    }),
    tagTypes: ["Course"],
  
    endpoints: (builder) => ({
  
      getAllCourses: builder.query({
        providesTags: ["Course"],
        query: ({ name = "", order }) => {
          let url = `/api/course/getInstructorCourse?name=${name}`;
          
          // Include order only if it's defined
          if (order) {
            const dataOrder = order === "Newest" ? "desc" : "asc";
            url += `&order=${dataOrder}`;
          }
      
          return {
            url,
            method: "GET",
          };
        },
      }),
  
      confirmDelete: builder.mutation({
        query: (id) => ({
          url: `/api/course/deleteOneCourse/${id}`,
          method: "DELETE",
        }),
      }),

      getEnrollmentCourse: builder.query({
        providesTags: ["Course"],
        query: ({ name = "", order = "Newest" }) => {
          let url = `/api/enrollment/getEnrollment?name=${name}`;
          if (order !== "Newest") {
            url += `&order=${order}`;
          } 
        
          console.log("API Request URL:", url); // Log the final URL
          return { url, method: "GET" };
        },
      }),

      getEnrollmentDetails: builder.query({
        providesTags: ["Course"],
        query: ({ courseId }) => ({
          url: `/api/enrollment/getEnrollmentDetail/${courseId}`,
          // url: `/api/course/getOneCourse/744`,
          method: "GET",
        }),
      }), 
  

    }),
  });
  
  export const {
    useGetAllCoursesQuery,
    useConfirmDeleteMutation,
    useGetEnrollmentCourseQuery,
    useGetEnrollmentDetailsQuery,
    // useSearchCoursesQuery,
  } = courseApi;
  