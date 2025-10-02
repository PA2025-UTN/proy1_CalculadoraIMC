import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'imc', timestamps: { createdAt: 'fecha', updatedAt: false } })
export class ImcMongo extends Document {
  @Prop({ required: true, min: 0 })
  peso: number;

  @Prop({ required: true, min: 0 })
  altura: number;

  @Prop({ required: true, min: 0 })
  imc: number;

  @Prop({ required: true })
  categoria: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: Date.now })
  fecha: Date;
}

export const ImcSchema = SchemaFactory.createForClass(ImcMongo);
ImcSchema.index({ userId: 1, fecha: -1 });

