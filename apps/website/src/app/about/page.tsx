import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "About CashPanel. Learn more about the team and company behind your AI-powered business assistant.",
  path: "/about",
  og: {
    title: "About CashPanel",
    description: "The team behind your business stack",
  },
});

export default function AboutPage() {
  return <div>AboutPage</div>;
}
