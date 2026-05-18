"use client";

import Button from "@/src/components/Button";
import { gajrajOne } from "@/src/fonts";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [matricula, setMatricula] = useState("");	
  const [senha, setSenha] = useState("");

  const handleMatriculaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMatricula(e.target.value);
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value);
  };


  const printConsole = () =>{
    console.log(matricula, senha);
  };


  return (
      <div className="flex flex-col h-full items-center">
        <h1
          className={`${gajrajOne.className} text-[36px] mt-36 mb-8 text-[#FFD700]`}
        >
          Sinuquinha
        </h1>
        <form className="flex flex-col gap-2 mb-4">
          <input
            type="number"
            placeholder="Matrícula"
            value={matricula}
            onChange={handleMatriculaChange}
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
        </form>
        <button
          className="w-[174px] h-[48px] border border-[#FFD700] rounded-lg text-[#FFD700] text-xl cursor-pointer hover:bg-[#FFD700] hover:text-black transition-all duration-300"
          onClick={() => printConsole()}
        >
          Jogar
        </button>
      <h2 className="text-white text-center absolute bottom-[50px]">
        <Link href="/cadastrar" className="text-[#FFD700]">
          <span className="underline">Criar conta </span>
        </Link>
      </h2>
      </div>
  );
}
