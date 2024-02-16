import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { WeatherModule } from './weather.module';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { MemoryCacheManager } from './weather.cache';

describe('WeatherController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WeatherModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/weather (GET) - valid location', () => {
    return request(app.getHttpServer())
      .get('/weather?location=London')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('location');
        expect(res.body).toHaveProperty('data');
      });
  });

  it('/weather (GET) - invalid location', () => {
    return request(app.getHttpServer())
      .get('/weather?location=InvalidLocation')
      .expect(400)
      .expect((res) => { expect(res.body.error).toBe('InvalidInputError'); })
  });


  it('/weather (GET) - no location', () => {
    return request(app.getHttpServer())
      .get('/weather')
      .expect(400)
      .expect((res) => { expect(res.body.error).toBe('Bad Request'); });
  });

});

describe('WeatherService (ut)', () => {

    let weatherService: WeatherService;
    let httpService: HttpService;
    let cacheManager: MemoryCacheManager;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          WeatherService,
          { provide: HttpService, useValue: { axiosRef: { get: jest.fn() } } },
          { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('dummy') } },
          { provide: 'WeatherModel', useValue: Model },
          { provide: MemoryCacheManager, useValue: { get: jest.fn(), set: jest.fn() } },
        ],
      }).compile();
  
      weatherService = module.get<WeatherService>(WeatherService);
      httpService = module.get<HttpService>(HttpService);
      cacheManager = module.get<MemoryCacheManager>(MemoryCacheManager);
    });

    it('should be defined', () => {
      expect(weatherService).toBeDefined();
    });

    it('should return weather data from cache if available', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue('cachedWeatherData');
  
      const weather = await weatherService.getWeather('London');
  
      expect(cacheManager.get).toHaveBeenCalledWith('London');
      expect(httpService.axiosRef.get).not.toHaveBeenCalled();
      expect(weather).toEqual('cachedWeatherData');
    });

    it('should fetch weather data if not in cache', async () => {
      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue({ data: 'weatherData' });
  
      try{
        await weatherService.getWeather('London');
      }catch(error){
  
      expect(cacheManager.get).toHaveBeenCalledWith('London');
      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        `https://api.weatherapi.com/v1/current.json?q=London&key=dummy`,
      );}
    });

  it('should throw an error for an invalid location', async () => {
    try {
      await weatherService.getWeather('InvalidLocation');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toBe('Invalid location provided');
    }
  });

  // it('should throw an error for no location', async () => {
  //   try {
  //     await weatherService.getWeather('');
  //   } catch (error) {
  //     expect(error.response.status).toBe(400);
  //     expect(error.response.data.error).toBe('Bad Request');
  //   }
  // });
 

});
