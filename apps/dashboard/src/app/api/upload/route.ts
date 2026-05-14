import { createClient } from "@cashpanel/supabase/server";
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
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
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

  const adminSupabase = await createClient({ admin: true });
  const objectPath = path.join("/");
  const storage = adminSupabase.storage.from(bucket);
  const result = await storage.upload(objectPath, file, {
    upsert: true,
    cacheControl: "3600",
    contentType: file.type,
  });

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json({
    path,
    url: storage.getPublicUrl(objectPath).data.publicUrl,
  });
}
