import { describe, expect, test } from "bun:test";
import {
  transformCustomerToContent,
  transformInvoiceProfileToContent,
} from "./transform";

const textLines = (doc: ReturnType<typeof transformCustomerToContent>) =>
  doc?.content.map((node) => node.content?.[0]?.text) ?? [];

describe("invoice content transforms", () => {
  test("filters customer invoice fields by template settings", () => {
    const doc = transformCustomerToContent(
      {
        name: "Acme",
        addressLine1: "1 Market Street",
        city: "Paris",
        email: "billing@acme.test",
        phone: "+33 1",
        website: "acme.test",
        vatNumber: "FR123",
      },
      ["name", "email", "vatNumber"],
    );

    expect(textLines(doc)).toEqual(["Acme", "billing@acme.test", "FR123"]);
  });

  test("builds sender details from invoice profile with team fallbacks", () => {
    const doc = transformInvoiceProfileToContent(
      {
        name: "Team Name",
        email: "team@example.com",
        invoiceLegalName: "Legal Name Ltd",
        invoiceAddressLine1: "41 Market Place",
        invoiceCity: "Chippenham",
        invoicePostalCode: "SN15 3HR",
        invoiceCountry: "United Kingdom",
        invoiceTaxNumber: "GB123",
      },
      ["name", "address", "email", "taxNumber"],
    );

    expect(textLines(doc)).toEqual([
      "Legal Name Ltd",
      "41 Market Place",
      "SN15 3HR Chippenham",
      "United Kingdom",
      "team@example.com",
      "GB123",
    ]);
  });
});
