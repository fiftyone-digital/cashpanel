"use client";

import { cn } from "@midday/ui/cn";
import { SubmitButton } from "@midday/ui/submit-button";
import { useToast } from "@midday/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { revalidateAfterCheckout } from "@/actions/revalidate-action";
import { useTRPC } from "@/trpc/client";

type PlanOption = "starter" | "pro";

type ComplimentaryAccessBoxProps = {
  className?: string;
  onActivated?: () => Promise<void> | void;
  selectedPlan?: PlanOption;
};

export function ComplimentaryAccessBox({
  className,
  onActivated,
  selectedPlan,
}: ComplimentaryAccessBoxProps) {
  const { toast } = useToast();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data } = useQuery(trpc.billing.getComplimentaryAccess.queryOptions());

  const activateMutation = useMutation(
    trpc.billing.activateComplimentaryAccess.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.user.me.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.team.current.queryKey(),
          }),
          onActivated?.(),
        ]);

        await revalidateAfterCheckout();
      },
      onError: (error) => {
        const isForbidden = error.data?.code === "FORBIDDEN";
        const isInvalidState = error.data?.code === "BAD_REQUEST";

        toast({
          duration: 3500,
          title: "Unable to activate complimentary access",
          description: isForbidden
            ? "This account is not approved for complimentary access."
            : isInvalidState
              ? "Complimentary access can only be activated while the team is still on trial."
              : "Please try again or contact support.",
        });
      },
    }),
  );

  if (!data?.eligible || data.active) {
    return null;
  }

  const activatePlan = (plan: PlanOption) => {
    activateMutation.mutate({ plan });
  };

  return (
    <div
      className={cn(
        "border border-border bg-muted/30 p-3 space-y-3",
        className,
      )}
    >
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground">
          Complimentary access
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This account is approved for complimentary access. You can activate a
          plan without entering payment details.
        </p>
      </div>

      {selectedPlan ? (
        <SubmitButton
          className="w-full bg-background border border-border text-foreground font-medium text-sm hover:bg-background"
          isSubmitting={activateMutation.isPending}
          onClick={() => activatePlan(selectedPlan)}
        >
          Activate {selectedPlan === "pro" ? "Pro" : "Starter"} for free
        </SubmitButton>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <SubmitButton
            className="w-full bg-background border border-border text-foreground font-medium text-sm hover:bg-background"
            isSubmitting={activateMutation.isPending}
            onClick={() => activatePlan("starter")}
          >
            Starter for free
          </SubmitButton>

          <SubmitButton
            className="w-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90"
            isSubmitting={activateMutation.isPending}
            onClick={() => activatePlan("pro")}
          >
            Pro for free
          </SubmitButton>
        </div>
      )}
    </div>
  );
}
