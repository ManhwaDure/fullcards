import express from "express";
import { createServer } from "http";
import next from "next";
import { Server as SocketIoServer } from "socket.io";
import httpConfig from "../configs/http.json";
import addDefaultSiteSettings from "./addDefaultSiteSettings";
import { OidcAuthController } from "./api/controllers/OidcAuthController";
import JwtService from "./api/services/JwtService";
import dataSource from "./database/dataSource";
import { SiteSettingEntitySubscriber } from "./database/subscribers";
import { CardRelatedEntitySubscriber } from "./database/subscribers/cardRelatedEntitySubscriber";
import initializeApi from "./initializeApi";

const dev = process.env.NODE_ENV !== "production";

const nextApp = next({ dev, dir: process.cwd() });
const handle = nextApp.getRequestHandler();

(async () => {
  // initialize express app and nextjs app
  await nextApp.prepare();
  const app = express();

  // handles backend
  initializeApi(dev, app);

  // handles frontend
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  // initializes database
  await dataSource.initialize();
  console.log("Initialized TypeORM dataSource");

  // adds default site setting if not exists
  await addDefaultSiteSettings();

  // initializes jwt service and oidc service
  await OidcAuthController.initializeStaticMembers();
  const jwtService = new JwtService();
  await jwtService.initialize();
  console.log("Initialized Oidc Auth related services");

  // starts server
  for (const port of httpConfig.listens_on) {
    // creates socket.io server
    const server = createServer(app);
    const io = new SocketIoServer(server);

    // authenticate on socket.io connection request
    io.on("connection", async socket => {
      if (typeof socket.handshake.auth.jwt === "string") {
        const { jwt } = socket.handshake.auth;
        if ((await jwtService.verifyJwt(jwt)) !== null)
          socket.join("authenticated");
      }
    });

    // fire cards_changed socket.io event to listeners
    CardRelatedEntitySubscriber.fireEvent.push(() => {
      io.to("authenticated").emit("cards_changed");
    });
    SiteSettingEntitySubscriber.fireEvent.push(() => {
      io.to("authenticated").emit("site_settings_changed");
    });

    // listen port
    server.listen(port, (err?: Error) => {
      if (err) throw err;
      console.log(`Listening on port ${port}`);
    });
  }
})();
