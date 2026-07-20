import type { Profile, ProfileImages } from "@/interfaces/profile.interface";
import { twMerge } from "tailwind-merge";

interface ProfileAvatarProps {
  profile: Profile;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-10 h-10 text-sm",
  md: "w-12 h-12 text-lg",
  lg: "w-36 h-36 text-4xl",
};

function getAvatarUrl(images: ProfileImages | []): string | null {
  if (Array.isArray(images)) return null;
  return images?.medium || images?.small || images?.default || null;
}

function ProfileAvatar({ profile, size = "md", className }: ProfileAvatarProps) {
  const url = getAvatarUrl(profile.images);

  return (
    <div
      className={twMerge(
        "rounded-full overflow-hidden bg-(--clr-primary-title)/10 flex items-center justify-center shrink-0",
        sizeMap[size],
        className,
      )}
    >
      {url ? (
        <img
          src={url}
          alt={profile.name_perfil}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-(--clr-primary-title)/70">
          {profile.name_perfil.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { getAvatarUrl };
export default ProfileAvatar;
