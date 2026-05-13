"use client";

import { Button } from "@cashpanel/ui/button";
import { Icons } from "@cashpanel/ui/icons";
import { useInvoiceParams } from "@/hooks/use-invoice-params";

export function OpenInvoiceSheet() {
  const { setParams } = useInvoiceParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ invoiceType: "create" })}
      >
        <Icons.Add />
      </Button>
    </div>
  );
}
