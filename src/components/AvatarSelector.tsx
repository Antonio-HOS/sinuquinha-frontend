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
    <div className={cn("avatar-selector-grid", className)}>
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
            <Avatar avatarId={id} size="lg" className="avatar-selector-image" />
          </button>
        );
      })}
    </div>
  );
}
