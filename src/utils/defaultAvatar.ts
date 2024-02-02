import { joinPathParent } from "./functions";

export const defaultSlug = "default/avatar";

export const defaultAvatarGender = () => {
  const maxFileDefault = 15;
  let avatar = "";

  const index = Math.floor(Math.random() * maxFileDefault);
  avatar = `avatar_${index}.jpg`;

  return avatar;
};

interface slugAvatarParams {
  fileName?: string;
  isDefault: number;
  baseURL?: string;
}

export const slugAvatar = ({
  fileName,
  isDefault,
  baseURL,
}: slugAvatarParams) => {
  let fullPath = "";

  if (fileName) {
    fullPath = baseURL;
    if (isDefault === 1) {
      fullPath = joinPathParent(fullPath, defaultSlug, fileName);
    } else {
      fullPath = joinPathParent(fullPath, fileName);
    }
  }

  return fullPath;
};
