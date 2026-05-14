// Define a generic customer interface to avoid circular dependencies
interface CustomerData {
  name?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  zip?: string | null;
  country?: string | null;
  contact?: string | null;
  email?: string | null;
  billingEmail?: string | null;
  phone?: string | null;
  website?: string | null;
  vatNumber?: string | null;
}

export type CustomerProfileField =
  | "name"
  | "address"
  | "contact"
  | "email"
  | "billingEmail"
  | "phone"
  | "website"
  | "vatNumber";

export type InvoiceProfileField =
  | "name"
  | "address"
  | "email"
  | "phone"
  | "website"
  | "taxNumber"
  | "registrationNumber";

export interface InvoiceProfileData {
  invoiceLegalName?: string | null;
  name?: string | null;
  invoiceAddressLine1?: string | null;
  invoiceAddressLine2?: string | null;
  invoiceCity?: string | null;
  invoiceState?: string | null;
  invoicePostalCode?: string | null;
  invoiceCountry?: string | null;
  countryCode?: string | null;
  invoiceEmail?: string | null;
  email?: string | null;
  invoicePhone?: string | null;
  invoiceWebsite?: string | null;
  invoiceTaxNumber?: string | null;
  invoiceRegistrationNumber?: string | null;
}

const DEFAULT_CUSTOMER_FIELDS: CustomerProfileField[] = [
  "name",
  "address",
  "email",
  "phone",
  "vatNumber",
];

const DEFAULT_INVOICE_PROFILE_FIELDS: InvoiceProfileField[] = [
  "name",
  "address",
  "email",
  "phone",
  "website",
  "taxNumber",
  "registrationNumber",
];

const hasField = <T extends string>(fields: T[] | undefined, field: T) =>
  (fields ?? []).includes(field);

const textParagraph = (text: string) => ({
  type: "paragraph",
  content: [{ text, type: "text" }],
});

export const transformCustomerToContent = (
  customer?: CustomerData | null,
  fields: CustomerProfileField[] = DEFAULT_CUSTOMER_FIELDS,
) => {
  if (!customer) return null;

  const content = [];

  if (hasField(fields, "name") && customer.name) {
    content.push(textParagraph(customer.name));
  }

  if (hasField(fields, "address")) {
    if (customer.addressLine1) {
      content.push(textParagraph(customer.addressLine1));
    }

    if (customer.addressLine2) {
      content.push(textParagraph(customer.addressLine2));
    }

    if (customer.zip || customer.city) {
      content.push(
        textParagraph(`${customer.zip || ""} ${customer.city || ""}`.trim()),
      );
    }

    if (customer.country) {
      content.push(textParagraph(customer.country));
    }
  }

  if (hasField(fields, "email") && customer.email) {
    content.push(textParagraph(customer.email));
  }

  if (hasField(fields, "billingEmail") && customer.billingEmail) {
    content.push(textParagraph(customer.billingEmail));
  }

  if (hasField(fields, "contact") && customer.contact) {
    content.push(textParagraph(customer.contact));
  }

  if (hasField(fields, "phone") && customer.phone) {
    content.push(textParagraph(customer.phone));
  }

  if (hasField(fields, "website") && customer.website) {
    content.push(textParagraph(customer.website));
  }

  if (hasField(fields, "vatNumber") && customer.vatNumber) {
    content.push(textParagraph(customer.vatNumber));
  }

  if (content.length === 0) {
    return null;
  }

  return {
    type: "doc",
    content,
  };
};

export const transformInvoiceProfileToContent = (
  profile?: InvoiceProfileData | null,
  fields: InvoiceProfileField[] = DEFAULT_INVOICE_PROFILE_FIELDS,
) => {
  if (!profile) return null;

  const content = [];
  const name = profile.invoiceLegalName || profile.name;
  const email = profile.invoiceEmail || profile.email;

  if (hasField(fields, "name") && name) {
    content.push(textParagraph(name));
  }

  if (hasField(fields, "address")) {
    if (profile.invoiceAddressLine1) {
      content.push(textParagraph(profile.invoiceAddressLine1));
    }

    if (profile.invoiceAddressLine2) {
      content.push(textParagraph(profile.invoiceAddressLine2));
    }

    const cityLine = [
      profile.invoicePostalCode,
      profile.invoiceCity,
      profile.invoiceState,
    ]
      .filter(Boolean)
      .join(" ");

    if (cityLine) {
      content.push(textParagraph(cityLine));
    }

    if (profile.invoiceCountry || profile.countryCode) {
      content.push(
        textParagraph(profile.invoiceCountry || profile.countryCode || ""),
      );
    }
  }

  if (hasField(fields, "email") && email) {
    content.push(textParagraph(email));
  }

  if (hasField(fields, "phone") && profile.invoicePhone) {
    content.push(textParagraph(profile.invoicePhone));
  }

  if (hasField(fields, "website") && profile.invoiceWebsite) {
    content.push(textParagraph(profile.invoiceWebsite));
  }

  if (hasField(fields, "taxNumber") && profile.invoiceTaxNumber) {
    content.push(textParagraph(profile.invoiceTaxNumber));
  }

  if (
    hasField(fields, "registrationNumber") &&
    profile.invoiceRegistrationNumber
  ) {
    content.push(textParagraph(profile.invoiceRegistrationNumber));
  }

  if (content.length === 0) {
    return null;
  }

  return {
    type: "doc",
    content,
  };
};
