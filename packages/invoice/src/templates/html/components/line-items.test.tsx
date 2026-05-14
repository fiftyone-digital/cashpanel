import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { LineItems } from "./line-items";

describe("HTML invoice line items", () => {
  test("renders invoice-owned line item descriptions", () => {
    const html = renderToStaticMarkup(
      <LineItems
        lineItems={[
          {
            name: "Consulting",
            description: "Copied product description",
            quantity: 1,
            price: 500,
          },
        ]}
        currency="EUR"
        descriptionLabel="Description"
        quantityLabel="Quantity"
        priceLabel="Price"
        totalLabel="Total"
        locale="en-US"
      />,
    );

    expect(html).toContain("Consulting");
    expect(html).toContain("Copied product description");
  });
});
