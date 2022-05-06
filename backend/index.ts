import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import next from "next";
import { Server as SocketIoServer } from "socket.io";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { inspect } from "util";
import httpConfig from "../configs/http.json";
import { RegisterRoutes } from "../tsoa-build/routes";
import ApiExposableError from "./api/ApiExposableError";
import { OidcAuthController } from "./api/controllers/OidcAuthController";
import JwtService from "./api/services/JwtService";
import dataSource from "./database/dataSource";
import { CardRelatedEntitySubscriber } from "./database/subscribers/cardRelatedEntitySubscriber";

const dev = process.env.NODE_ENV !== "production";

const nextApp = next({ dev, dir: process.cwd() });
const handle = nextApp.getRequestHandler();

(async () => {
  await nextApp.prepare();
  const app = express();
  const apiRouter = express.Router();
  RegisterRoutes(apiRouter);

  app.use(
    express.json({
      limit: "5mb"
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
      limit: "5mb"
    })
  );
  app.use(
    "/api",
    apiRouter,
    (err: unknown, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof ValidateError) {
        console.warn(
          `[API] Validation Error for ${req.method} ${req.path}: ${inspect(
            err.fields
          )}`
        );
        return res.status(422).json({
          error: true,
          message: "Validation Failed",
          details: err.fields
        });
      } else if (err instanceof ApiExposableError) {
        console.warn(
          `[API] Api-Exposable Error for ${req.method} ${req.path}: ${err.message}`
        );
        return res.status(err.statusCode).json({
          error: true,
          message: err.message
        });
      }
      if (err instanceof Error) {
        res.status(500).json({
          error: true,
          message: "Internal server error"
        });
        console.error(err);
      }
      next();
    }
  );
  if (dev)
    app.use(
      "/api/docs",
      swaggerUi.serve,
      async (_req: Request, res: Response) => {
        return res.send(
          swaggerUi.generateHTML(await import("../tsoa-build/swagger.json"))
        );
      }
    );
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  await dataSource.initialize();
  console.log("Initialized TypeORM dataSource");

  await OidcAuthController.initializeStaticMembers();
  const jwtService = new JwtService();
  await jwtService.initialize();
  console.log("Initialized Oidc Auth related services");

  for (const port of httpConfig.listens_on) {
    const server = createServer(app);
    const io = new SocketIoServer(server);
    io.on("connection", async socket => {
      if (typeof socket.handshake.auth.jwt === "string") {
        const { jwt } = socket.handshake.auth;
        if ((await jwtService.verifyJwt(jwt)) !== null)
          socket.join("authenticated");
      }
    });
    CardRelatedEntitySubscriber.fireEvent.push(() => {
      io.to("authenticated").emit("cards_changed");
    });

    server.listen(port, (err?: Error) => {
      if (err) throw err;
      console.log(`Listening on port ${port}`);
    });
  }
})();
