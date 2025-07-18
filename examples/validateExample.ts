// Try importing from the local gigli.js package. Adjust the path if needed.
import { number, object, string, validate } from '../';

async function run() {
  // Define a user schema
  const userSchema = object({
    name: string().min(2),
    email: string().email(),
    age: number().min(18),
  });

  // Valid data
  const validUser = {
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
  };

  // Invalid data
  const invalidUser = {
    name: 'A', // too short
    email: 'not-an-email', // invalid email
    age: 15, // too young
  };

  // Validate valid user
  const validResult = await validate(userSchema, validUser);
  console.log('Valid user result:', validResult);

  // Validate invalid user
  const invalidResult = await validate(userSchema, invalidUser);
  console.log('Invalid user result:', invalidResult);
}

run().catch(console.error);
