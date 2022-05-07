import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { inspect } from "util";
import { RegisterRoutes } from "../tsoa-build/routes";
import ApiExposableError from "./api/ApiExposableError";

export default async function(dev, app: express.Application) {
  // creates api router and register routes to api router
  const apiRouter = express.Router();
  RegisterRoutes(apiRouter);

  // parsers json and urlencoded body
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

  // adds api router and error handler
  app.use(
    "/api",
    apiRouter,
    (err: unknown, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof ValidateError) {
        // handles validation error
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
        // handles api-exposable error
        console.warn(
          `[API] Api-Exposable Error for ${req.method} ${req.path}: ${err.message}`
        );
        return res.status(err.statusCode).json({
          error: true,
          message: err.message
        });
      }
      if (err instanceof Error) {
        // handles internal error
        res.status(500).json({
          error: true,
          message: "Internal server error"
        });
        console.error(err);
      }
      next();
    }
  );

  // run swagger ui on dev
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
}
