import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type WeatherDocument = Weather & mongoose.Document;

@Schema()
export class Weather {
  @Prop({unique: true})
  location: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data: Record<string, any>;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
