import { Document, Model, Schema, Types, model } from 'mongoose';

// An interface that describes the properties to create a new Screensaver
export interface IScreensaver {
  id?: Types.ObjectId;
  size?: number;
  sizeUnit?: string;
  dotExtension?: string;
  resolution?: number;
  videoItem: Types.ObjectId;
}

export interface IScreensaverDocument extends Omit<IScreensaver, 'id'>, Document {}

// Schema
const ScreensaverSchema: Schema<IScreensaverDocument> = new Schema({
  size: Number,
  sizeUnit: String,
  dotExtension: String,
  resolution: Number,
  videoItem: { type: Schema.Types.ObjectId, ref: 'VideoItem' },
}, { toJSON: {
    transform(doc, { _id, __v, ...rest }) {
      return { id: _id, ...rest };
    }
  }});

// Model
export interface IScreensaverModel extends Model<IScreensaverDocument> {}

const Screensaver = model<IScreensaverDocument, IScreensaverModel>('Screensaver', ScreensaverSchema);

export { Screensaver };
