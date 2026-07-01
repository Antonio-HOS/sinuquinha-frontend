"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { gajrajOne } from "@/src/fonts";
import { api, setAccessToken } from "@/src/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const cadastroSchema = z
  .object({
    nome: z.string().trim().min(2, "Nome é obrigatório"),
    apelido: z.string().trim().min(2, "Apelido é obrigatório"),
    email: z.string().trim().email("E-mail inválido"),
    matricula: z
      .string()
      .trim()
      .min(1, "Matrícula é obrigatória")
      .regex(/^\d{9}$/, "A matrícula deve conter exatamente 9 dígitos numéricos"),
    senha: z
      .string()
      .min(1, "Senha é obrigatória")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
      .regex(/\d/, "A senha deve conter pelo menos um número")
      .regex(
        /[^A-Za-z0-9]/,
        "A senha deve conter pelo menos um caractere especial",
      ),
    confirmarSenha: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas devem ser iguais",
    path: ["confirmarSenha"],
  });

type CadastroFormData = z.infer<typeof cadastroSchema>;

export default function Cadastrar() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: "",
      apelido: "",
      email: "",
      matricula: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit = async (data: CadastroFormData) => {
    try {
      setIsSubmitting(true);
      setFormError("");
      const response = await api.register({
        name: data.nome,
        nickname: data.apelido,
        registrationNumber: data.matricula,
        email: data.email,
        password: data.senha,
      });
      setAccessToken(response.accessToken);
      router.push("/home");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Não foi possível cadastrar.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col px-6 pb-8 pt-10 sm:px-10 sm:pt-14">
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1
          className={`${gajrajOne.className} mb-8 text-center text-[clamp(2rem,8vw,2.3rem)] text-[#FFD700]`}
        >
          Sinuquinha
        </h1>
        <form
          method="post"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex w-full max-w-[280px] flex-col items-center gap-3"
        >
          <div className="flex w-full flex-col gap-1">
            <input
              type="text"
              placeholder="Nome"
              aria-required="true"
              aria-invalid={Boolean(errors.nome)}
              {...register("nome")}
              className="
              h-12
              w-full
              rounded-lg
              border
              border-white/30
              bg-white/10
              px-4
              text-white
              placeholder:text-white/60
              outline-none
            "
            />
            {errors.nome && (
              <p className="w-full text-left text-sm text-red-300">
                {errors.nome.message}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col gap-1">
            <input
              type="text"
              placeholder="Apelido"
              aria-required="true"
              aria-invalid={Boolean(errors.apelido)}
              {...register("apelido")}
              className="
              h-12
              w-full
              rounded-lg
              border
              border-white/30
              bg-white/10
              px-4
              text-white
              placeholder:text-white/60
              outline-none
            "
            />
            {errors.apelido && (
              <p className="w-full text-left text-sm text-red-300">
                {errors.apelido.message}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col gap-1">
            <input
              type="email"
              placeholder="E-mail"
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
              className="
              h-12
              w-full
              rounded-lg
              border
              border-white/30
              bg-white/10
              px-4
              text-white
              placeholder:text-white/60
              outline-none
            "
            />
            {errors.email && (
              <p className="w-full text-left text-sm text-red-300">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col gap-1">
            <input
              type="text"
              placeholder="Matrícula"
              inputMode="numeric"
              maxLength={9}
              aria-required="true"
              aria-invalid={Boolean(errors.matricula)}
              {...register("matricula")}
              className="
              h-12
              w-full
              rounded-lg
              border
              border-white/30
              bg-white/10
              px-4
              text-white
              placeholder:text-white/60
              outline-none
              [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
            "
            />
            {errors.matricula && (
              <p className="w-full text-left text-sm text-red-300">
                {errors.matricula.message}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col gap-1">
            <input
              type="password"
              placeholder="Senha"
              aria-required="true"
              aria-invalid={Boolean(errors.senha)}
              {...register("senha")}
              className="
              h-12
              w-full
              rounded-lg
              border
              border-white/30
              bg-white/10
              px-4
              text-white
              placeholder:text-white/60
              outline-none
            "
            />
            {errors.senha && (
              <p className="w-full text-left text-sm text-red-300">
                {errors.senha.message}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col gap-1">
            <input
              type="password"
              placeholder="Repetir Senha"
              aria-required="true"
              aria-invalid={Boolean(errors.confirmarSenha)}
              {...register("confirmarSenha")}
              className="
              h-12
              w-full
              rounded-lg
              border
              border-white/30
              bg-white/10
              px-4
              text-white
              placeholder:text-white/60
              outline-none
            "
            />
            {errors.confirmarSenha && (
              <p className="w-full text-left text-sm text-red-300">
                {errors.confirmarSenha.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-12 w-full max-w-[220px] cursor-pointer rounded-lg border border-[#FFD700] text-xl text-[#FFD700] transition-all duration-300 hover:bg-[#FFD700] hover:text-black"
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>
          {formError ? (
            <p className="w-full text-center text-sm text-red-300">
              {formError}
            </p>
          ) : null}
        </form>
      </div>

      <h2 className="mt-6 pb-2 text-center text-white">
        <Link href="/login" className="text-[#FFD700]">
          <span className="underline">login </span>
        </Link>
      </h2>
    </div>
  );
}
