import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcrypt';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User> & {
  comparePassword: (password: string) => Promise<boolean>;
};

@Schema({
  timestamps: true,
  toJSON: {
    transform(_doc, ret) {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  photo: string;

  @Prop({ type: String, enum: ['ADMIN', 'USER'], default: 'USER' })
  role: 'ADMIN' | 'USER';

  async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (this.isNew) {
    const salt = await genSalt(12);
    const hashedPassword = await hash(this.password, salt);
    this.password = hashedPassword;
  }
});

UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  const matchedPassword = await compare(password, this.password);
  return matchedPassword;
};
