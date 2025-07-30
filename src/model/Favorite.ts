import mongoose, {Schema, Document} from "mongoose";

export interface Favorite extends Document{
    userId: string,
    category: string,
    title: string,
    description: string, 
    imageUrl: string,
    url: string,
}

const FavoriteSchema: Schema<Favorite> = new Schema({
  userId: { type: String, required: true },
  category: { type: String }, // 'news','movie','music'
  title: String,
  description: String,
  imageUrl: String,
  url: String,
}, { timestamps: true });

export default (mongoose.models.Favorite as mongoose.Model<Favorite>) || mongoose.model<Favorite>('Favorite', FavoriteSchema);
