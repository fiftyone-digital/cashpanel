"use client";

import type { RouterOutputs } from "@api/trpc/routers/_app";
import { DEFAULT_TEMPLATE } from "@cashpanel/invoice";
import { HtmlTemplate } from "@cashpanel/invoice/templates/html";
import type {
  EditorDoc,
  Invoice,
  Template as InvoiceTemplate,
} from "@cashpanel/invoice/types";
import { Button } from "@cashpanel/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@cashpanel/ui/card";
import { Checkbox } from "@cashpanel/ui/checkbox";
import { Input } from "@cashpanel/ui/input";
import { Label } from "@cashpanel/ui/label";
import { Textarea } from "@cashpanel/ui/textarea";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTRPC } from "@/trpc/client";

const fromFieldOptions = [
  ["name", "Name"],
  ["address", "Address"],
  ["contact", "Contact"],
  ["email", "Email"],
  ["billingEmail", "Billing email"],
  ["phone", "Phone"],
  ["website", "Website"],
  ["taxNumber", "Tax / VAT number"],
  ["registrationNumber", "Registration number"],
] as const;

const customerFieldOptions = [
  ["name", "Name"],
  ["address", "Address"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["website", "Website"],
  ["vatNumber", "VAT number"],
] as const;

const labelFields = [
  ["fromLabel", "From label"],
  ["customerLabel", "To label"],
  ["descriptionLabel", "Description label"],
  ["quantityLabel", "Quantity label"],
  ["priceLabel", "Price label"],
  ["totalLabel", "Total label"],
] as const;

type Template = RouterOutputs["invoiceTemplate"]["list"][number];

const textDoc = (lines: string[]): EditorDoc => ({
  type: "doc",
  content: lines.map((line) => ({
    type: "paragraph",
    content: [{ type: "text", text: line }],
  })),
});

const optionLabel = (
  field: string,
  options: readonly (readonly [string, string])[],
) => options.find(([value]) => value === field)?.[1] ?? field;

const withTemplateDefaults = (template: Template): InvoiceTemplate =>
  Object.fromEntries(
    Object.entries(DEFAULT_TEMPLATE).map(([key, value]) => [
      key,
      (template as Record<string, unknown>)[key] ?? value,
    ]),
  ) as InvoiceTemplate;

const createPreviewInvoice = (template: Template): Invoice => {
  const previewTemplate = withTemplateDefaults(template);
  const fromFields = toFieldList(
    template.fromFields,
    DEFAULT_TEMPLATE.fromFields,
  );
  const customerFields = toFieldList(
    template.customerFields,
    DEFAULT_TEMPLATE.customerFields,
  );
  const currency = previewTemplate.currency ?? DEFAULT_TEMPLATE.currency;

  return {
    id: "template-preview",
    dueDate: "2026-06-12",
    invoiceNumber: "INV-0001",
    createdAt: "2026-05-13",
    amount: 5000,
    currency,
    lineItems: [
      {
        name: "Product or service",
        description: "Optional copied product description",
        quantity: 1,
        price: 5000,
      },
    ],
    paymentDetails: previewTemplate.paymentDetails,
    customerDetails: textDoc(
      customerFields.map((field) => optionLabel(field, customerFieldOptions)),
    ),
    reminderSentAt: null,
    updatedAt: null,
    note: null,
    internalNote: null,
    paidAt: null,
    vat: null,
    tax: null,
    filePath: null,
    status: "draft",
    viewedAt: null,
    fromDetails: textDoc(
      fromFields.map((field) => optionLabel(field, fromFieldOptions)),
    ),
    issueDate: "2026-05-13",
    sentAt: null,
    template: previewTemplate,
    noteDetails: previewTemplate.noteDetails,
    customerName: "Customer",
    token: "template-preview",
    sentTo: null,
    discount: null,
    topBlock: null,
    bottomBlock: null,
    customer: {
      name: "Customer",
      website: null,
      email: null,
    },
    customerId: null,
    team: {
      name: "Company",
    },
  };
};

const toNumber = (value: string) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const toFieldList = (value: unknown, fallback: readonly string[]) =>
  Array.isArray(value)
    ? value.filter((field): field is string => typeof field === "string")
    : [...fallback];

function FieldToggleGroup({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: string[];
  options: readonly (readonly [string, string])[];
  onChange: (value: string[]) => void;
}) {
  const toggle = (field: string, checked: boolean) => {
    onChange(
      checked ? [...value, field] : value.filter((item) => item !== field),
    );
  };

  return (
    <div className="space-y-3">
      <Label>{title}</Label>
      <div className="grid grid-cols-2 gap-3">
        {options.map(([field, label]) => {
          const id = `${title}-${field}`;

          return (
            <div
              key={field}
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              <Checkbox
                id={id}
                checked={value.includes(field)}
                onCheckedChange={(checked) => toggle(field, checked === true)}
              />
              <Label htmlFor={id} className="text-xs font-normal">
                {label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TemplatePreview({ template }: { template: Template }) {
  const previewInvoice = createPreviewInvoice(template);
  const height = previewInvoice.template.size === "letter" ? 971 : 842;
  const width = previewInvoice.template.size === "letter" ? 750 : 595;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="w-full max-w-[595px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">
          <HtmlTemplate data={previewInvoice} width={width} height={height} />
        </div>
      </CardContent>
    </Card>
  );
}

export function InvoiceTemplateManager() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: templates } = useSuspenseQuery(
    trpc.invoiceTemplate.list.queryOptions(),
  );
  const [selectedId, setSelectedId] = useState<string | undefined>(
    templates?.[0]?.id,
  );

  const selectedTemplate = useMemo(
    () =>
      templates?.find((template) => template.id === selectedId) ??
      templates?.[0],
    [templates, selectedId],
  );

  const createTemplateMutation = useMutation(
    trpc.invoiceTemplate.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.invoiceTemplate.list.queryKey(),
        });
        if (data?.id) {
          setSelectedId(data.id);
        }
      },
    }),
  );

  const updateTemplateMutation = useMutation(
    trpc.invoiceTemplate.upsert.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.invoiceTemplate.list.queryKey(),
        });
      },
    }),
  );

  const setDefaultMutation = useMutation(
    trpc.invoiceTemplate.setDefault.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.invoiceTemplate.list.queryKey(),
        });
      },
    }),
  );

  const deleteTemplateMutation = useMutation(
    trpc.invoiceTemplate.delete.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: trpc.invoiceTemplate.list.queryKey(),
        });
        setSelectedId(data?.newDefault?.id);
      },
    }),
  );

  if (!selectedTemplate) {
    return (
      <div className="space-y-4">
        <Button
          onClick={() => createTemplateMutation.mutate({ name: "Default" })}
        >
          Create default template
        </Button>
      </div>
    );
  }

  const updateSelected = (data: Record<string, unknown>) => {
    updateTemplateMutation.mutate({
      id: selectedTemplate.id,
      ...data,
    });
  };

  const duplicateSelected = () => {
    const {
      id: _id,
      isDefault: _isDefault,
      ...templateData
    } = selectedTemplate;
    createTemplateMutation.mutate({
      ...(Object.fromEntries(
        Object.entries(templateData).map(([key, value]) => [
          key,
          value === null ? undefined : value,
        ]),
      ) as any),
      name: `${selectedTemplate.name} (Copy)`,
      isDefault: false,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[240px_minmax(420px,1fr)_minmax(360px,595px)]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Templates</CardTitle>
            <Button
              size="sm"
              onClick={() =>
                createTemplateMutation.mutate({ name: "New template" })
              }
            >
              Create
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {templates?.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setSelectedId(template.id)}
              className={`w-full text-left border px-3 py-2 text-sm ${
                selectedTemplate.id === template.id
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              <div className="truncate">{template.name}</div>
              {template.isDefault && (
                <div className="text-[10px] text-muted-foreground">Default</div>
              )}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Configuration</CardTitle>
            <div className="flex gap-2">
              {!selectedTemplate.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setDefaultMutation.mutate({ id: selectedTemplate.id })
                  }
                >
                  Set default
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={duplicateSelected}>
                Duplicate
              </Button>
              {!selectedTemplate.isDefault && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    deleteTemplateMutation.mutate({ id: selectedTemplate.id })
                  }
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                key={`${selectedTemplate.id}-name`}
                defaultValue={selectedTemplate.name ?? ""}
                onBlur={(event) => updateSelected({ name: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                key={`${selectedTemplate.id}-title`}
                defaultValue={selectedTemplate.title ?? DEFAULT_TEMPLATE.title}
                onBlur={(event) =>
                  updateSelected({ title: event.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input
                key={`${selectedTemplate.id}-currency`}
                defaultValue={
                  selectedTemplate.currency ?? DEFAULT_TEMPLATE.currency
                }
                onBlur={(event) =>
                  updateSelected({ currency: event.target.value.toUpperCase() })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Payment terms days</Label>
              <Input
                key={`${selectedTemplate.id}-payment-terms`}
                type="number"
                min={0}
                max={365}
                defaultValue={selectedTemplate.paymentTermsDays ?? 30}
                onBlur={(event) =>
                  updateSelected({
                    paymentTermsDays: toNumber(event.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {labelFields.map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label>{label}</Label>
                <Input
                  key={`${selectedTemplate.id}-${key}`}
                  defaultValue={(selectedTemplate as any)[key] ?? ""}
                  onBlur={(event) =>
                    updateSelected({ [key]: event.target.value })
                  }
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FieldToggleGroup
              title="From fields"
              value={toFieldList(
                selectedTemplate.fromFields,
                DEFAULT_TEMPLATE.fromFields,
              )}
              options={fromFieldOptions}
              onChange={(fromFields) => updateSelected({ fromFields })}
            />
            <FieldToggleGroup
              title="To fields"
              value={toFieldList(
                selectedTemplate.customerFields,
                DEFAULT_TEMPLATE.customerFields,
              )}
              options={customerFieldOptions}
              onChange={(customerFields) => updateSelected({ customerFields })}
            />
          </div>

          <div className="space-y-2">
            <Label>Email subject</Label>
            <Input
              key={`${selectedTemplate.id}-email-subject`}
              defaultValue={selectedTemplate.emailSubject ?? ""}
              onBlur={(event) =>
                updateSelected({ emailSubject: event.target.value || null })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Email body</Label>
            <Textarea
              key={`${selectedTemplate.id}-email-body`}
              rows={4}
              defaultValue={selectedTemplate.emailBody ?? ""}
              onBlur={(event) =>
                updateSelected({ emailBody: event.target.value || null })
              }
            />
          </div>
        </CardContent>
      </Card>

      <TemplatePreview template={selectedTemplate} />
    </div>
  );
}
