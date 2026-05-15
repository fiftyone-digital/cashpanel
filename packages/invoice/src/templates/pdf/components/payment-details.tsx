import { Text, View } from "@react-pdf/renderer";
import type { EditorDoc } from "../../../types";
import { PlainEditorContent } from "./plain-editor-content";

type Props = {
  content?: EditorDoc | null;
  paymentLabel?: string;
};

export function PaymentDetails({ content, paymentLabel }: Props) {
  if (!content) return null;

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 9, fontWeight: 500 }}>{paymentLabel}</Text>
      <PlainEditorContent content={content} />
    </View>
  );
}
