import { render } from "@testing-library/react";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

beforeEach(() => {
  jest.clearAllMocks();
});

const queryCache = new QueryClient();

const Wrapper = ({ children }) => (
  <QueryClientProvider client={queryCache}>{children}</QueryClientProvider>
);

let result;
let request;

const QueryCmp = ({ options }) => {
  result = useQuery({ queryKey: ["foo"], ...options });
  return null;
};

it("refetch & idle state", async () => {
  render(
    <Wrapper>
      <QueryCmp
        options={{
          queryFn: () => {
            request = Promise.resolve("foo");
            return request;
          },
          enabled: false,
        }}
      />
    </Wrapper>
  );

  console.log(result.fetchStatus, result.status);
  result.refetch();
  console.log(result.fetchStatus, result.status);
});
