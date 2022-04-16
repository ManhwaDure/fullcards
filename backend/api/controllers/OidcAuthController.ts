import { Body, Controller, Get, Post, Route } from "tsoa";
import ApiExposableError from "../ApiExposableError";
import JwtService from "../services/JwtService";
import { OidcService } from "../services/OidcService";

@Route("auth/oidc")
export class OidcAuthController extends Controller {
  static _oidcService: OidcService;
  static _jwtService: JwtService;

  constructor() {
    super();
  }

  static async initializeStaticMembers() {
    OidcAuthController._oidcService = new OidcService();
    OidcAuthController._jwtService = new JwtService();
    await OidcAuthController._oidcService.initialize();
    await OidcAuthController._jwtService.initialize();
  }

  /**
   * Gets OpenID Connect 1.0 authorization url
   */
  @Get("oidc_get_authorization_url")
  async getOidcAuthorizationUrl(): Promise<string> {
    return await OidcAuthController._oidcService.getOidcAuthorizationUrl();
  }

  /**
   * Finishes OpenID Connect 1.0 Authorization and gets jwt
   * @param callbackUrl OpenID Connect 1.0 callback url
   */
  @Post("oidc_finish_authorization")
  async finishOidcAuthorization(
    @Body() { callbackUrl }: { callbackUrl: string }
  ): Promise<{ success: boolean; jwt: string }> {
    const token = await OidcAuthController._oidcService.finishOidcAuthorization(
      callbackUrl
    );
    if (
      !(await OidcAuthController._oidcService.doAdditionalCheckIfExists(token))
    ) {
      return {
        success: false,
        jwt: null
      };
    }
    const jwt = await OidcAuthController._jwtService.signJwt({
      sub: token.claims().sub
    });

    if (jwt === null)
      throw new ApiExposableError(403, "Not authorized properly");
    return { success: true, jwt };
  }
}
