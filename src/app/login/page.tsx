"use client";

import { gajrajOne } from "@/src/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");

  const handleMatriculaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatricula(e.target.value);
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value);
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!matricula.trim() || !senha.trim()) return;
    router.push("/home");
  };

  return (
      <div className="flex flex-col h-full items-center">
        <h1
          className={`${gajrajOne.className} text-[36px] mt-36 mb-8 text-[#FFD700]`}
        >
          Sinuquinha
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-2 mb-4"
        >
          <input
            type="number"
            placeholder="Matrícula"
            value={matricula}
            onChange={handleMatriculaChange}
            required
            aria-required="true"
            className="
            w-[220px]
            h-[48px]
            px-4
            rounded-lg
            border
            border-white/30
            bg-white/10
            text-white
            placeholder:text-white/60
            outline-none
            [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
          "
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={handleSenhaChange}
            required
            aria-required="true"
            className="
            w-[220px]
            h-[48px]
            px-4
            rounded-lg
            border
            border-white/30
            bg-white/10
            text-white
            placeholder:text-white/60
            outline-none
          "
          />
          <button
            type="submit"
            className="w-[174px] h-[48px] border border-[#FFD700] rounded-lg text-[#FFD700] text-xl cursor-pointer hover:bg-[#FFD700] hover:text-black transition-all duration-300"
          >
            Jogar
          </button>
        </form>
      <h2 className="text-white text-center absolute md:bottom-[50px] bottom-[-18px]">
        <Link href="/cadastrar" className="text-[#FFD700]">
          <span className="underline">Criar conta </span>
        </Link>
      </h2>
      </div>
  );
}
