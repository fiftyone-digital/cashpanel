import Image from "next/image";

const getAuthor = (id: string) =>
  ({
    mathieu: {
      name: "Mathieu",
      src: "https://pbs.twimg.com/profile_images/2016494530455896064/ucjNjj5X_400x400.jpg",
      tagline: "Engineering",
    },
  })[id];

type Props = {
  author: string;
};

export function PostAuthor({ author }: Props) {
  const authorData = getAuthor(author);

  if (!authorData) return null;

  return (
    <div className="flex items-center pt-4 border-t-[1px] border-border w-full">
      <div className="flex items-center space-x-2">
        <Image
          src={authorData.src}
          width={24}
          height={24}
          alt={authorData.name}
          className="rounded-full overflow-hidden"
          unoptimized
        />
        <span className="font-medium text-xs">{authorData.name}</span>
        <span className="text-xs text-[#878787]">{authorData.tagline}</span>
      </div>
    </div>
  );
}
