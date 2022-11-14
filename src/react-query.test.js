import { useState, useEffect } from "react";
import { render, screen } from "@testing-library/react";
import {
  useQuery,
  QueryCache,
  ReactQueryCacheProvider,
  useMutation,
} from "react-query";

const queryCache = new QueryCache();

const QueryCmp = ({ queryFn }) => {
  useQuery(["foo"], queryFn);
  return null;
};

const MutationCmp = ({ mutationFn }) => {
  const [isDone, setIsDone] = useState(false);

  const [mutate] = useMutation(mutationFn, {
    useErrorBoundary: false,
    onSuccess: (...args) => console.log(":: onSuccess", args),
    onError: (...args) => console.log(":: onError", args),
  });

  useEffect(() => {
    mutate()
      .then((rsp) => console.log(":: rsp", rsp))
      .catch((e) => console.error(":: e", e))
      .finally(() => setIsDone(true));
  }, []);

  return isDone ? <div>done</div> : null;
};

test("should have no act() error", () => {
  render(
    <ReactQueryCacheProvider queryCache={queryCache}>
      <QueryCmp queryFn={() => Promise.resolve("foo")} />
    </ReactQueryCacheProvider>
  );
});

test("rejected promise testing - query", () => {
  render(
    <ReactQueryCacheProvider queryCache={queryCache}>
      <QueryCmp queryFn={() => Promise.reject("foo")} />
    </ReactQueryCacheProvider>
  );
});

test("rejected promise testing - mutations", async () => {
  render(
    <ReactQueryCacheProvider queryCache={queryCache}>
      <MutationCmp mutationFn={() => Promise.reject("foo")} />
    </ReactQueryCacheProvider>
  );

  await screen.findByText("done");
});
