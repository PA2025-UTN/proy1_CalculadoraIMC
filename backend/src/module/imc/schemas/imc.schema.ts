import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'imc', timestamps: { createdAt: 'fecha', updatedAt: false } })
export class ImcMongo extends Document {
  @Prop({ required: true })
  peso: number;

  @Prop({ required: true })
  altura: number;

  @Prop({ required: true })
  imc: number;

  @Prop({ required: true })
  categoria: string;

  @Prop({ required: true })
  userId: string;
}

export const ImcSchema = SchemaFactory.createForClass(ImcMongo);
