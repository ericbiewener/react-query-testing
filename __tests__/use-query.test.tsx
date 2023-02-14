import React, { FC, useEffect, useState, ReactNode, useRef } from "react";
import {
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { staleTime: 100 } } })}>
    {children}
  </QueryClientProvider>
);

const queryFn = () => {
  return Promise.resolve("data");
}

type Props = { initialData?: any };

const Cmp: FC<Props> = ({ initialData }) => {


  const { data, status, isSuccess, ...rest } = useQuery(
    ["constant"],
    queryFn,
  );

  console.log(rest)

  return null
};

it("fetches first page", async () => {
  const r = render(<Cmp initialData={1} />, { wrapper: Wrapper });
  await require("@testing-library/react").act(() => new Promise(r => setTimeout(r, 1000)));
});
