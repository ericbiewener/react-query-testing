import React, { FC, useEffect, useState, ReactNode, useRef } from "react";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
  QueryKey,
  QueryFunction,
  UseQueryOptions,
} from "@tanstack/react-query";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <QueryClientProvider
    client={
      new QueryClient({ defaultOptions: { queries: { staleTime: 100 } } })
    }
  >
    {children}
  </QueryClientProvider>
);

const createQueryFn = (page: number) => () =>
  console.log("fetching") || Promise.resolve(page);

type Props = { initialData?: any };

const Cmp: FC<Props> = ({ initialData }) => {
  const [page, setPage] = useState(1);

  const hasFetched = useRef(false);

  const { data, status, isSuccess, ...rest } = useQuery(
    ["constant", page],
    createQueryFn(page),
    {
      keepPreviousData: true,
      initialData,
    }
  );

  useEffect(() => {
    if (isSuccess) {
      hasFetched.current = true;
    }
  });

  console.info(`::`, status, data, rest);

  return (
    <>
      <button onClick={() => setPage((s) => s + 1)}>Increment Page</button>
      <div>data: {data}</div>
    </>
  );
};

export default () => (
  <Wrapper>
    <Cmp initialData={1} />
  </Wrapper>
);
