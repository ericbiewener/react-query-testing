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
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

const createQueryFn = (page: number) => () => Promise.resolve(page);

type Props = { initialData?: any };

const Cmp: FC<Props> = ({ initialData }) => {
  const [page, setPage] = useState(1);

  const { data, status, ...rest } = useQuery(["constant", page], createQueryFn(page), {
    keepPreviousData: true,
    staleTime: Infinity,
    initialData
  });

  console.info(`::`, status, data)
  console.info(`::`, rest)

  return (
    <>
      <button onClick={() => setPage((s) => s + 1)}>Increment Page</button>
      <div>data: {data}</div>
    </>
  );
};

it("fetches first page", async () => {
  const r = render(<Cmp initialData="init" />, { wrapper: Wrapper });
  console.info(`::`, 'test', 1)
  await new Promise(r => setTimeout(r, 4000));
  screen.debug()
  // await waitFor(() => screen.getByText("data: 1"));
  // console.info(`::`, 'test', 2)
  // fireEvent.click(screen.getByText("Increment Page"))
  // console.info(`::`, 'test', 3)
  // await waitFor(() => screen.getByText("data: 2"));
  // console.info(`::`, 'test', 4)
});
