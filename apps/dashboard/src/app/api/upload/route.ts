import { createClient as createServerClient } from "@cashpanel/supabase/server";
import type { Database } from "@cashpanel/supabase/types";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const serverUploadBuckets = new Set(["avatars", "apps"]);

function isValidPathSegment(segment: unknown): segment is string {
  return (
    typeof segment === "string" &&
    segment.length > 0 &&
    !segment.includes("/") &&
    !segment.includes("\\") &&
    segment !== "." &&
    segment !== ".."
  );
}

function parsePath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    const path = JSON.parse(value);

    if (!Array.isArray(path) || !path.every(isValidPathSegment)) {
      return null;
    }

    return path;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const bucket = formData.get("bucket");
  const path = parsePath(formData.get("path"));

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (typeof bucket !== "string" || !serverUploadBuckets.has(bucket)) {
    return NextResponse.json({ error: "Unsupported bucket" }, { status: 400 });
  }

  if (!path) {
    return NextResponse.json({ error: "Invalid upload path" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("Upload failed: missing Supabase service configuration");
    return NextResponse.json(
      { error: "Upload service is not configured" },
      { status: 500 },
    );
  }

  const adminSupabase = createSupabaseClient<Database>(
    supabaseUrl,
    serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
  const objectPath = path.join("/");
  const storage = adminSupabase.storage.from(bucket);
  const result = await storage.upload(objectPath, file, {
    upsert: true,
    cacheControl: "3600",
    contentType: file.type,
  });

  if (result.error) {
    console.error("Upload failed", {
      bucket,
      objectPath,
      message: result.error.message,
    });

    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json({
    path,
    url: storage.getPublicUrl(objectPath).data.publicUrl,
  });
}
