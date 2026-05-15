import { Text } from "@react-pdf/renderer";
import type { EditorDoc } from "../../../types";

type Props = {
  content?: EditorDoc | null;
  color?: string;
  fontSize?: number;
};

const editorDocToText = (content: EditorDoc) =>
  content.content
    .map((node) => {
      if (!Array.isArray(node.content) || node.content.length === 0) {
        return "";
      }

      return node.content
        .map((item) => {
          if (item.type === "hardBreak") {
            return "\n";
          }

          return item.text ?? "";
        })
        .join("");
    })
    .join("\n");

export function PlainEditorContent({
  content,
  color = "#000",
  fontSize = 9,
}: Props) {
  if (!content) {
    return null;
  }

  const text = editorDocToText(content);

  if (!text.trim()) {
    return null;
  }

  return (
    <Text
      style={{
        color,
        fontSize,
        lineHeight: 1.35,
        marginTop: 10,
      }}
    >
      {text}
    </Text>
  );
}
