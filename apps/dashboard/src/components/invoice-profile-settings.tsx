"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cashpanel/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@cashpanel/ui/form";
import { Input } from "@cashpanel/ui/input";
import { SubmitButton } from "@cashpanel/ui/submit-button";
import { z } from "zod/v3";
import { useTeamMutation, useTeamQuery } from "@/hooks/use-team";
import { useZodForm } from "@/hooks/use-zod-form";
import { CountrySelector } from "./country-selector";

const nullableText = z.string().optional().nullable();

const formSchema = z.object({
  invoiceLegalName: nullableText,
  invoiceAddressLine1: nullableText,
  invoiceAddressLine2: nullableText,
  invoiceCity: nullableText,
  invoiceState: nullableText,
  invoicePostalCode: nullableText,
  invoiceCountry: nullableText,
  invoiceEmail: z.string().email().optional().nullable().or(z.literal("")),
  invoicePhone: nullableText,
  invoiceWebsite: nullableText,
  invoiceTaxNumber: nullableText,
  invoiceRegistrationNumber: nullableText,
});

const fields = [
  ["invoiceLegalName", "Legal name"],
  ["invoiceAddressLine1", "Address line 1"],
  ["invoiceAddressLine2", "Address line 2"],
  ["invoiceCity", "City"],
  ["invoiceState", "State / region"],
  ["invoicePostalCode", "Postal code"],
  ["invoiceCountry", "Country"],
  ["invoiceEmail", "Invoice email"],
  ["invoicePhone", "Phone"],
  ["invoiceWebsite", "Website"],
  ["invoiceTaxNumber", "Tax / VAT number"],
  ["invoiceRegistrationNumber", "Registration number"],
] as const;

type FormData = z.infer<typeof formSchema>;

const clean = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export function InvoiceProfileSettings() {
  const { data } = useTeamQuery();
  const updateTeamMutation = useTeamMutation();

  const form = useZodForm(formSchema, {
    defaultValues: {
      invoiceLegalName: data?.invoiceLegalName ?? "",
      invoiceAddressLine1: data?.invoiceAddressLine1 ?? "",
      invoiceAddressLine2: data?.invoiceAddressLine2 ?? "",
      invoiceCity: data?.invoiceCity ?? "",
      invoiceState: data?.invoiceState ?? "",
      invoicePostalCode: data?.invoicePostalCode ?? "",
      invoiceCountry: data?.invoiceCountry ?? "",
      invoiceEmail: data?.invoiceEmail ?? "",
      invoicePhone: data?.invoicePhone ?? "",
      invoiceWebsite: data?.invoiceWebsite ?? "",
      invoiceTaxNumber: data?.invoiceTaxNumber ?? "",
      invoiceRegistrationNumber: data?.invoiceRegistrationNumber ?? "",
    },
  });

  const onSubmit = form.handleSubmit((values: FormData) => {
    updateTeamMutation.mutate(
      Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, clean(value)]),
      ),
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Invoice profile</CardTitle>
            <CardDescription>
              These sender details are used to prefill the From block on new
              invoices.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(([name, label]) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-[#878787] font-normal">
                        {label}
                      </FormLabel>
                      <FormControl>
                        {name === "invoiceCountry" ? (
                          <CountrySelector
                            defaultValue={field.value ?? ""}
                            onSelect={(_code, countryName) => {
                              field.onChange(countryName);
                            }}
                          />
                        ) : (
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            autoComplete="off"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <SubmitButton
              isSubmitting={updateTeamMutation.isPending}
              disabled={updateTeamMutation.isPending}
            >
              Save
            </SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
