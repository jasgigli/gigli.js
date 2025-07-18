# Validex v1.0.0: The Modular, Type-Safe Validation Engine

Validex is a modular, type-safe validation engine for the modern web. It unifies the best features of Zod, Yup, Joi, and class-validator into a single, cohesive, and unbelievably powerful library.

## What's New in v1.0.0
- **Modular, maintainable architecture**
- Unified builder, decorator, and string rule APIs
- CLI for codegen and schema analysis
- Extensible registry for custom rules and transformers
- Detailed error tracing and validation pipelines

## Quick Start

```bash
npm install validex@latest
```

### 1. Schema Builder API

```typescript
import { v } from 'validex';

const UserSchema = v.object({
  username: v.string().min(3).max(20),
  email: v.string().email(),
  age: v.number().optional(),
  role: v.string().from('enum:values=user|admin,key=errors.role.invalid'),
});
```

### 2. Decorator API

```typescript
import { v, ValidatedModel } from 'validex';

@v.Refine((u) => u.password === u.passwordConfirm, { message: "Passwords don't match" })
class CreateUserDto extends ValidatedModel {
  @v.Rule(v.string().email())
  email: string;

  @v.Rule('string:min=8,max=50')
  password: string;

  @v.Rule(v.string())
  passwordConfirm: string;
}
```

### 3. Pipeline API

```typescript
const OrderPipeline = v.pipeline()
  .transform((data) => ({ ...data, createdAt: new Date() }))
  .validate(v.object({
    orderId: v.string().min(1),
    paymentMethod: v.string(),
  }))
  .dispatch('paymentMethod', {
    'credit_card': v.object({ paymentDetails: v.string() }),
    'paypal': v.object({ paymentDetails: v.string() }),
  })
  .refine((order) => order.items && order.items.length > 0, { message: 'Order must have at least one item' })
  .effect({
    onFailure: (trace) => console.log(`Validation failed for order`, trace),
  });
```

### 4. Validation Trace™

Every validation run produces a detailed trace:
- Input value
- Each transformer and rule applied
- The exact rule that failed
- The value at each step

### 5. CLI Usage

```bash
npx validex codegen --schema ./mySchema.ts --target openapi
npx validex analyze --schema ./mySchema.ts
```

- `codegen`: Generate OpenAPI or JSON Schema from your Validex schemas
- `analyze`: Statically analyze your schemas for impossible rules or performance issues

---

## Extensibility

- Register custom rules and transformers using the registry API
- Mix and match builder, decorator, and string rules in any combination
- Use Validex everywhere: React, Express, NestJS, tRPC, and more

---

Validex is the last validator you'll ever need. Define your schemas once, and use them everywhere: in type-safe builders, as class decorators, or as portable strings.

---

### Migration Note
If you used a previous prototype or V4 branch, see the new modular structure and update your imports accordingly. All APIs are now organized by feature for maximum maintainability.
