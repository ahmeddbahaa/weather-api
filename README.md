# Simple Weather Service Api 👋
Welcome to the Simple Apartment Listing App!
This repository contains the backend, frontend, and mobile application components of My Application.

## Backend (NestJS)

### Description

This is a NestJS application that provides weather data based on location. The application has one endpoint `/weather?location=` which fetches weather data for the provided location. 

The application uses MongoDB to store weather data, with location as a unique identifier. It also utilizes an in-memory cache to read data that is initialized at the start of the application and fetches all data from the database.


the application follows the modular structure recommended by NestJS. It uses decorators, modules, dependency injection, pipes, and exception filters as prescribed in the NestJS documentation.

## API Reference

#### Get Weather Data for given Location

```http
  GET /api/v1/weather?location
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `location`| `string` | **Required**. Your Weather Location |

## Run Locally 
**Don't forget to add .env file check Environment Variables Section:**

### Installation

```bash
$ npm install
```
### Start the APP
```bash
$ npm start 
```
### Run Tests
```bash
$ npm run test
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
`WEATHER_API_KEY`
`DB_USERNAME`
`DB_PASSWORD`

I have Include .envExample that has values that you can use to run the app

