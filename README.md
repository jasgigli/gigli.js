# Validex V4: The Metamorphic Validation Engine

Validex is a metamorphic, type-safe validation engine for the modern web. It unifies the best features of Zod, Yup, Joi, and class-validator into a single, cohesive, and unbelievably powerful library.

## The Validex V4 Difference

| Feature | Zod | Yup | class-validator | **Validex V4** |
| :--- | :---: | :---: | :---: | :---: |
| Type Inference | ✅ | ❌ | ✅ | ✅ |
| Schema Builder API | ✅ | ✅ | ❌ | ✅ |
| Decorator API | ❌ | ❌ | ✅ | ✅ |
| Portable String Rules | ❌ | ❌ | ❌ | ✅ |
| **Unified Runtime (Mix & Match)** | ❌ | ❌ | ❌ | 🔥 **Yes** |
| **Validation Pipelines & Dispatch** | ❌ | ❌ | ❌ | 🔥 **Yes** |
| **Detailed Error Tracing** | ❌ | ❌ | ❌ | 🔥 **Yes** |
| **Auto OpenAPI/JSON Schema Gen** | ❌ | ❌ | ❌ | 🔥 **Yes** |

## Quick Start

```bash
npm install validex@next
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

- `codegen`: Generate OpenAPI or JSON Schema from your Validex schemas (coming soon)
- `analyze`: Statically analyze your schemas for impossible rules or performance issues (coming soon)

---

## Extensibility

- Register custom rules and transformers using the registry API.
- Mix and match builder, decorator, and string rules in any combination.
- Use Validex everywhere: React, Express, NestJS, tRPC, and more.

---

Validex V4 is the last validator you'll ever need. Define your schemas once, and use them everywhere: in type-safe builders, as class decorators, or as portable strings.
