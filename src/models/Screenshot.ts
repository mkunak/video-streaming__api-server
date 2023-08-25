import { Document, Model, Schema, Types, model } from 'mongoose';

// An interface that describes the properties to create a new Screenshot
export interface IScreenshot {
  id?: Types.ObjectId;
  name?: string;
  dotExtension?: string;
  resolution?: number;
  videoItem: Types.ObjectId;
}

export interface IScreenshotDocument extends Omit<IScreenshot, 'id'>, Document<Types.ObjectId> {}

// Schema
const ScreenshotSchema: Schema<IScreenshotDocument> = new Schema({
  name: { type: String, unique: true },
  dotExtension: String,
  resolution: Number,
  videoItem: { type: Schema.Types.ObjectId, ref: 'VideoItem' },
}, { toJSON: {
    transform(doc, { _id, __v, ...rest }) {
      return { id: _id, ...rest };
    }
  }});

// Model
export interface IScreenshotModel extends Model<IScreenshotDocument> {}

const Screenshot = model<IScreenshotDocument, IScreenshotModel>('Screenshot', ScreenshotSchema);

export { Screenshot };
