import { AzuraClient, createLoggingMiddleware } from "azurajs";
import { applyDecorators } from "azurajs/decorators";
import { HomeController } from "./controllers/HomeController";
import { UserController } from "./controllers/UserController";
import { SearchController } from "./controllers/SearchController";

async function bootstrap() {
  const app = new AzuraClient();

  const loggingMiddleware = createLoggingMiddleware(app.getConfig());
  app.use(loggingMiddleware);

  applyDecorators(app, [HomeController, UserController, SearchController]);

  await app.listen();
}

bootstrap().catch(console.error);
