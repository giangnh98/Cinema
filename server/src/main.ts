import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./shared/filters/http-exception.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.setGlobalPrefix("api");
   app.useGlobalFilters(new HttpExceptionFilter());
   
   const hostDomain = AppModule.isDev ? `${AppModule.host}:${AppModule.port}` : AppModule.host;
   
   const swaggerOptions = new DocumentBuilder()
      .setTitle("Cinema API")
      .setDescription("API Documentation")
      .setVersion("1.0.0")
      .addServer(`${AppModule.isDev ? "http" : "https"}://`)
      .setBasePath("/api")
      .addBearerAuth({ type: "apiKey", name: "Authorization", in: "header" })
      .build();
   
   const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);
   
   app.use("/api/docs/swagger.json", (req, res) => {
      res.send(swaggerDoc);
   });
   
   SwaggerModule.setup("/api/docs", app, null, {
      swaggerUrl: `${hostDomain}/api/docs/swagger.json`,
      explorer: true,
      swaggerOptions: {
         docExpansion: "list",
         filter: true,
         showRequestDuration: true
      }
   });
   app.enableCors();
   await app.listen(AppModule.port);
}

bootstrap();
