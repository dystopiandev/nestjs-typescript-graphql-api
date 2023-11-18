import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { config } from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();

  await app.listen(config.port, config.host, () => {
    const host = config.host === "0.0.0.0" ? "localhost" : config.host;

    console.info(`\nGraphQL sandbox: http://${host}:${config.port}/graphql`);
  });
}

bootstrap();
