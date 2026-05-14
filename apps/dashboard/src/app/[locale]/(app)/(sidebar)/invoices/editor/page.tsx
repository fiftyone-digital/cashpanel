import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { InvoiceFullPageEditor } from "@/components/invoice-full-page-editor";
import { prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Invoice Editor | CashPanel",
};

export default function Page() {
  prefetch(trpc.invoice.defaultSettings.queryOptions());

  return (
    <ErrorBoundary errorComponent={ErrorFallback}>
      <Suspense fallback={<div className="text-sm">Loading invoice...</div>}>
        <InvoiceFullPageEditor />
      </Suspense>
    </ErrorBoundary>
  );
}
