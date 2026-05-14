import { createClient } from "@cashpanel/supabase/client";
import { upload } from "@cashpanel/supabase/storage";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useState } from "react";

interface UploadParams {
  file: File;
  path: string[];
  bucket: string;
}

interface UploadResult {
  url: string;
  path: string[];
}

export function useUpload() {
  const supabase: SupabaseClient = createClient();
  const [isLoading, setLoading] = useState<boolean>(false);

  const uploadFile = async ({
    file,
    path,
    bucket,
  }: UploadParams): Promise<UploadResult> => {
    setLoading(true);

    try {
      if (!["avatars", "apps"].includes(bucket)) {
        const url = await upload(supabase, {
          path,
          file,
          bucket,
        });

        return {
          url,
          path,
        };
      }

      const formData = new FormData();
      formData.set("file", file);
      formData.set("bucket", bucket);
      formData.set("path", JSON.stringify(path));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return (await response.json()) as UploadResult;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadFile,
    isLoading,
  };
}
