import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IOAuthProvider {
  provider: string;
  providerId: string;
  email?: string;
}

export interface IAdminUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  oauthProviders: IOAuthProvider[];
  lastLoginAt?: Date;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'admin' },
    oauthProviders: [
      {
        provider: String,
        providerId: String,
        email: String,
      },
    ],
    lastLoginAt: Date,
  },
  { timestamps: true }
);

adminUserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export default mongoose.model<IAdminUser>('AdminUser', adminUserSchema);
