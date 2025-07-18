# Validex V3: The Definitive Validation Language

Validex is a declarative language for complex, enterprise-grade data validation, transformation, and sanitization. V3 introduces conditional logic, cross-field validation, rule reusability, and context-awareness.

## The Validex Philosophy

- **Declarative:** Define *what* is valid, not *how* to check it.
- **Portable:** Rules are strings, easily stored in JSON, YAML, or databases. Share them between your frontend and backend.
- **Extensible:** If a rule doesn't exist, write it yourself and plug it into the engine.

## V3 Killer Features: Quick Look

```typescript
import { validate, define } from 'validex';

// 1. Define reusable, complex rules
define('password', 'string:min=8,max=50');
define('zipcode.us', 'string:len=5|regex:pattern=^\\d{5}$');

const userRegistrationSchema = {
  // 2. Use defined rules
  password: 'password',
  // 3. Cross-field validation ($ syntax)
  passwordConfirm: 'required|equal:$password:key=errors.password.mismatch',

  // 4. Powerful conditional logic
  country: 'enum:values=USA|Canada',
  zipCode: "when:$country,is:equal:USA,then:zipcode.us"
};

const result = await validate(userData, userRegistrationSchema, {
  i18n: (key, params) => getTranslation(key, params) // Your i18n function
});
```

## Advanced Language Guide (V3)

### Defining Reusable Rules: `define(name, ruleString)`

Avoid repetition by defining custom rules once and reusing them anywhere.

```typescript
// in a central setup file (e.g., validation.setup.ts)
import { define } from 'validex';

define('slug', 'string:min=3|regex:pattern=^[a-z0-9-]+$');
define('email', 'trim => lower => string|email:key=errors.invalid_email');

// in your module
const schema = { userEmail: 'email', postSlug: 'slug' };
```

### Cross-Field Validation: The `$` Prefix

Reference the value of another field in your data object using `$`.

- `equal:$fieldName`: Must be equal to the value of `fieldName`.
- `after:$startDate`: Must be a date that comes after the date in `startDate`.

```typescript
const schema = {
  startDate: 'required|date',
  endDate: 'required|date|after:$startDate'
};
```

### Conditional Validation: `when(condition, rules)`

The `when` rule is the most powerful feature in V3. It applies validation rules based on the state of another field.

**Syntax:** `when:$field,is:rule,then:rule,otherwise:rule`

- `$field`: The field to check (with `$` prefix).
- `is`: A Validex rule to validate the target field's value against.
- `then`: A Validex rule to apply to the *current* field if the `is` condition passes.
- `otherwise`: (Optional) A rule to apply if the `is` condition fails.

```typescript
const schema = {
  delivery: 'boolean',
  // The address field is only required if delivery is true
  address: "when:$delivery,is:isTrue,then:required|string:min=10"
};
```

### Context-Aware Validation

Pass external data into your validation logic using the `options.context` object. This is perfect for checking permissions or other application-level states.

```typescript
// Custom rule needing context
registerSyncRule('roleAllowed', (state, params) => {
  const { currentUser } = state.context;
  return currentUser.isAdmin;
});

// Usage
const result = await validate(
  { role: 'admin' },
  { role: 'roleAllowed' },
  { context: { currentUser: { isAdmin: true } } }
);
```

### Internationalization (i18n) with `key`

Decouple error messages from logic. Use the `key` parameter instead of `message`.

```typescript
// Rule
const schema = { username: "string:min=3,key=errors.username.too_short" };

// Validator call
const result = await validate(data, schema, {
  i18n: (key, params) => {
    // e.g., key = 'errors.username.too_short', params = { min: '3' }
    return i18next.t(key, params);
  }
});
```
```

Validex V3 is now a complete, robust, and highly practical language and engine. It addresses the full lifecycle of modern data validation, from simple type-checking to complex, interdependent business logic, making it an extremely valuable tool in any software project.
