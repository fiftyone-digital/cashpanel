import { PaymentIssueEmail } from "@cashpanel/email/emails/payment-issue";
import { render } from "@cashpanel/email/render";
import type { Job } from "bullmq";
import { Resend } from "resend";
import type { PaymentIssuePayload } from "../../schemas/teams";
import { BaseProcessor } from "../base";

const resend = new Resend(process.env.RESEND_API_KEY!);

export class PaymentIssueProcessor extends BaseProcessor<PaymentIssuePayload> {
  async process(job: Job<PaymentIssuePayload>): Promise<void> {
    const { teamId, email, fullName, teamName } = job.data;

    this.logger.info("Sending payment issue email", {
      jobId: job.id,
      teamId,
      email,
    });

    const html = await render(PaymentIssueEmail({ fullName, teamName }));

    await resend.emails.send({
      from: "CashPanel <notifications@mail.cashpanel.io>",
      replyTo: "mathieu@cashpanel.io",
      to: email,
      subject: "Your payment didn't go through",
      html,
    });

    this.logger.info("Payment issue email sent", {
      jobId: job.id,
      teamId,
    });
  }
}
