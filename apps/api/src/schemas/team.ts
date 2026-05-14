import { z } from "@hono/zod-openapi";

export const teamResponseSchema = z.object({
  id: z.string().uuid().openapi({
    description: "Unique identifier of the team",
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
  name: z.string().openapi({
    description: "Name of the team or organization",
    example: "Acme Corporation",
  }),
  logoUrl: z.string().url().nullable().openapi({
    description: "URL to the team's logo image",
    example: "https://cdn.cashpanel.io/logos/acme-corp.png",
  }),
  plan: z.enum(["trial", "starter", "pro"]).openapi({
    description: "Current subscription plan of the team",
    example: "pro",
  }),
  email: z.string().email().nullable().optional().openapi({
    description: "Primary contact email address for the team",
    example: "team@acme.com",
  }),
  baseCurrency: z.string().nullable().optional().openapi({
    description:
      "Base currency for the team in ISO 4217 format (3-letter currency code)",
    example: "USD",
  }),
  countryCode: z.string().nullable().optional().openapi({
    description: "Country code for the team in ISO 3166-1 alpha-2 format",
    example: "US",
  }),
  fiscalYearStartMonth: z
    .number()
    .int()
    .min(1)
    .max(12)
    .nullable()
    .optional()
    .openapi({
      description:
        "Month when the fiscal year starts (1-12). Null for trailing 12 months.",
      example: 1,
    }),
  invoiceLegalName: z.string().nullable().optional().openapi({
    description: "Legal sender name used on invoices",
    example: "Acme Corporation Ltd",
  }),
  invoiceAddressLine1: z.string().nullable().optional().openapi({
    description: "Invoice sender address line 1",
    example: "123 Market Street",
  }),
  invoiceAddressLine2: z.string().nullable().optional().openapi({
    description: "Invoice sender address line 2",
    example: "Suite 400",
  }),
  invoiceCity: z.string().nullable().optional().openapi({
    description: "Invoice sender city",
    example: "San Francisco",
  }),
  invoiceState: z.string().nullable().optional().openapi({
    description: "Invoice sender state or region",
    example: "CA",
  }),
  invoicePostalCode: z.string().nullable().optional().openapi({
    description: "Invoice sender postal code",
    example: "94103",
  }),
  invoiceCountry: z.string().nullable().optional().openapi({
    description: "Invoice sender country display name",
    example: "United States",
  }),
  invoiceEmail: z.string().nullable().optional().openapi({
    description: "Invoice sender email",
    example: "billing@acme.com",
  }),
  invoicePhone: z.string().nullable().optional().openapi({
    description: "Invoice sender phone",
    example: "+1 555 0100",
  }),
  invoiceWebsite: z.string().nullable().optional().openapi({
    description: "Invoice sender website",
    example: "acme.com",
  }),
  invoiceTaxNumber: z.string().nullable().optional().openapi({
    description: "Invoice sender tax or VAT number",
    example: "VAT123456789",
  }),
  invoiceRegistrationNumber: z.string().nullable().optional().openapi({
    description: "Invoice sender company registration number",
    example: "12345678",
  }),
});

export const teamsResponseSchema = z.object({
  data: z.array(teamResponseSchema).openapi({
    description: "Array of teams that the user has access to",
  }),
});

export const getTeamByIdSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      description: "Unique identifier of the team",
      example: "123e4567-e89b-12d3-a456-426614174000",
      param: {
        in: "path",
        name: "id",
        required: true,
      },
    })
    .openapi({
      description: "Unique identifier of the team",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
});

function getConfiguredSupabaseHostnames(): string[] {
  return [process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_URL]
    .map((url) => {
      if (!url) {
        return null;
      }

      try {
        return new URL(url).hostname.toLowerCase();
      } catch {
        return null;
      }
    })
    .filter((hostname): hostname is string => Boolean(hostname));
}

/**
 * Validates that a logo URL is hosted on CashPanel or the configured Supabase
 * Storage project used by the dashboard upload flow.
 */
function isValidTeamLogoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (
      hostname === "cdn.cashpanel.io" ||
      hostname === "cashpanel.io" ||
      hostname.endsWith(".cashpanel.io")
    ) {
      return true;
    }

    return getConfiguredSupabaseHostnames().includes(hostname);
  } catch {
    return false;
  }
}

export const updateTeamByIdSchema = z.object({
  name: z.string().min(2).max(32).optional().openapi({
    description:
      "Name of the team or organization. Must be between 2 and 32 characters",
    example: "Acme Corporation",
  }),
  email: z.string().email().optional().openapi({
    description: "Primary contact email address for the team",
    example: "team@acme.com",
  }),
  logoUrl: z
    .string()
    .url()
    .refine(isValidTeamLogoUrl, {
      message:
        "logoUrl must be hosted on cashpanel.io or the configured Supabase project",
    })
    .optional()
    .openapi({
      description:
        "URL to the team's logo image. Must be hosted on cashpanel.io or the configured Supabase project",
      example: "https://cdn.cashpanel.io/logos/acme-corp.png",
    }),
  baseCurrency: z.string().optional().openapi({
    description:
      "Base currency for the team in ISO 4217 format (3-letter currency code)",
    example: "USD",
  }),
  countryCode: z.string().optional().openapi({
    description: "Country code for the team",
    example: "US",
  }),
  fiscalYearStartMonth: z
    .number()
    .int()
    .min(1)
    .max(12)
    .nullable()
    .optional()
    .openapi({
      description:
        "Month when the fiscal year starts (1-12). Null for trailing 12 months. Defaults based on country if not specified.",
      example: 4,
    }),
  exportSettings: z
    .object({
      csvDelimiter: z.string(),
      includeCSV: z.boolean(),
      includeXLSX: z.boolean(),
      sendEmail: z.boolean(),
      sendCopyToMe: z.boolean().optional(),
      accountantEmail: z.string().optional(),
    })
    .optional()
    .openapi({
      description: "Export settings for transactions",
    }),
  companyType: z
    .enum([
      "freelancer",
      "solo_founder",
      "small_team",
      "startup",
      "agency",
      "ecommerce",
      "creator",
      "non_profit",
      "accountant",
      "exploring",
    ])
    .optional()
    .openapi({
      description: "Type of company or team",
      example: "solo_founder",
    }),
  heardAbout: z
    .enum([
      "twitter",
      "youtube",
      "friend",
      "google",
      "blog",
      "podcast",
      "github",
      "other",
    ])
    .optional()
    .openapi({
      description: "How the user heard about the product",
      example: "twitter",
    }),
  invoiceLegalName: z.string().nullable().optional(),
  invoiceAddressLine1: z.string().nullable().optional(),
  invoiceAddressLine2: z.string().nullable().optional(),
  invoiceCity: z.string().nullable().optional(),
  invoiceState: z.string().nullable().optional(),
  invoicePostalCode: z.string().nullable().optional(),
  invoiceCountry: z.string().nullable().optional(),
  invoiceEmail: z.string().email().nullable().optional(),
  invoicePhone: z.string().nullable().optional(),
  invoiceWebsite: z.string().nullable().optional(),
  invoiceTaxNumber: z.string().nullable().optional(),
  invoiceRegistrationNumber: z.string().nullable().optional(),
});

export const createTeamSchema = z.object({
  name: z.string().openapi({
    description: "Name of the team or organization",
    example: "Acme Corporation",
  }),
  baseCurrency: z.string().openapi({
    description:
      "Base currency for the team in ISO 4217 format (3-letter currency code)",
    example: "USD",
  }),
  countryCode: z.string().optional().openapi({
    description: "Country code for the team",
    example: "US",
  }),
  fiscalYearStartMonth: z
    .number()
    .int()
    .min(1)
    .max(12)
    .nullable()
    .optional()
    .openapi({
      description:
        "Month when the fiscal year starts (1-12). Null for trailing 12 months. Will default based on country if not specified.",
      example: 4,
    }),
  logoUrl: z.string().url().optional().openapi({
    description: "URL to the team's logo image",
    example: "https://cdn.cashpanel.io/logos/acme-corp.png",
  }),
  companyType: z
    .enum([
      "freelancer",
      "solo_founder",
      "small_team",
      "startup",
      "agency",
      "ecommerce",
      "creator",
      "non_profit",
      "accountant",
      "exploring",
    ])
    .openapi({
      description: "Type of company or team",
      example: "solo_founder",
    }),
  heardAbout: z
    .enum([
      "twitter",
      "youtube",
      "friend",
      "google",
      "blog",
      "podcast",
      "github",
      "other",
    ])
    .openapi({
      description: "How the user heard about the product",
      example: "twitter",
    }),
  switchTeam: z.boolean().optional().default(false).openapi({
    description:
      "Whether to automatically switch the user to the newly created team",
    example: true,
  }),
});

export const leaveTeamSchema = z.object({
  teamId: z.string().openapi({
    description: "Unique identifier of the team to leave",
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
});

export const acceptTeamInviteSchema = z.object({
  id: z.string().openapi({
    description: "Unique identifier of the team invitation to accept",
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
});

export const declineTeamInviteSchema = z.object({
  id: z.string().openapi({
    description: "Unique identifier of the team invitation to decline",
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
});

export const deleteTeamSchema = z.object({
  teamId: z.string().openapi({
    description: "Unique identifier of the team to delete",
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
});

export const deleteTeamMemberSchema = z.object({
  teamId: z.string().openapi({
    description: "Unique identifier of the team",
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
  userId: z.string().openapi({
    description: "Unique identifier of the user to remove from the team",
    example: "456e7890-f12a-34b5-c678-901234567890",
  }),
});

export const updateTeamMemberSchema = z.object({
  teamId: z.string().openapi({
    description: "Unique identifier of the team",
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
  userId: z.string().openapi({
    description: "Unique identifier of the user whose role to update",
    example: "456e7890-f12a-34b5-c678-901234567890",
  }),
  role: z.enum(["owner", "member"]).openapi({
    description:
      "New role for the team member. 'owner' has full permissions, 'member' has limited permissions",
    example: "member",
  }),
});

export const inviteTeamMembersSchema = z
  .array(
    z.object({
      email: z.string().openapi({
        description: "Email address of the person to invite",
        example: "john.doe@acme.com",
      }),
      role: z.enum(["owner", "member"]).openapi({
        description:
          "Role to assign to the invited member. 'owner' has full permissions, 'member' has limited permissions",
        example: "member",
      }),
    }),
  )
  .openapi({
    description: "Array of team member invitations to send",
    example: [
      { email: "john.doe@acme.com", role: "member" },
      { email: "jane.smith@acme.com", role: "owner" },
    ],
  });

export const deleteTeamInviteSchema = z.object({
  id: z.string().openapi({
    description: "Unique identifier of the team invitation to delete",
    example: "invite-123abc456def",
  }),
});

export const updateBaseCurrencySchema = z.object({
  baseCurrency: z.string().openapi({
    description:
      "New base currency for the team in ISO 4217 format (3-letter currency code)",
    example: "EUR",
  }),
});

export const teamMemberResponseSchema = z.object({
  id: z.string().uuid().openapi({
    description: "Unique identifier of the user",
    example: "123e4567-e89b-12d3-a456-426614174000",
  }),
  role: z.enum(["owner", "member"]).openapi({
    description:
      "Role of the team member. 'owner' has full permissions, 'member' has limited permissions",
    example: "owner",
  }),
  fullName: z.string().openapi({
    description: "Full name of the team member",
    example: "John Doe",
  }),
  avatarUrl: z.string().url().nullable().openapi({
    description: "URL to the team member's avatar image",
    example: "https://cdn.cashpanel.io/avatars/john-doe.png",
  }),
});

export const teamMembersResponseSchema = z.object({
  data: z.array(teamMemberResponseSchema).openapi({
    description: "Array of team members with their roles and information",
  }),
});
