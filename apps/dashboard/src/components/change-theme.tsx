import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cashpanel/ui/card";
import { ThemeSwitch } from "@/components/theme-switch";

export function ChangeTheme() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how CashPanel looks on your device.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="w-[240px]">
          <ThemeSwitch />
        </div>
      </CardContent>
    </Card>
  );
}
