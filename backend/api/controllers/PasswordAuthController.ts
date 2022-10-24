import { Body, Controller, Post, Route } from "tsoa";
import ApiExposableError from "../ApiExposableError";
import JwtService from "../services/JwtService";

@Route("auth/password")
export class PasswordAuthController extends Controller {  
  static _jwtService: JwtService;

  constructor() {
    super();
  }

  static async initializeStaticMembers() {
    PasswordAuthController._jwtService = new JwtService();
    await PasswordAuthController._jwtService.initialize();
  }

  /**
   * Authorizes with password and gets jwt
   * @param password Password for authorization
   */
  @Post("authorize")
  async authorizeWithPassword(
    @Body() { password }: { password: string }
  ): Promise<{ success: boolean; jwt: string }> {
    if (process.env.FULLCARDS_USE_PASSWORD_AUTH !== "yes")
        throw new ApiExposableError(403, 'Password authentication not enabled');

    if (password !== process.env.FULLCARDS_AUTH_PASSWORD) {
        throw new ApiExposableError(403, 'Password not matched');
    }

    const jwt = await PasswordAuthController._jwtService.signJwt({
      sub: 'debug@example.com'
    });

    if (jwt === null)
      throw new ApiExposableError(403, "Not authorized properly");
    return { success: true, jwt };
  }
}
