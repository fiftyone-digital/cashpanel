import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/error-fallback";
import { InvoiceTemplateManager } from "@/components/invoice-template-manager";
import { prefetch, trpc } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Invoice Templates | CashPanel",
};

export default function Page() {
  prefetch(trpc.invoiceTemplate.list.queryOptions());

  return (
    <div className="max-w-[1400px]">
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={<div className="text-sm">Loading templates...</div>}
        >
          <InvoiceTemplateManager />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
