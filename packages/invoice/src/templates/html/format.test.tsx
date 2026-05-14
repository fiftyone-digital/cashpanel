import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { formatEditorContent } from "./format";

describe("HTML invoice editor content formatting", () => {
  test("renders empty paragraphs as visible blank lines", () => {
    const html = renderToStaticMarkup(
      formatEditorContent({
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Line one" }],
          },
          {
            type: "paragraph",
            content: [],
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "Line two" }],
          },
        ],
      }),
    );

    expect(html).toContain("Line one");
    expect(html).toContain("<p><br/></p>");
    expect(html).toContain("Line two");
  });
});
