import { IsNotEmpty, IsString } from 'class-validator';

export class GetWeatherDto {
  @IsNotEmpty({ message: 'Location should not be empty' })
  @IsString({ message: 'Location should be a string'})
  location: string;
}
