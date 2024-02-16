import { Controller, Get, Logger, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './dto/get.weather.dto';

@Controller('v1')
export class WeatherController {
  private logger = new Logger('WeatherController');

  constructor(private readonly weatherService: WeatherService) {}

  @Get('weather')
  @UsePipes(new ValidationPipe())
  getWeather(@Query() getWeatherDto: GetWeatherDto) {
    this.logger.log(`Received request for ${getWeatherDto.location}`);
    return this.weatherService.getWeather(getWeatherDto.location);
  }
}
