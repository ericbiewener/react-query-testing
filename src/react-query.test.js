import { render } from '@testing-library/react';
import { useQuery, QueryClientProvider, QueryClient } from "react-query"

const queryCache = new QueryClient();

const TestCmp = () => {
  const result = useQuery(["foo"], () => Promise.resolve("foo"));
  console.info(`::`, result);
  return null;
};

test('should have no act() error', () => {
  render(
    <QueryClientProvider client={queryCache}>
      <TestCmp />
    </QueryClientProvider>
  );
});
