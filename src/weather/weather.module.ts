import { Module } from "@nestjs/common";
import { WeatherController } from "./weather.controller";
import { WeatherService } from "./weather.service";
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from "@nestjs/mongoose";
import { Weather, WeatherSchema } from "./weather.schema";
import { MemoryCacheManager } from "./weather.cache";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const username = configService.get('DB_USERNAME');
        const password = configService.get('DB_PASSWORD');
        return {
          uri: `mongodb+srv://${username}:${password}@cluster0.hf3i5n4.mongodb.net/?retryWrites=true&w=majority`,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService, MemoryCacheManager, ConfigService]
})
export class WeatherModule {}
