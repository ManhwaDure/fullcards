import * as express from "express";
import ApiExposableError from "./ApiExposableError";
import JwtService from "./services/JwtService";

// Jwt serivce instance
const service = new JwtService();

/**
 * Jwt authentication handler
 */
export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  _scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    // Get token header
    const tokenHeader = request.headers["authorization"];

    // Throw if token is not provided
    if (!tokenHeader || tokenHeader.length < "Bearer ".length)
      throw new ApiExposableError(401, "Token not proivded");

    // Substring token
    const token = tokenHeader.substring("Bearer ".length);

    // Initialize jwt service if not
    if (!service.initialized()) await service.initialize();

    // Verify jwt and return id and expiresAt
    const result = await service.verifyJwt(token);
    return {
      id: result.sub,
      expiresAt: result.exp * 1000
    };
  }
}
