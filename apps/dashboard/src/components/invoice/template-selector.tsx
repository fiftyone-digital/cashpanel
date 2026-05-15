"use client";

import type { RouterOutputs } from "@api/trpc/routers/_app";
import { DEFAULT_TEMPLATE } from "@cashpanel/invoice";
import { localDateToUTCMidnight } from "@cashpanel/invoice/recurring";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@cashpanel/ui/alert-dialog";
import { cn } from "@cashpanel/ui/cn";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@cashpanel/ui/dropdown-menu";
import { Icons } from "@cashpanel/ui/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, parseISO } from "date-fns";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTRPC } from "@/trpc/client";
import { CreateTemplateDialog } from "./create-template-dialog";

type InvoiceTemplate = RouterOutputs["invoiceTemplate"]["list"][number];

const editableStatuses = new Set(["draft", "unpaid", "scheduled"]);

const withTemplateDefaults = (
  template: InvoiceTemplate,
  currentTemplate: Record<string, unknown> | null | undefined,
): Record<string, unknown> => {
  const currentValues =
    currentTemplate && typeof currentTemplate === "object"
      ? currentTemplate
      : {};
  const fallbackTemplate = {
    ...DEFAULT_TEMPLATE,
    logoUrl: currentValues.logoUrl ?? DEFAULT_TEMPLATE.logoUrl,
  } as Record<string, unknown>;
  const appliedTemplate = Object.fromEntries(
    Object.entries(template).map(([key, value]) => [
      key,
      value ?? fallbackTemplate[key] ?? currentValues[key],
    ]),
  );

  return {
    ...fallbackTemplate,
    ...appliedTemplate,
    id: template.id,
    name: template.name ?? fallbackTemplate.name ?? "Default",
    isDefault: template.isDefault ?? false,
  };
};

function hasEditorContent(value: unknown): boolean {
  if (!value) return false;

  if (typeof value === "string") {
    try {
      return hasEditorContent(JSON.parse(value));
    } catch {
      return value.trim().length > 0;
    }
  }

  if (Array.isArray(value)) {
    return value.some(hasEditorContent);
  }

  if (typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  if (typeof record.text === "string" && record.text.trim().length > 0) {
    return true;
  }

  return hasEditorContent(record.content);
}

export function TemplateSelector() {
  const { watch, setValue } = useFormContext();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingTemplate, setPendingTemplate] =
    useState<InvoiceTemplate | null>(null);

  const { data: templates, refetch } = useQuery(
    trpc.invoiceTemplate.list.queryOptions(),
  );

  const currentTemplateId = watch("template.id");
  const currentTemplateName = watch("template.name") || "Default";
  const status = watch("status");
  const canApplyTemplate = !status || editableStatuses.has(status);
  const disabledReason = canApplyTemplate
    ? null
    : "Templates can only be applied to draft, unpaid, or scheduled invoices.";

  const handleSelectTemplate = (template: InvoiceTemplate) => {
    const appliedTemplate = withTemplateDefaults(template, watch("template"));

    // Set entire template object at once - react-hook-form handles nested objects
    setValue("template", appliedTemplate, { shouldDirty: true });

    // Always update invoice-level fields from the template, even if null/undefined
    // This ensures switching templates fully replaces the previous template's content
    setValue("fromDetails", template.fromDetails ?? null, {
      shouldDirty: true,
    });
    setValue("paymentDetails", template.paymentDetails ?? null, {
      shouldDirty: true,
    });
    setValue("noteDetails", template.noteDetails ?? null, {
      shouldDirty: true,
    });
    setValue("bottomBlock", template.bottomBlock ?? null, {
      shouldDirty: true,
    });

    // Recalculate dueDate based on the new template's paymentTermsDays
    const appliedPaymentTermsDays = appliedTemplate.paymentTermsDays;
    const paymentTermsDays =
      typeof appliedPaymentTermsDays === "number"
        ? appliedPaymentTermsDays
        : DEFAULT_TEMPLATE.paymentTermsDays;
    const issueDate = watch("issueDate");
    if (issueDate) {
      const issueDateParsed = parseISO(issueDate);
      const newDueDate = addDays(issueDateParsed, paymentTermsDays);
      setValue("dueDate", localDateToUTCMidnight(newDueDate), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const hasPresentationBlocks = () =>
    hasEditorContent(watch("fromDetails")) ||
    hasEditorContent(watch("paymentDetails")) ||
    hasEditorContent(watch("noteDetails")) ||
    hasEditorContent(watch("bottomBlock"));

  const requestApplyTemplate = (template: InvoiceTemplate) => {
    if (!canApplyTemplate || template.id === currentTemplateId) {
      return;
    }

    if (hasPresentationBlocks()) {
      setPendingTemplate(template);
      return;
    }

    handleSelectTemplate(template);
  };

  const handleTemplateCreated = async (_newTemplate: {
    id: string;
    name: string;
  }) => {
    // Invalidate count query so settings-menu has fresh data
    queryClient.invalidateQueries({
      queryKey: trpc.invoiceTemplate.count.queryKey(),
    });

    await refetch();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="h-9 px-3 flex items-center justify-center gap-2 border border-border hover:bg-accent transition-colors text-xs"
          >
            <span className="max-w-[120px] truncate">
              {currentTemplateName}
            </span>
            <Icons.ChevronDown className="size-4 text-[#666]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" sideOffset={10}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[10px] text-muted-foreground font-normal px-2 py-1.5">
              APPLY TEMPLATE
            </DropdownMenuLabel>
            {templates?.map((template) => (
              <DropdownMenuCheckboxItem
                key={template.id}
                checked={currentTemplateId === template.id}
                disabled={!canApplyTemplate}
                onCheckedChange={() => requestApplyTemplate(template)}
                className={cn(
                  "text-xs",
                  currentTemplateId === template.id
                    ? "dark:bg-[#131313] text-primary"
                    : "text-[#666]",
                  "hover:dark:bg-[#131313]",
                )}
              >
                <span className="flex items-center gap-1">
                  {template.name}
                  {template.isDefault && (
                    <span className="text-muted-foreground text-[10px]">
                      (Default)
                    </span>
                  )}
                </span>
              </DropdownMenuCheckboxItem>
            ))}
            {(!templates || templates.length === 0) && (
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                No templates yet
              </div>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {disabledReason && (
            <>
              <div className="px-2 py-1.5 text-[10px] leading-4 text-muted-foreground">
                {disabledReason}
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            onClick={() => setDialogOpen(true)}
            className="text-xs cursor-pointer"
          >
            <Icons.Add className="mr-2 size-4" />
            Create new
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateTemplateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={handleTemplateCreated}
      />

      <AlertDialog
        open={!!pendingTemplate}
        onOpenChange={(open) => {
          if (!open) setPendingTemplate(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply template?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace the current invoice sender, payment details,
              note, footer, and payment terms with values from "
              {pendingTemplate?.name}". Customer, line items, invoice number,
              and status will not change.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingTemplate) {
                  handleSelectTemplate(pendingTemplate);
                }
                setPendingTemplate(null);
              }}
            >
              Apply template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
