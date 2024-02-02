import { randomBytes } from "node:crypto";
import { Unauthorized } from "http-errors";
import * as JWT from "jsonwebtoken";
import { NextFunction, Response } from "express";
import accessServices from "../services/access.services";
import { IRequest } from "../types";
import routerPath from "../configs";

export const HEADERS = {
  clientID: "x-client-id",
  Authorization: "Authorization",
  Bearer: "Bearer",
};

export const createTokenPair = (payload: any) => {
  // const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  //   modulusLength: 4096,
  //   publicKeyEncoding: {
  //     type: "pkcs1",
  //     format: "pem",
  //   },
  //   privateKeyEncoding: {
  //     type: "pkcs1",
  //     format: "pem",
  //   },
  // });
  const publicKey = randomBytes(64).toString("hex");
  const privateKey = randomBytes(64).toString("hex");

  const token = JWT.sign(payload, publicKey, {
    expiresIn: "1 days",
    // algorithm: "RS256",
  });

  const refreshToken = JWT.sign(payload, privateKey, {
    expiresIn: "2 days",
    // algorithm: "RS256",
  });

  return {
    token,
    refreshToken,
    publicKey,
    privateKey,
  };
};

export const JWTverify = (token: string, secretOrPublicKey: string) => {
  return JWT.verify(token, secretOrPublicKey);
};

export const AuthorizationPair = async (
  req: IRequest,
  _res: Response,
  next: NextFunction
) => {
  const authorization = req.header("Authorization");
  const arrAuthorization = authorization ? authorization?.split(" ") : [];

  if (
    arrAuthorization?.length <= 0 ||
    !(arrAuthorization[0] === HEADERS?.Bearer)
  ) {
    return next(Unauthorized());
  }

  const clientId = req.header(HEADERS.clientID);
  if (!clientId) {
    return next(Unauthorized());
  }

  const pathReq = req.path.slice(0, routerPath.refresh.length);
  const isRefresh = pathReq === routerPath.refresh;

  const resultKeys = await accessServices.findOneKey({
    select: ["id", "publicKey", "user", "privateKey"],
    userID: Number(clientId),
    relations: {
      user: true,
    },
  });

  if (!resultKeys) {
    return next(Unauthorized());
  }

  const { publicKey, user, privateKey, ...rest } = resultKeys;

  try {
    const dataVerify: any = JWTverify(
      arrAuthorization[1],
      isRefresh ? privateKey : publicKey
    );
    if (dataVerify?.id === user?.id) {
      req.keyStore = { publicKey, user, privateKey, ...rest };
      isRefresh && (req.refreshToken = arrAuthorization[1]);
      return next();
    }
  } catch {}
  return next(Unauthorized());
};
