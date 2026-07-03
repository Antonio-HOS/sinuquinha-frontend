export const avatarMap: Record<number, string> = {
  1: "/avatars/avatar-1.png",
  2: "/avatars/avatar-2.png",
  3: "/avatars/avatar-3.png",
  4: "/avatars/avatar-4.png",
  5: "/avatars/avatar-5.png",
  6: "/avatars/avatar-6.png",
  7: "/avatars/avatar-7.png",
  8: "/avatars/avatar-8.png",
  9: "/avatars/avatar-9.png",
  10: "/avatars/avatar-10.png",
  11: "/avatars/avatar-11.png",
  12: "/avatars/avatar-12.png",
  13: "/avatars/avatar-13.png",
  14: "/avatars/avatar-14.png",
  15: "/avatars/avatar-15.png",
  16: "/avatars/avatar-16.png",
};

export const defaultAvatarPath = "/rucoin.svg";

export const availableAvatarIds = Object.keys(avatarMap).map(Number);

export function getAvatarUrl(avatarId: number | null | undefined): string {
  if (avatarId && avatarMap[avatarId]) {
    return avatarMap[avatarId];
  }

  return defaultAvatarPath;
}