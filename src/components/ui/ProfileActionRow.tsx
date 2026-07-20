import { useState, useRef, useEffect } from "react";

type ProfileActionVariant = "navigation" | "editable" | "action";

interface ProfileActionRowProps {
  icon: React.ReactNode;
  label: string;
  variant?: ProfileActionVariant;
  value?: string;
  onValueChange?: (value: string) => void;
  onClick?: () => void;
  onSave?: () => void;
}

function ProfileActionRow({
  icon,
  label,
  variant = "action",
  value,
  onValueChange,
  onClick,
  onSave,
}: ProfileActionRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    if (variant === "editable") {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onSave?.();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={variant === "editable" ? handleEditClick : onClick}
      className="self-stretch p-6 bg-(--clr-secondary-button)/25 rounded-2xl outline-2 -outline-offset-2 outline-(--epg-accent) inline-flex justify-between items-center overflow-hidden cursor-pointer hover:bg-(--clr-secondary-button) hover:outline-(--clr-primary-title) transition-all duration-200 "
    >
      {/* Left: Icon + Label */}
      <div className="flex justify-start items-center gap-4">
        <span className="size-8 shrink-0 flex items-center justify-center text-(--clr-icon) [&>svg]:w-6 [&>svg]:h-6">
          {icon}
        </span>
        <span className="text-(--clr-primary-title) font-bold text-3xl leading-10">{label}</span>
      </div>

      {/* Right content */}
      {variant === "navigation" && (
        <div className="size-8 flex items-center justify-center">
          <svg width="14" height="24" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1L8.5 8L1.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {variant === "editable" && (
        isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={value ?? ""}
            onChange={(e) => onValueChange?.(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="bg-transparent text-(--clr-primary-title) text-right text-3xl font-bold leading-10 outline-none border-b border-(--foc-primary) max-w-[200px]"
          />
        ) : (
          <span className="text-(--clr-primary-title) text-3xl font-bold leading-10">{value}</span>
        )
      )}
    </button>
  );
}

export default ProfileActionRow;
