import { ArrowLeft, LogOut } from "lucide-react";
import { gajrajOne } from "@/src/fonts";

type ConfigDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ConfigDrawer({ isOpen, onClose }: ConfigDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-[65%] max-w-[300px] bg-[#1a1a1a] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out flex flex-col p-6 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button 
          onClick={onClose} 
          className="text-white mb-10 w-fit hover:text-white/70 transition-colors"
          aria-label="Fechar configurações"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Opções do Menu */}
        <div className="flex flex-col gap-6">
          <button 
            className={`${gajrajOne.className} text-white text-lg text-left hover:text-[#FFD700] transition-colors`}
          >
            Mudar Apelido
          </button>

          <button 
            className={`${gajrajOne.className} text-[#FF0000] text-lg flex items-center gap-2 hover:text-red-400 transition-colors w-fit`}
          >
            <LogOut className="w-5 h-5 rotate-180" />
            Sair
          </button>
        </div>
      </div>
    </>
  );
}