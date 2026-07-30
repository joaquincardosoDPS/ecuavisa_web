import { useEditProfile } from "@/hooks/profiles/useEditProfile";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import { BackButton } from "@/components/ui/BackButton";

function SelectAvatarView() {
  const {
    isCreateMode,
    avatarGroups,
    isLoading,
    selectedAvatar,
    setSelectedAvatar,
    handleSubmit,
    name,
    navigate,
    getAvatarUrl,
    isSubmitting,
  } = useEditProfile();

  if (isLoading) return <FullScreenSpinner />;

  const handleSelect = async (avatarId: string) => {
    if (isSubmitting) return;
    setSelectedAvatar(avatarId);
    if (!isCreateMode) {
      await handleSubmit(name, false, avatarId);
    }
    navigate(-1);
  };

  return (
    <div
      className="min-h-screen flex flex-col px-40 py-25 text-(--clr-primary-title)"
      style={{ background: 'linear-gradient(to right, #17142C, #2D2533, #3D2E3D)' }}
    >
      <BackButton />

      <div className="flex flex-col mb-12">
        <h1 className="text-4xl font-bold leading-12 mb-12">Elegir avatar</h1>
        <p className="text-3xl font-bold text-(--clr-primary-title) leading-10">Selecciona el avatar que mejor te represente</p>
      </div>

      <div className="grid grid-cols-6 gap-6">
        {avatarGroups?.flatMap((group) => group.avatars).map((avatar) => {
          const avatarUrl = getAvatarUrl(avatar);
          const isSelected = selectedAvatar === avatar.id;

          if (!avatarUrl) return null;

          return (
            <button
              key={avatar.id}
              onClick={() => handleSelect(avatar.id)}
              disabled={isSubmitting}
              className={`relative focus:outline-none group w-full aspect-square ${isSubmitting ? "cursor-wait opacity-80" : "cursor-pointer"}`}
            >
              <div
                className={`relative w-full h-full aspect-square rounded-2xl overflow-hidden bg-(--clr-primary-title)/5 flex items-center justify-center border-4 transition-all duration-300 ${isSelected
                  ? "border-(--epg-accent) scale-105 shadow-[0_0_20px_rgba(16,212,255,0.4)]"
                  : "border-transparent group-hover:border-(--epg-accent)/50"
                  }`}
              >
                <img
                  src={avatarUrl}
                  alt={`Avatar ${avatar.id}`}
                  className="w-full h-full object-cover"
                />
                {isSelected && isSubmitting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] z-20">
                    <div className="w-8 h-8 border-3 border-t-(--epg-accent) border-white/20 rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {isSelected && (
                <div className="absolute -top-3 -right-3 z-10 transition-all duration-300 scale-105">
                  <div className="w-12 h-12 bg-(--epg-accent) rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.5)] border-2 border-(--clr-primary-title)">
                    <svg className="w-8 h-8 text-(--clr-primary-title)" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SelectAvatarView;
