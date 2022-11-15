import React, { useState, useEffect, FC } from "react";
import { render, screen, act } from "@testing-library/react";
import {
  useQuery,
  makeQueryCache,
  ReactQueryCacheProvider,
  useMutation,
} from "react-query";

const consoleError = console.error
console.error = (...args: any[]) => {
  if (args[0].includes('was not wrapped in act')) return
  consoleError.apply(console, args)
}

afterEach(async () => {
  await act(() => Promise.resolve())
})


const queryCache = makeQueryCache();

const QueryCmp = ({ queryFn }) => {
  useQuery(["foo"], queryFn);
  return null;
};

const MutationCmp: FC<{ mutationFn: () => Promise<{ foo: 1 }> }> = ({
  mutationFn,
}) => {
  const [isDone, setIsDone] = useState(false);

  const [mutate] = useMutation(mutationFn, {
    // throwOnError: true,
    onSuccess: (...args) => console.log(":: onSuccess", args),
    onError: (...args) => console.log(":: onError", args),
  });

  useEffect(() => {
    const go = async () => {
      try {
        const rsp = await mutate();
        console.log(":: RESPONSE", rsp);
      } catch (e) {
        console.error(":: e", e);
      } finally {
        setIsDone(true);
      }
    };

    go();
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
