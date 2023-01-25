/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from "react";
import { render, waitFor } from "@testing-library/react";
import {
  useMutation,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";

beforeEach(() => {
  jest.clearAllMocks();
});

const queryCache = new QueryClient();

const Wrapper = ({ children }) => (
  <QueryClientProvider client={queryCache}>{children}</QueryClientProvider>
);

it("calls callbacks even with mutateAsync", async () => {
  const onMutateResult = { foo: 1 };
  const variables = { vars: 1 }
  const error = new Error("fake")

  const mutationFn = () => Promise.reject(error);
  const onMutate = jest.fn(() => onMutateResult);
  const onError = jest.fn();
  const onSettled = jest.fn();
  const onErrorNested = jest.fn();
  const onSettledNested = jest.fn();

  const MutationCmp = () => {
    const result = useMutation(mutationFn, {
      onMutate,
      onError,
      onSettled,
    });

    useEffect(() => {
      result
        .mutateAsync(variables, {
          onError: onErrorNested,
          onSettled: onSettledNested,
        })
        .catch(() => {});
    }, []);

    return null;
  };

  render(<MutationCmp />, { wrapper: Wrapper });

  await waitFor(() => {
    expect(onError).toHaveBeenCalledWith(error, variables, onMutateResult);
    expect(onSettled).toHaveBeenCalledWith(undefined, error, variables, onMutateResult);
    expect(onErrorNested).toHaveBeenCalledWith(error, variables, onMutateResult);
    expect(onSettledNested).toHaveBeenCalled(undefined, error, variables, onMutateResult);
  });

  console.info(`::`, onError.mock.calls);
});
