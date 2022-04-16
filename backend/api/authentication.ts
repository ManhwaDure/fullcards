import * as express from "express";
import ApiExposableError from "./ApiExposableError";
import JwtService from "./services/JwtService";

const service = new JwtService();

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  _scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    const tokenHeader = request.headers["authorization"];

    if (!tokenHeader || tokenHeader.length < "Bearer ".length)
      throw new ApiExposableError(401, "Token not proivded");

    const token = tokenHeader.substring("Bearer ".length);

    if (!service.initialized()) await service.initialize();

    const result = await service.verifyJwt(token);
    return {
      id: result.sub,
      expiresAt: result.exp * 1000
    };
  }
}
