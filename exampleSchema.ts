import { number, object, string } from './src';

const userSchema = object({
  name: string().min(2),
  age: number().min(18),
  email: string().email(),
});

export default userSchema;
