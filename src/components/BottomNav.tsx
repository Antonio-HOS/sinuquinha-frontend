import Link from "next/link";

type BottomNavProps = {
  active?: "home" | "trophy" | "profile";
};

const iconClass = (active: boolean) =>
  active ? "text-[#FFD700]" : "text-[#FFD700]/50";

export default function BottomNav({ active = "home" }: BottomNavProps) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-10 flex md:w-[320px] w-full mx-auto justify-around border  bg-[#004C55]/95 py-3 backdrop-blur-sm box-border border-[#FFEDAD] rounded-b-[20px]">
      <Link
        href="/home"
        className={iconClass(active === "home")}
        aria-label="Início"
        aria-current={active === "home" ? "page" : undefined}
      >
        <HomeIcon />
      </Link>
      <button
        type="button"
        className={iconClass(active === "trophy")}
        aria-label="Troféus"
      >
        <TrophyIcon />
      </button>
      <button
        type="button"
        className={iconClass(active === "profile")}
        aria-label="Perfil"
      >
        <ProfileIcon />
      </button>
    </nav>
  );
}

function HomeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM5 4H3v2a4 4 0 0 0 4 4M19 4h2v2a4 4 0 0 1-4 4" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
