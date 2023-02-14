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
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { staleTime: 100 } } })}>
    {children}
  </QueryClientProvider>
);

const createQueryFn = (page: number) => () => Promise.resolve(page);

type Props = { initialData?: any };

const Cmp: FC<Props> = ({ initialData }) => {
  const [page, setPage] = useState(1);
  const [counter, setCounter] = useState(1);

  const hasFetched = useRef(false);

  const { data, status, isSuccess, ...rest } = useQuery(
    ["constant", page],
    createQueryFn(page),
    {
      keepPreviousData: true,
      initialData: hasFetched.current ? undefined : initialData,
    }
  );

  useEffect(() => {
    // hasFetched.current = true;
  });

  return (
    <>
      <button onClick={() => setPage((s) => s + 1)}>Increment Page</button>
      <button onClick={() => setCounter((s) => s + 1)}>Force rerender</button>
      <div>data: {data}</div>
    </>
  );
};

it("fetches first page", async () => {
  const r = render(<Cmp initialData={1} />, { wrapper: Wrapper });
  console.info(`::`, "test", 1);
  await require("@testing-library/react").act(
    () => new Promise((r) => setTimeout(r, 1000))
  );
  // screen.debug()
  // await waitFor(() => screen.getByText("data: 1"));
  // console.info(`::`, 'test', 2)
  fireEvent.click(screen.getByText("Increment Page"))
  // await require("@testing-library/react").act(() => new Promise(r => setTimeout(r, 1000)));
  // console.info(`::`, 'test', 3)
  await waitFor(() => screen.getByText("data: 2"));
  // console.info(`::`, 'test', 4)
});
