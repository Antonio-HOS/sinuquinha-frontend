import { Avatar } from "./Avatar";
import { cn } from "../lib/utils";
import { availableAvatarIds } from "../lib/avatarMapping";

type AvatarSelectorProps = {
  value: number | null | undefined;
  onChange: (avatarId: number) => void;
  className?: string;
};

export function AvatarSelector({ value, onChange, className = "" }: AvatarSelectorProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-4 place-items-center sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4", className)}>
      {availableAvatarIds.map((id) => {
        const selected = value === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn("avatar-selector-item", selected && "avatar-selector-item--selected")}
            aria-pressed={selected}
            aria-label={`Selecionar avatar ${id}`}
          >
            <Avatar avatarId={id} size="md" className="sm:size-lg avatar-selector-image" />
          </button>
        );
      })}
    </div>
  );
}
