"use client";

import { Button } from "@cashpanel/ui/button";
import { Icons } from "@cashpanel/ui/icons";
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { Form } from "@/components/invoice/form";
import { FormContext } from "@/components/invoice/form-context";
import { InvoiceSuccess } from "@/components/invoice-success";
import { useInvoiceParams } from "@/hooks/use-invoice-params";
import { useInvoiceEditorStore } from "@/store/invoice-editor";
import { useTRPC } from "@/trpc/client";

export function InvoiceFullPageEditor() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { invoiceId, invoiceType } = useInvoiceParams();

  const { data: defaultSettings } = useSuspenseQuery(
    trpc.invoice.defaultSettings.queryOptions(),
  );

  const { data } = useQuery(
    trpc.invoice.getById.queryOptions(
      {
        id: invoiceId!,
      },
      {
        enabled: !!invoiceId,
        staleTime: 30 * 1000,
      },
    ),
  );

  const resetEditor = () => {
    queryClient.invalidateQueries({
      queryKey: trpc.invoice.getById.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: trpc.invoice.defaultSettings.queryKey(),
    });
    useInvoiceEditorStore.getState().reset();
  };

  return (
    <div className="h-[calc(100vh-70px)] flex flex-col">
      <div className="h-14 border-b border-border flex items-center justify-between px-6">
        <div>
          <div className="text-sm font-medium">Invoice editor</div>
          <div className="text-xs text-muted-foreground">
            Full-page editing workspace
          </div>
        </div>
        <Button variant="outline" size="sm" asChild onClick={resetEditor}>
          <Link href="/invoices">
            <Icons.ArrowBack className="size-3 mr-2" />
            Back to invoices
          </Link>
        </Button>
      </div>

      <FormContext defaultSettings={defaultSettings} data={data}>
        <div className="flex-1 min-h-0 mx-auto w-full max-w-[920px] border-x border-border bg-background">
          {invoiceType === "success" ? <InvoiceSuccess /> : <Form />}
        </div>
      </FormContext>
    </div>
  );
}
