import { Spinner } from "@/components/ui/Spinner";

interface PlayerLoadingProps {
  chapterImage: string;
}

export function PlayerLoading({ chapterImage }: PlayerLoadingProps) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: chapterImage
          ? `url(${chapterImage}) center/cover no-repeat #000`
          : "#000",
      }}
    >
      <Spinner />
    </div>
  );
}
