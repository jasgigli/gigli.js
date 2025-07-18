# validex Usage Guide (v1.0.0)

## Basic Usage

See the README for a quick start. Here are more advanced examples:

### Nested Validation
You can validate nested objects by validating each level separately:
```typescript
import { validate } from 'validex';

const userSchema = {
  name: 'string:min=2',
  profile: 'object',
};

const profileSchema = {
  age: 'number:min=18',
  bio: 'string:max=160',
};

const user = {
  name: 'Alice',
  profile: {
    age: 22,
    bio: 'Hello!'
  }
};

const userResult = await validate(user, userSchema);
if (userResult.isValid) {
  const profileResult = await validate(user.profile, profileSchema);
  // ...
}
```

### Custom Rules
You can extend validex by adding your own rules using the registry API (see README for details).

### Error Handling
The `errors` object returned by `validate` maps field names to error messages. You can display these in your UI or logs.

## Tips
- Always keep your schemas in sync between frontend and backend.
- Use enums for fields with limited values.
- Use regex for advanced string validation.

For more, see the API reference in the README.
