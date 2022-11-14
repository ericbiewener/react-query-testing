import { useEffect, useState } from 'react'
import { render, screen } from "@testing-library/react";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
  useMutation,
} from "@tanstack/react-query";

const queryCache = new QueryClient();

const QueryCmp = ({ queryFn }) => {
  const result = useQuery(["foo"], queryFn);
  return null;
};

const MutationCmp = ({ mutationFn }) => {
  const [isDone, setIsDone] = useState(false)

  const result = useMutation(mutationFn, {
    useErrorBoundary: false,
    onSuccess: (...args) => console.log(":: onSuccess", args),
    onError: (...args) => console.log(":: onError", args),
  });

  useEffect(() => {
    result.mutateAsync().finally(() => setIsDone(true))
  }, [])

  return isDone ? <div>done</div> : null;
};

test("should have no act() error", () => {
  render(
    <QueryClientProvider client={queryCache}>
      <QueryCmp queryFn={() => Promise.resolve("foo")} />
    </QueryClientProvider>
  );
});

test("rejected promise teseting - query", () => {
  render(
    <QueryClientProvider client={queryCache}>
      <QueryCmp queryFn={() => Promise.reject("foo")} />
    </QueryClientProvider>
  );
});

test("rejected promise teseting - mutations", async () => {
  render(
    <QueryClientProvider client={queryCache}>
      <MutationCmp mutationFn={() => Promise.reject("foo")} />
    </QueryClientProvider>
  );

  await screen.findByText('done')
});
