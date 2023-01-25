// import { render, waitFor } from "@testing-library/react";
// import {
//   useQuery,
//   QueryClientProvider,
//   QueryClient,
// } from "@tanstack/react-query";

// beforeEach(() => {
//   jest.clearAllMocks();
// });

// const queryCache = new QueryClient();

// const Wrapper = ({ children }) => (
//   <QueryClientProvider client={queryCache}>{children}</QueryClientProvider>
// );

// let result;
// let request;

// const QueryCmp = ({ options }) => {
//   result = useQuery({ queryKey: ["foo"], ...options });
//   return null;
// };

// it("refetch & idle state", async () => {
//   render(
//     <Wrapper>
//       <QueryCmp
//         options={{
//           queryFn: async () => {
//             await new Promise(r => setTimeout(r, 4000));
//             return "foo";
//           },
//           enabled: false
//         }}
//       />
//     </Wrapper>
//   );

//   console.log(result.isLoading, result.isFetching);
//   result.refetch();
//   console.log(result.isLoading, result.isFetching);
//   await waitFor(() => {
//   console.log(result.isLoading, result.isFetching);
//   console.log(result.fetchStatus)
//     expect(result.fetchStatus).toBe("fetching")
//   })
// });
