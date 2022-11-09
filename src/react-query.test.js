import { render } from "@testing-library/react";
import {
  useQuery,
  QueryCache,
  ReactQueryCacheProvider,
} from "react-query";

const queryCache = new QueryCache();

const TestCmp = () => {
  const result = useQuery(["foo"], () => Promise.resolve("foo"));
  console.info(`::`, result);
  return null;
};

test("should have no act() error", () => {
  render(
    <ReactQueryCacheProvider queryCache={queryCache}>
      <TestCmp />
    </ReactQueryCacheProvider>
  );
});
