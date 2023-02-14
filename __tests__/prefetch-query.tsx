import React, { FC, useEffect, useState, ReactNode, useRef, ReactElement } from "react";
import {
  useQueryCache,
  makeQueryCache,
  ReactQueryCacheProvider,
} from "react-query";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

beforeEach(() => jest.clearAllMocks())

const Wrapper: FC<{ children: ReactElement }> = ({ children }) => (
  // @ts-ignore
  <ReactQueryCacheProvider queryCache={makeQueryCache()}>
    {children}
  </ReactQueryCacheProvider>
);

const queryFn = jest.fn().mockResolvedValue("data")

const Cmp: FC<{ prefetchEnabled: boolean }> = ({ prefetchEnabled }) => {
  const queryCache = useQueryCache()

  useEffect(() => {
    queryCache.prefetchQuery("foo", queryFn, { enabled: prefetchEnabled})
  }, [])

  return null
};

it("prefetches even when disabled", async () => {
  render(<Cmp prefetchEnabled={false} />, { wrapper: Wrapper });
  await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(1))
});
