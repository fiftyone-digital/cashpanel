import { Testimonials } from "@/components/testimonials";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Customer Stories",
  description:
    "See how solo founders use CashPanel to run their businesses with less admin.",
  path: "/testimonials",
  og: {
    title: "Customer Stories",
    description: "How founders run their business with CashPanel",
  },
  keywords: [
    "customer testimonials",
    "user stories",
    "cashpanel reviews",
    "customer success",
    "testimonials",
  ],
});

export default function Page() {
  return <Testimonials />;
}
