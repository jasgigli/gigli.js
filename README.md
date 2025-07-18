
<!-- <div align="center">
  <img src="https://raw.githubusercontent.com/jasgigli/validex/main/assets/validex-logo.png" alt="Validex Logo" width="150"> -->
  <h1>Validex</h1>
  <p><strong>The Metamorphic, Type-Safe Validation Engine for TypeScript.</strong></p>
  <p>Define schemas once. Use them everywhere. Unify the best of Zod, Yup, and class-validator with a single, powerful, and portable runtime.</p>

  <p>
    <a href="https://www.npmjs.com/package/validex"><img src="https://img.shields.io/npm/v/validex.svg?style=flat-square" alt="NPM Version"></a>
    <a href="https://github.com/your-username/validex/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/jasgigli/validex/ci.yml?branch=main&style=flat-square" alt="Build Status"></a>
    <a href="https://www.npmjs.com/package/validex"><img src="https://img.shields.io/npm/dt/validex.svg?style=flat-square" alt="NPM Downloads"></a>
    <a href="https://github.com/jasgigli/validex/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/validex.svg?style=flat-square" alt="License"></a>
  </p>
</div>

---

Writing validation is a solved problem. Writing it in a way that is **type-safe, portable, declarative, and easy to debug** is not. Until now.

Validex isn't just another validator. It's a **metamorphic engine**, designed to adapt to your preferred coding style without sacrificing power or type safety.

## The Validex Difference

Why choose Validex? Because you no longer have to choose.

| Feature | Zod | Yup | class-validator | **Validex** |
| :--- | :---: | :---: | :---: | :---: |
| ✅ **Type Inference** | ✅ | ❌ | ✅ | ✅ |
| ✅ **Chainable Schema Builder** | ✅ | ✅ | ❌ | ✅ |
| ✅ **Decorator API** | ❌ | ❌ | ✅ | ✅ |
| ✅ **Portable String Rules** | ❌ | ❌ | ❌ | ✅ |
| 🔥 **Unified Runtime (Mix & Match)** | ❌ | ❌ | ❌ | ✅ |
| 🔥 **Validation Pipelines & Dispatch** | ❌ | ❌ | ❌ | ✅ |
| 🔥 **Detailed Error Tracing** | ❌ | ❌ | ❌ | ✅ |
| 🔥 **Auto OpenAPI/JSON Schema Gen** | ❌ | ❌ | ❌ | ✅ |

## Quick Start

Get up and running in less than a minute.

```bash
npm install validex
```

```typescript
import { v } from 'validex';

// 1. Define a schema with a fluent, Zod-like API
const UserSchema = v.object({
  username: v.string().min(3, "Username is too short."),
  email: v.string().email(),
  // Use portable strings for unmatched reusability!
  role: v.string().from('enum:values=user|admin'),
});

// 2. Infer your TypeScript type automatically
type User = v.infer<typeof UserSchema>;

// 3. Parse and get fully typed, validated data
try {
  const validatedUser = UserSchema.parse({
    username: 'johndoe',
    email: 'johndoe@example.com',
    role: 'admin'
  });
  console.log('Success!', validatedUser);
} catch (error) {
  // Get beautiful, flattened errors
  console.error(error.flatten());
}
```

## Choose Your Style: The 3 APIs

Validex's core strength is its **Unified Runtime**. Define rules in any style, and they'll all work together seamlessly.

<details>
  <summary><strong>1. The Schema Builder API (for Zod & Yup lovers)</strong></summary>

  Build complex, type-safe schemas with a fluent, chainable API. This is the recommended approach for most use cases.

  ```typescript
  import { v } from 'validex';

  const PostSchema = v.object({
    id: v.string().uuid(),
    title: v.string().min(5).max(100),
    tags: v.array(v.string().min(2)).optional(),
    author: UserSchema, // Schemas are composable!
  });
  ```
</details>

<details>
  <summary><strong>2. The Decorator API (for NestJS & enterprise developers)</strong></summary>

  Add validation directly to your classes for a clean, declarative, and object-oriented approach.

  ```typescript
  import { v, ValidatedModel } from 'validex';

  // Cross-field validation at the class level
  @v.Refine((dto) => dto.password === dto.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm'], // Assign error to a specific field
  })
  class CreateUserDto extends ValidatedModel {
    @v.Rule(v.string().email())
    email: string;

    // You can even use portable strings here!
    @v.Rule('string:min=8,max=50')
    password: string;

    @v.Rule(v.string())
    passwordConfirm: string;
  }

  // Throws a detailed error on failure
  const userDto = CreateUserDto.from(request.body);
  ```
</details>

<details>
  <summary><strong>3. The Pipeline API (for complex workflows & transformations)</strong></summary>

  Handle multi-step data processing, conditional logic, and side effects with grace.

  ```typescript
  const OrderPipeline = v.pipeline()
    // Step 1: Sanitize and transform the input
    .transform((data) => ({ ...data, orderId: data.id.toLowerCase() }))
    .validate(v.object({ orderId: v.string().min(1) }))

    // Step 2: Powerful conditional validation based on a field's value
    .dispatch('paymentMethod', {
      'credit_card': v.object({ card: CreditCardSchema }),
      'paypal': v.object({ email: v.string().email() }),
    })

    // Step 3: Cross-field business logic validation
    .refine((order) => order.total > 0, { message: 'Order total must be positive' })

    // Step 4: Perform side-effects without changing data
    .effect({
      onSuccess: (data) => analytics.track('OrderValidated', data.orderId),
      onFailure: (trace) => logger.error('Order Failed', { trace }),
    });

  const result = OrderPipeline.safeParse(orderData);
  ```
</details>

## Next-Gen Features

### 🔍 Validation Trace™

Stop guessing why validation failed. Every error in Validex is packed with a detailed trace, showing you the input, the transformers, and the exact rule that broke.

```json
{
  "input": { "username": "ab" },
  "path": ["username"],
  "steps": [
    { "rule": "string", "input": "ab", "output": "ab", "valid": true },
    { "rule": "min", "params": { "min": 3 }, "input": "ab", "output": "ab", "valid": false }
  ],
  "message": "Username is too short."
}
```

### ⚙️ The Validex CLI

Bring your validation schemas into your development workflow.

```bash
# Generate OpenAPI v3 specifications from your schemas
npx validex codegen --schema ./src/schemas.ts --target openapi

# Statically analyze schemas for impossible rules or performance issues
npx validex analyze --schema ./src/schemas.ts
```

## Extensibility is Key

Validex is built to be extended.
- **`v.registerRule()`**: Add your own custom validation logic (sync or async).
- **`v.registerTransformer()`**: Create reusable data sanitizers.
- **`v.define()`**: Define complex rule strings as aliases (e.g., `v.define('slug', 'string:min=3|regex:...')`).

## Use It Everywhere

Thanks to its zero-dependency core and hybrid module output, Validex works seamlessly across the entire JavaScript ecosystem.

<div align="center">
  <img src="https://raw.githubusercontent.com/your-username/validex/main/assets/ecosystem.png" alt="Ecosystem logos: React, Vue, Svelte, Node.js, NestJS, Express, tRPC, Deno, Bun, Cloudflare">
</div>

---

## Contributing

We are building the future of data validation, and we'd love your help. Please read our **[CONTRIBUTING.md](https://github.com/your-username/validex/blob/main/CONTRIBUTING.md)** to get started. Whether it's a bug report, a new feature, or a documentation improvement, all contributions are welcome!

## License

Validex is open-source software licensed under the **[MIT License](https://github.com/your-username/validex/blob/main/LICENSE)**.
