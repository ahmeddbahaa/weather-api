import { Module } from "@nestjs/common";
import { WeatherController } from "./weather.controller";
import { WeatherService } from "./weather.service";
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Weather, WeatherSchema } from "./weather.schema";
import { MemoryCacheManager } from "./weather.cache";

@Module({
  imports: [HttpModule, ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb+srv://ahmeddbahaa:tYX9IZo9uoyQZDJ0@cluster0.hf3i5n4.mongodb.net/?retryWrites=true&w=majority'),
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService, MemoryCacheManager]
})
export class WeatherModule {}