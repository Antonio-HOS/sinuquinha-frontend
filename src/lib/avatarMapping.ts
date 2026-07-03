export const avatarMap: Record<number, string> = {
  1: "/avatars/avatar-1.svg",
  2: "/avatars/avatar-2.svg",
  3: "/avatars/avatar-3.svg",
  4: "/avatars/avatar-4.svg",
  5: "/avatars/avatar-5.svg",
  6: "/avatars/avatar-6.svg",
  7: "/avatars/avatar-7.svg",
  8: "/avatars/avatar-8.svg",
  9: "/avatars/avatar-9.svg",
  10: "/avatars/avatar-10.svg",
  11: "/avatars/avatar-11.svg",
  12: "/avatars/avatar-12.svg",
  13: "/avatars/avatar-13.svg",
  14: "/avatars/avatar-14.svg",
  15: "/avatars/avatar-15.svg",
  16: "/avatars/avatar-16.svg",
};

export const defaultAvatarPath = "/rucoin.svg";

export const availableAvatarIds = Object.keys(avatarMap).map(Number);

export function getAvatarUrl(avatarId: number | null | undefined): string {
  if (avatarId && avatarMap[avatarId]) {
    return avatarMap[avatarId];
  }

  return defaultAvatarPath;
}