import { View } from "@react-pdf/renderer";
import type { EditorDoc } from "../../../types";
import type { PDFTextStyle } from "../format";
import { formatEditorContent } from "../format";

type Props = {
  content?: EditorDoc | null;
  textStyle?: PDFTextStyle;
};

export function EditorContent({ content, textStyle }: Props) {
  if (!content) {
    return null;
  }

  return (
    <View style={{ marginTop: 10, lineHeight: 0.9 }}>
      {formatEditorContent(content, textStyle)}
    </View>
  );
}
