"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@cashpanel/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cashpanel/ui/card";
import { Spinner } from "@cashpanel/ui/spinner";
import { useToast } from "@cashpanel/ui/use-toast";
import { stripSpecialCharacters } from "@cashpanel/utils";
import { useRef } from "react";
import { useTeamMutation, useTeamQuery } from "@/hooks/use-team";
import { useUpload } from "@/hooks/use-upload";
import { useUserQuery } from "@/hooks/use-user";

export function CompanyLogo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoading, uploadFile } = useUpload();
  const { data } = useTeamQuery();
  const { data: user } = useUserQuery();
  const { mutateAsync: updateTeam } = useTeamMutation();
  const { toast } = useToast();

  const handleUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];

    if (!file || !data?.id || !user?.id) {
      evt.target.value = "";
      return;
    }

    try {
      const filename = stripSpecialCharacters(file.name);

      const { url } = await uploadFile({
        bucket: "avatars",
        path: [user.id, "teams", data.id, filename],
        file,
      });

      if (url) {
        await updateTeam({ logoUrl: url });
      }
    } catch (_error) {
      toast({
        title: "Logo upload failed",
        description: "Please try again.",
        variant: "error",
      });
    } finally {
      evt.target.value = "";
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center pr-6">
        <CardHeader>
          <CardTitle>Company logo</CardTitle>
          <CardDescription>
            This is your company's logo. Click on the logo to upload a custom
            one from your files.
          </CardDescription>
        </CardHeader>

        <Avatar
          className="rounded-none w-16 h-16 flex items-center justify-center bg-accent cursor-pointer"
          onClick={() => inputRef?.current?.click()}
        >
          {isLoading ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <>
              <AvatarImage
                src={data?.logoUrl ?? undefined}
                alt={data?.name ?? undefined}
                width={64}
                height={64}
              />
              <AvatarFallback>
                <span className="text-md">{data?.name?.charAt(0)}</span>
              </AvatarFallback>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            style={{ display: "none" }}
            multiple={false}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleUpload}
          />
        </Avatar>
      </div>
      <CardFooter>An avatar is optional but strongly recommended.</CardFooter>
    </Card>
  );
}
