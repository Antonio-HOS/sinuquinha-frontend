import Button from "@/src/components/Button";
import { gajrajOne } from "@/src/fonts";

export default function Login() {
  return (
    <div className="bg-[#004C55] bg-[url('/sinuca.svg')] bg-contain bg-center bg-no-repeat h-screen w-full">
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
          <input
            type="password"
            placeholder="Senha"
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
        <Button
          name="Jogar"
          size="w-[174px] h-[48px]"
          edge="border border-[#FFD700]"
          background=""
          textColor="text-[#FFD700]"
          rounding="rounded-lg"
          font={`${gajrajOne.className} text-xl`}
        />
      </div>
    </div>
  );
}
