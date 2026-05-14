import { Client } from "pg";

type BucketConfig = {
  id: string;
  public: boolean;
  allowedMimeTypes?: string[];
  fileSizeLimit?: number;
};

const imageMimeTypes = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

const buckets: BucketConfig[] = [
  {
    id: "avatars",
    public: true,
    allowedMimeTypes: imageMimeTypes,
    fileSizeLimit: 10 * 1024 * 1024,
  },
  {
    id: "apps",
    public: true,
    allowedMimeTypes: imageMimeTypes,
    fileSizeLimit: 10 * 1024 * 1024,
  },
  {
    id: "vault",
    public: false,
  },
];

const storagePoliciesSql = `
alter table storage.objects enable row level security;

drop policy if exists "CashPanel public read avatars" on storage.objects;
create policy "CashPanel public read avatars"
on storage.objects
for select
to public
using (bucket_id = 'avatars');

drop policy if exists "CashPanel authenticated write own avatars" on storage.objects;
create policy "CashPanel authenticated write own avatars"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "CashPanel authenticated update own avatars" on storage.objects;
create policy "CashPanel authenticated update own avatars"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "CashPanel authenticated delete own avatars" on storage.objects;
create policy "CashPanel authenticated delete own avatars"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "CashPanel public read app logos" on storage.objects;
create policy "CashPanel public read app logos"
on storage.objects
for select
to public
using (bucket_id = 'apps');

drop policy if exists "CashPanel authenticated write app logos" on storage.objects;
create policy "CashPanel authenticated write app logos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'apps');

drop policy if exists "CashPanel authenticated update app logos" on storage.objects;
create policy "CashPanel authenticated update app logos"
on storage.objects
for update
to authenticated
using (bucket_id = 'apps')
with check (bucket_id = 'apps');

drop policy if exists "CashPanel authenticated delete app logos" on storage.objects;
create policy "CashPanel authenticated delete app logos"
on storage.objects
for delete
to authenticated
using (bucket_id = 'apps');

drop policy if exists "CashPanel team read vault files" on storage.objects;
create policy "CashPanel team read vault files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'vault'
  and (storage.foldername(name))[1] in (
    select private.get_teams_for_authenticated_user()::text
  )
);

drop policy if exists "CashPanel team write vault files" on storage.objects;
create policy "CashPanel team write vault files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'vault'
  and (storage.foldername(name))[1] in (
    select private.get_teams_for_authenticated_user()::text
  )
);

drop policy if exists "CashPanel team update vault files" on storage.objects;
create policy "CashPanel team update vault files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'vault'
  and (storage.foldername(name))[1] in (
    select private.get_teams_for_authenticated_user()::text
  )
)
with check (
  bucket_id = 'vault'
  and (storage.foldername(name))[1] in (
    select private.get_teams_for_authenticated_user()::text
  )
);

drop policy if exists "CashPanel team delete vault files" on storage.objects;
create policy "CashPanel team delete vault files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'vault'
  and (storage.foldername(name))[1] in (
    select private.get_teams_for_authenticated_user()::text
  )
);
`;

async function upsertBucket(
  supabaseUrl: string,
  serviceKey: string,
  bucket: BucketConfig,
) {
  const headers = {
    apikey: serviceKey,
    authorization: `Bearer ${serviceKey}`,
    "content-type": "application/json",
  };

  const body = JSON.stringify({
    id: bucket.id,
    name: bucket.id,
    public: bucket.public,
    file_size_limit: bucket.fileSizeLimit,
    allowed_mime_types: bucket.allowedMimeTypes,
  });

  const createResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body,
  });

  if (createResponse.ok) {
    console.log(`Created Supabase Storage bucket: ${bucket.id}`);
    return;
  }

  const createText = await createResponse.text();

  if (
    createResponse.status !== 400 ||
    !createText.toLowerCase().includes("already")
  ) {
    throw new Error(
      `Failed to create bucket ${bucket.id}: ${createResponse.status} ${createText}`,
    );
  }

  const updateResponse = await fetch(
    `${supabaseUrl}/storage/v1/bucket/${bucket.id}`,
    {
      method: "PUT",
      headers,
      body,
    },
  );

  if (!updateResponse.ok) {
    throw new Error(
      `Failed to update bucket ${bucket.id}: ${updateResponse.status} ${await updateResponse.text()}`,
    );
  }

  console.log(`Updated Supabase Storage bucket: ${bucket.id}`);
}

async function applyStoragePolicies(databaseUrl: string) {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query(storagePoliciesSql);
  } catch (error) {
    const code = error instanceof Error && "code" in error ? error.code : null;

    if (code === "42501") {
      console.log(
        "Skipped Supabase Storage policies: database user is not the owner of storage.objects",
      );
      return;
    }

    throw error;
  } finally {
    await client.end();
  }

  console.log("Applied Supabase Storage policies");
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl =
  process.env.DATABASE_SESSION_POOLER ??
  process.env.DATABASE_PRIMARY_URL ??
  process.env.DATABASE_URL;

async function main() {
  if (supabaseUrl && serviceKey) {
    for (const bucket of buckets) {
      await upsertBucket(supabaseUrl, serviceKey, bucket);
    }
  } else {
    console.log(
      "Skipped Supabase Storage bucket setup: missing Supabase URL or service key",
    );
  }

  if (databaseUrl) {
    await applyStoragePolicies(databaseUrl);
  } else {
    console.log("Skipped Supabase Storage policies: missing database URL");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
