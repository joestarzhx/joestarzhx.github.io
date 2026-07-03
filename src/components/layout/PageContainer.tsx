import type { ReactNode } from "react";

export function PageContainer({ children }: { children: ReactNode }) {
  return <main className="page-shell min-w-0">{children}</main>;
}
