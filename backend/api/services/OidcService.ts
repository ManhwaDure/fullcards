import { readFile } from "fs/promises";
import { Client, Issuer, TokenSet } from "openid-client";
import { join } from "path";
import { Route } from "tsoa";
import ApiExposableError from "../ApiExposableError";

type OidcConfig = {
  issuerUrl: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  scopes?: string[];
  additionalCheckFunction?: string;
};

@Route("auth/oidc")
export class OidcService {
  private _oidcClient: Client;
  private _oidcConfig: OidcConfig;
  private _initialized: boolean = false;

  async initialize() {
    const oidcConfigJson = await readFile(
      join(process.cwd(), "configs/oidcConfig.json"),
      {
        encoding: "utf8"
      }
    );
    this._oidcConfig = JSON.parse(oidcConfigJson);
    const {
      client_id,
      client_secret,
      redirect_uri,
      issuerUrl
    } = this._oidcConfig;
    const issuer = await Issuer.discover(issuerUrl);
    this._oidcClient = new issuer.Client({
      client_id,
      client_secret,
      redirect_uris: [redirect_uri],
      response_types: ["code"]
    });
    this._initialized = true;
  }

  /**
   * Get OpenID Connect 1.0 authorization url
   */
  async getOidcAuthorizationUrl(): Promise<string> {
    if (!this._initialized) throw new Error("Oidc service not initialized!");
    let scope = "openid profile";
    if (this._oidcConfig.scopes?.length > 0)
      scope += " " + this._oidcConfig.scopes.join(" ");
    return this._oidcClient.authorizationUrl({
      scope
    });
  }

  /**
   * Finished OpenID Connect 1.0 Authorization with Url
   */
  async finishOidcAuthorization(callbackUrl: string): Promise<TokenSet> {
    if (!this._initialized) throw new Error("Oidc service not initialized!");
    const params = this._oidcClient.callbackParams(callbackUrl);
    const token = await this._oidcClient.callback(
      this._oidcConfig.redirect_uri,
      params
    );

    if (token === null)
      throw new ApiExposableError(400, "Not a valid callback");

    return token;
  }

  /**
   * Do additional check function if provided in config
   * @param token jwt token
   */
  async doAdditionalCheckIfExists(token: TokenSet): Promise<boolean> {
    const userinfo = await this._oidcClient.userinfo(token.access_token);
    if (this._oidcConfig.additionalCheckFunction) {
      const func = new Function(
        "userinfo",
        this._oidcConfig.additionalCheckFunction
      ) as (idToken: any) => boolean;
      return func(userinfo);
    } else {
      return true;
    }
  }
}
