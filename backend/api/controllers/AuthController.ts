import { Controller, Get, Request, Route, Security } from "tsoa";

type AuthMethod = "openid_connect_1.0";

@Route("auth")
export class AuthController extends Controller {
  /**
   * Get used authentication method
   */
  @Get("supported_auth_methods")
  async getAuthMethod(): Promise<AuthMethod> {
    // TO-DO : Support another authentication method

    return "openid_connect_1.0";
  }

  /**
   * Get me
   */
  @Get("me")
  @Security("jwt")
  async me(@Request() req: any): Promise<{ id: string; expiresAt: number }> {
    const { id, expiresAt } = req.user;
    return {
      id,
      expiresAt
    };
  }
}
