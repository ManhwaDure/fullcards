import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import * as jose from "jose";
import { join } from "path";

type KeyFile = {
  publicKey: jose.JWK;
  privateKey: jose.JWK;
};

/**
 * Jwt service
 */
export default class JwtService {
  private _jwksPath;
  private _keys: jose.GenerateKeyPairResult;
  private _initialized: boolean;

  constructor() {
    this._jwksPath = join(process.cwd(), "configs/jwks.json");
    this._initialized = false;
    this.initialize();
  }

  /**
   * Initialize instance
   */
  async initialize() {
    // Create jwk if not exists
    if (existsSync(this._jwksPath)) await this.loadJwks();
    // Load jwk if exists
    else await this.generateJwks();

    this._initialized = true;
  }

  /**
   * Returns whether this instance is initailized
   */
  initialized() {
    return this._initialized;
  }

  /**
   * Loads jwks file
   * Throws error if not exists
   */
  private async loadJwks() {
    const result: KeyFile = JSON.parse(
      await readFile(this._jwksPath, { encoding: "utf8" })
    );
    this._keys = {
      privateKey: (await jose.importJWK(
        result.privateKey,
        "PS256"
      )) as jose.KeyLike,
      publicKey: (await jose.importJWK(
        result.publicKey,
        "PS256"
      )) as jose.KeyLike
    };
  }

  /**
   * Generate jwks file
   */
  private async generateJwks() {
    this._keys = await jose.generateKeyPair("PS256", { extractable: true });

    await writeFile(
      this._jwksPath,
      JSON.stringify({
        publicKey: await jose.exportJWK(this._keys.publicKey),
        privateKey: await jose.exportJWK(this._keys.privateKey)
      }),
      {
        encoding: "utf8"
      }
    );
  }

  /**
   * Creates signed jwt
   * @param payload payload to sign
   * @param expirationTime jwt expiration time
   */
  async signJwt(
    payload: jose.JWTPayload,
    expirationTime: string | number = "2h"
  ) {
    if (!this._initialized) throw new Error("Not initialized yet");
    return await new jose.SignJWT(payload)
      .setProtectedHeader({
        alg: "PS256"
      })
      .setExpirationTime(expirationTime)
      .sign(this._keys.privateKey);
  }

  /**
   * Verifies jwt and returns its payload
   * Throws error if verification fails
   *
   * @param jwt Jwt to verify
   */
  async verifyJwt(jwt: string): Promise<jose.JWTPayload> {
    if (!this._initialized) throw new Error("Not initialized yet");
    try {
      const { payload } = await jose.jwtVerify(jwt, this._keys.publicKey);
      return payload;
    } catch (err) {
      return null;
    }
  }
}
