import { HttpStatus, HttpException, Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Weather, WeatherDocument } from "./weather.schema";

@Injectable()
export class WeatherService{
  constructor(private httpService: HttpService,
    private configService: ConfigService,
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,) {}
  async getWeather(location: string) {
    const apiKey = this.configService.get<string>('WEATHER_API_KEY');
    if (!apiKey) {
      throw new HttpException('API key for WeatherAPI is missing', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const result =  await this.httpService.axiosRef
    .get(`https://api.weatherapi.com/v1/current.json?q=${location}&key=${apiKey}`)


    const createdWeather = new this.weatherModel({location: location, data: result.data});
    await createdWeather.save();

    return createdWeather;
  }
}