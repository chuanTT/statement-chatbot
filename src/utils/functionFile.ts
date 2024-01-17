import * as fs from "fs";

export const unlinkFile = async (pathFile: string) => {
  let isChecking = false;

  if (fs.existsSync(pathFile)) {
    fs.unlinkSync(pathFile);
    isChecking = true;
  } else {
    isChecking = false;
  }

  return isChecking;
};

export const checkPathCreateFolder = (path: string) => {
  let error = false;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
    error = true;
  }

  return error;
};

export const copyFileCustom = (path: string, pathCopy: string) => {
  let err = false;
  try {
    fs.copyFileSync(path, pathCopy);
    unlinkFile(path);
  } catch (erros) {
    err = false;
  }

  return err;
};
