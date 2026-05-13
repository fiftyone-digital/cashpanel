import type { Metadata } from "next";
import { SetupMfa } from "@/components/setup-mfa";

export const metadata: Metadata = {
  title: "Setup MFA | CashPanel",
};

export default function Setup() {
  return <SetupMfa />;
}
