import { useEffect, useState } from "react";
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
  const [isDone, setIsDone] = useState(false);

  const result = useMutation(mutationFn, {
    useErrorBoundary: false,
    onSuccess: (...args) => console.log(":: onSuccess", args),
    onError: (...args) => console.log(":: onError", args),
  });

  useEffect(() => {
    console.info(`:: sync result`, result.mutate());

    result
      .mutateAsync()
      .then((rsp) => console.log(":: rsp", rsp))
      .catch((e) => console.error(":: e", e))
      .finally(() => setIsDone(true));
  }, []);

  return isDone ? <div>done</div> : null;
};

test("should have no act() error", () => {
  render(
    <QueryClientProvider client={queryCache}>
      <QueryCmp queryFn={() => Promise.resolve("foo")} />
    </QueryClientProvider>
  );
});

test("rejected promise testing - query", () => {
  render(
    <QueryClientProvider client={queryCache}>
      <QueryCmp queryFn={() => Promise.reject("foo")} />
    </QueryClientProvider>
  );
});

test("rejected promise testing - mutations", async () => {
  render(
    <QueryClientProvider client={queryCache}>
      <MutationCmp mutationFn={() => Promise.reject("foo")} />
    </QueryClientProvider>
  );

  await screen.findByText("done");
});

test("mutation response", async () => {
  render(
    <QueryClientProvider client={queryCache}>
      <MutationCmp mutationFn={() => Promise.resolve("foo")} />
    </QueryClientProvider>
  );

  await screen.findByText("done");
});

test.only("mutation callbacks", async () => {
  const onMutate = jest
    .fn()
    .mockResolvedValueOnce(1)
    .mockResolvedValueOnce(2)
    .mockResolvedValueOnce(3);

  let mutationResult;

  const Cmp = () => {
    mutationResult = useMutation(() => Promise.resolve(1), {
      onMutate,
      onSuccess: (...args) => console.log(":: onSuccess", args),
      onError: (...args) => console.log(":: onError", args),
    });

    return null;
  };

  render(
    <QueryClientProvider client={queryCache}>
      <Cmp mutationFn={() => Promise.resolve("foo")} />
    </QueryClientProvider>
  );

  await mutationResult.mutateAsync();
  await mutationResult.mutateAsync();
  await mutationResult.mutateAsync();
});
