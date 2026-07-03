import { AvatarSelector } from "@/src/components/AvatarSelector";
import Button from "@/src/components/Button";
import { gajrajOne } from "@/src/fonts";
import { Edit2 } from "lucide-react";

type AvatarEditModalProps = {
  selectedAvatarId: number | null;
  isSaving: boolean;
  error: string | null;
  onChange: (avatarId: number) => void;
  onSave: () => void;
  onClose: () => void;
};

export default function AvatarEditModal({
  selectedAvatarId,
  isSaving,
  error,
  onChange,
  onSave,
  onClose,
}: AvatarEditModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/60 px-4 py-6"
      onClick={onClose}
      aria-label="Fechar modal de avatar"
    >
      <section
        className="w-full max-w-[280px] cursor-default rounded-2xl border border-[#FFD700]/30 bg-black/20 p-4 backdrop-blur-sm"
        aria-label="Escolher avatar"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className={`${gajrajOne.className} text-lg text-[#FFD700]`}>
            Escolha seu avatar
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-white/70 transition hover:text-white"
          >
            Cancelar
          </button>
        </div>

        <AvatarSelector
          value={selectedAvatarId}
          onChange={onChange}
          className="gap-2 sm:grid-cols-3"
        />

        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            Voltar
          </button>
          <Button
            onClick={onSave}
            disabled={isSaving || selectedAvatarId === null}
            variant="secondary"
            size="sm"
            className="gap-1.5"
          >
            <Edit2 size={14} />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </section>
    </div>
  );
}
