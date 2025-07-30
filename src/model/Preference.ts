import mongoose, {Schema, Document} from "mongoose";

export interface Preference extends Document{
    userId: string,
    category: string,
}

const PreferenceSchema: Schema<Preference> = new Schema({
    userId: {type: String, required: true },
    category: [String],
})

export default (mongoose.models.Preference as mongoose.Model<Preference>) || mongoose.model<Preference>("Preference" , PreferenceSchema)
 

