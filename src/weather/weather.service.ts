import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './weather.schema';
import { MemoryCacheManager } from './weather.cache';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private cacheManager: MemoryCacheManager,
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
  ) {
    const key = this.configService.get<string>('WEATHER_API_KEY');
    if (!key) {
      throw new HttpException(
        'API key for WeatherAPI is missing',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    this.apiKey = key;
  }
  async getWeather(location: string) {
    try {
      let weather = await this.cacheManager.get(location);

      if (!weather) {
        const weatherData = await this.fetchWeatherFromAPI(location);
        if (weatherData) {
          const createdWeather = new this.weatherModel({
            location: location,
            data: weatherData,
          });
          await createdWeather.save();
          await this.cacheManager.set(location, createdWeather);
          weather = createdWeather;
        }
      }
      return weather;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  private async fetchWeatherFromAPI(location: string) {
    try {
      const result = await this.httpService.axiosRef.get(
        `https://api.weatherapi.com/v1/current.json?q=${location}&key=${this.apiKey}`,
      );
      return result.data;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
