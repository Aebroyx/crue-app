"use client";

import { createContext, useContext } from "react";

const AccountUrlContext = createContext("");

export function AccountUrlProvider({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return <AccountUrlContext.Provider value={url}>{children}</AccountUrlContext.Provider>;
}

export function useAccountUrl() {
  return useContext(AccountUrlContext);
}
