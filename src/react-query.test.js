import { useEffect, useState } from "react";
import { fireEvent, render, screen, waitFor, act } from "@testing-library/react";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
  useMutation,
  MutationObserver
} from "@tanstack/react-query";

beforeEach(() => {
  jest.clearAllMocks();
});

const queryCache = new QueryClient();

const Wrapper = ({ children }) => (
  <QueryClientProvider client={queryCache}>{children}</QueryClientProvider>
);

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
    <Wrapper>
      <QueryCmp queryFn={() => Promise.resolve("foo")} />
    </Wrapper>
  );
});

test("rejected promise testing - query", () => {
  render(
    <Wrapper>
      <QueryCmp queryFn={() => Promise.reject("foo")} />
    </Wrapper>
  );
});

test("rejected promise testing - mutations", async () => {
  render(
    <Wrapper>
      <MutationCmp mutationFn={() => Promise.reject("foo")} />
    </Wrapper>
  );

  await screen.findByText("done");
});

test("mutation response", async () => {
  render(
    <Wrapper>
      <MutationCmp mutationFn={() => Promise.resolve("foo")} />
    </Wrapper>
  );

  await screen.findByText("done");
});

test("mutation callbacks", async () => {
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
    <Wrapper>
      <Cmp mutationFn={() => Promise.resolve("foo")} />
    </Wrapper>
  );

  await mutationResult.mutateAsync();
  await mutationResult.mutateAsync();
  await mutationResult.mutateAsync();
});

describe.only("mutation isLoading state", () => {
  let promises = [];
  const mutationFn = () => {
    const promise = new Promise((r) => {
      setTimeout(r, 250);
    });
    promises.push(promise);
    return promise;
  };

  beforeEach(() => {
    promises = [];
  });

  const waitForMutations = () => Promise.all(promises);

  test("mutation isLoading state", async () => {
    const Cmp = () => {
      const { mutateAsync, isLoading } = useMutation(mutationFn);
      const [state, setState] = useState(0);

      console.info(`:: render | state`, state);
      console.log(":: render | isLoading", isLoading);
      useEffect(() => {
        console.log(":: useEffect");
      });

      return (
        <>
          <button onClick={mutateAsync}>Mutate</button>
          <button onClick={() => setState((s) => s)}>
            Update State - no change
          </button>
          <button onClick={() => setState((s) => s + 1)}>
            Update State - change
          </button>
        </>
      );
    };

    render(
      <Wrapper>
        <Cmp mutationFn={() => Promise.resolve("foo")} />
      </Wrapper>
    );

    fireEvent.click(screen.getByText("Mutate"));
    await waitFor(() => promises.length);
    await act(waitForMutations)
  });
});
