"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { api, setAccessToken } from "@/src/lib/api";
import { gajrajOne } from "@/src/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setFormError("");
      const response = await api.login({
        email: data.email,
        password: data.senha,
      });
      setAccessToken(response.accessToken);
      router.push("/home");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Não foi possível entrar.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col px-6 pb-8 pt-12 sm:px-10 sm:pt-16">
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
              [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-12 w-full max-w-[220px] cursor-pointer rounded-lg border border-[#FFD700] text-xl text-[#FFD700] transition-all duration-300 hover:bg-[#FFD700] hover:text-black"
          >
            {isSubmitting ? "Entrando..." : "Jogar"}
          </button>
          {formError ? (
            <p className="w-full text-center text-sm text-red-300">
              {formError}
            </p>
          ) : null}
        </form>
      </div>
      <h2 className="mt-6 pb-2 text-center text-white">
        <Link href="/cadastrar" className="text-[#FFD700]">
          <span className="underline">Criar conta </span>
        </Link>
      </h2>
    </div>
  );
}
