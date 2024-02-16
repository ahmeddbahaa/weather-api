import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './weather.schema';

@Injectable()
export class MemoryCacheManager implements OnModuleInit {
  private cache = new Map<string, any>();

  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
  ) {}

  async onModuleInit() {
    // Fetch all weather data from the database
    const weatherData = await this.weatherModel.find().exec();
    // Store each weather data in the cache with the location as the key
    //TODO - Use Nodejs streams to store the data in the cache
    for (const weather of weatherData) {
      this.cache.set(weather.location, weather);
    }
  }

  async get(key: string) {
    return this.cache.get(key);
  }

  async set(key: string, value: any) {
    this.cache.set(key, value);
  }
}
