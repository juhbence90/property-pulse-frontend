import { Schema, model, models, Types, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  image?: string;
  bookmarks: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      unique: [true, 'Email already exists'],
      required: [true, 'Email is required'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    image: {
      type: String,
    },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  },
  {
    timestamps: true,
  },
);

const User = models.User || model('User', UserSchema);

export default User;
