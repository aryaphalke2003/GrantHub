import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AppService } from "./app.service";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "..", "client", "dist"),
        }),
        AuthModule,
        DatabaseModule,
        ConfigModule.forRoot({ envFilePath: join(__dirname, "..", ".env") }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
