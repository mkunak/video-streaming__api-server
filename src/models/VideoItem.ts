import { Document, Model, Schema, Types, model } from 'mongoose';

// An interface that describes the properties to create a new Video
export interface IVideoItem {
  id?: Types.ObjectId;
  index: number;
  name: string;
  description?: string;
  size?: number;
  sizeUnit?: string;
  duration?: number;
  durationUnit?: string;
  dotExtension?: string;
  resolution?: number;
  screensaver?: string;
}

export interface IVideoItemDocument extends Omit<IVideoItem, 'id'>, Document {}

// Schema
const VideoItemSchema: Schema<IVideoItemDocument> = new Schema({
  index: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: String,
  size: Number,
  sizeUnit: String,
  dotExtension: String,
  resolution: Number,
  screensaver: String,
  duration: Number,
  durationUnit: String,
}, {
  toJSON: {
    transform(doc, { _id, __v, ...rest }) {
      return { id: _id, ...rest };
    }
  }
});

// Model
export interface IVideoItemModel extends Model<IVideoItemDocument> {}

const VideoItem = model<IVideoItemDocument, IVideoItemModel>('VideoItem', VideoItemSchema);

export { VideoItem };
