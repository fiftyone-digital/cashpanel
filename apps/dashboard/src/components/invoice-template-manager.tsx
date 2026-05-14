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
import { useToast } from "@cashpanel/ui/use-toast";
import { stripSpecialCharacters } from "@cashpanel/utils";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTeamQuery } from "@/hooks/use-team";
import { useUpload } from "@/hooks/use-upload";
import { useUserQuery } from "@/hooks/use-user";
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
    content: line ? [{ type: "text", text: line }] : [],
  })),
});

const textToDoc = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  return textDoc(trimmed.split(/\n/));
};

const getPlainText = (value: unknown) => {
  if (!value || typeof value !== "object" || !("content" in value)) {
    return "";
  }

  const content = (value as EditorDoc).content;
  if (!Array.isArray(content)) return "";

  return content
    .map((node) =>
      Array.isArray(node.content)
        ? node.content.map((item) => item.text ?? "").join("")
        : "",
    )
    .join("\n");
};

const optionLabel = (
  field: string,
  options: readonly (readonly [string, string])[],
) => options.find(([value]) => value === field)?.[1] ?? field;

const withTemplateDefaults = (
  template: Template,
  teamLogoUrl?: string | null,
): InvoiceTemplate => {
  const previewTemplate = Object.fromEntries(
    Object.entries(DEFAULT_TEMPLATE).map(([key, value]) => [
      key,
      (template as Record<string, unknown>)[key] ?? value,
    ]),
  ) as InvoiceTemplate;

  return {
    ...previewTemplate,
    logoUrl: template.logoUrl ?? teamLogoUrl ?? DEFAULT_TEMPLATE.logoUrl,
  };
};

const createPreviewInvoice = (
  template: Template,
  teamLogoUrl?: string | null,
): Invoice => {
  const previewTemplate = withTemplateDefaults(template, teamLogoUrl);
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
    bottomBlock: selectedTemplateBlock(template.bottomBlock),
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

const selectedTemplateBlock = (value: unknown) =>
  value && typeof value === "object" ? (value as EditorDoc) : null;

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

function TemplatePreview({
  template,
  teamLogoUrl,
}: {
  template: Template;
  teamLogoUrl?: string | null;
}) {
  const previewInvoice = createPreviewInvoice(template, teamLogoUrl);
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
  const { data: team } = useTeamQuery();
  const { data: user } = useUserQuery();
  const { uploadFile, isLoading: isUploadingLogo } = useUpload();
  const { toast } = useToast();
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

  const teamLogoUrl = team?.logoUrl ?? null;

  const updateSelected = (data: Record<string, unknown>) => {
    updateTemplateMutation.mutate({
      id: selectedTemplate.id,
      ...data,
    });
  };

  const uploadTemplateLogo = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!team?.id || !user?.id) {
        throw new Error("Missing team or user");
      }

      const filename = stripSpecialCharacters(file.name);

      const { url } = await uploadFile({
        file,
        path: [
          user.id,
          "teams",
          team.id,
          "invoice-templates",
          selectedTemplate.id,
          filename,
        ],
        bucket: "avatars",
      });

      updateSelected({ logoUrl: url });
      event.target.value = "";
    } catch {
      toast({
        title: "Logo upload failed",
        description: "Please try again.",
        variant: "error",
      });
    }
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
              <Label>Logo</Label>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-16 items-center justify-center border border-border bg-background">
                  {selectedTemplate.logoUrl || teamLogoUrl ? (
                    <img
                      src={selectedTemplate.logoUrl ?? teamLogoUrl ?? ""}
                      alt="Invoice logo preview"
                      className="max-h-8 max-w-14 object-contain"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-[repeating-linear-gradient(-60deg,#DBDBDB,#DBDBDB_1px,transparent_1px,transparent_5px)] dark:bg-[repeating-linear-gradient(-60deg,#2C2C2C,#2C2C2C_1px,transparent_1px,transparent_5px)]" />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 gap-2">
                  <Input
                    key={`${selectedTemplate.id}-logo`}
                    defaultValue={selectedTemplate.logoUrl ?? ""}
                    placeholder={
                      teamLogoUrl
                        ? "Using team logo"
                        : "https://example.com/logo.png"
                    }
                    onBlur={(event) =>
                      updateSelected({ logoUrl: event.target.value || null })
                    }
                  />
                  <input
                    id={`template-logo-${selectedTemplate.id}`}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                    onChange={uploadTemplateLogo}
                    disabled={isUploadingLogo}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingLogo}
                    onClick={() =>
                      document
                        .getElementById(`template-logo-${selectedTemplate.id}`)
                        ?.click()
                    }
                  >
                    {isUploadingLogo ? "Uploading..." : "Upload"}
                  </Button>
                  {selectedTemplate.logoUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateSelected({ logoUrl: null })}
                    >
                      Use team
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to use the team logo by default.
              </p>
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label>Payment details</Label>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox
                    checked={selectedTemplate.paymentDetailsFullWidth ?? false}
                    onCheckedChange={(checked) =>
                      updateSelected({
                        paymentDetailsFullWidth: checked === true,
                      })
                    }
                  />
                  <span>Full width</span>
                </div>
              </div>
              <Textarea
                key={`${selectedTemplate.id}-payment-details`}
                rows={4}
                placeholder={"Bank: Example Bank\nIBAN: GB00 0000 0000 0000"}
                defaultValue={getPlainText(selectedTemplate.paymentDetails)}
                onBlur={(event) =>
                  updateSelected({
                    paymentDetails: textToDoc(event.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Note</Label>
              <Textarea
                key={`${selectedTemplate.id}-note`}
                rows={4}
                placeholder="Questions? Contact support@example.com."
                defaultValue={getPlainText(selectedTemplate.noteDetails)}
                onBlur={(event) =>
                  updateSelected({
                    noteDetails: textToDoc(event.target.value),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Rendered to the right of payment details unless payment details
                are full width.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Contact details</Label>
            <Textarea
              key={`${selectedTemplate.id}-contact-details`}
              rows={3}
              placeholder="Questions? Contact us at support@example.com."
              defaultValue={getPlainText(selectedTemplate.bottomBlock)}
              onBlur={(event) =>
                updateSelected({
                  bottomBlock: textToDoc(event.target.value),
                })
              }
            />
            <p className="text-xs text-muted-foreground">
              Rendered as small light-grey text at the very bottom of the
              invoice.
            </p>
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

      <TemplatePreview template={selectedTemplate} teamLogoUrl={teamLogoUrl} />
    </div>
  );
}
