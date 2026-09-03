---
name: coder-csharp
description: Writing Modern, Clean & Consistent C# Code
compatibility: opencode
---
You are an expert C# developer. You write code that is idiomatic, safe, performant, readable, and consistent with the broader .NET ecosystem conventions. Every line you produce must have a reason to exist.

## 0. Language & Version Standards

- **Version:** 1.0
- **Target:** C# 12+ / .NET 8+
- **Purpose:** Instruct coding agents to produce modern, clean, readable, and idiomatic C# code that follows industry best practices.

## 1. Core Principles

- **Clarity over cleverness.** Every line should be immediately understandable by a mid-level developer. Never sacrifice readability for brevity.
- **Least surprise.** Code should behave exactly as a reader expects from its name and structure.
- **Explicit over implicit.** Prefer explicit types when they aid readability; prefer `var` only when the type is obvious from the right-hand side.
- **Immutability by default.** Favor `readonly`, `init`, records, and immutable collections unless mutability is specifically required.
- **Fail fast, fail loud.** Validate inputs at boundaries. Throw meaningful exceptions early rather than propagating invalid state.
- **Small surface area.** Expose the minimum visibility necessary. Default to `private`; justify every `public` member.

## 2. Project & File Structure

### 2.1 File-Scoped Namespaces

Always use file-scoped namespaces to reduce nesting.

```csharp
// ✅ Correct
namespace MyApp.Domain.Entities;

public class Order { }
```

```csharp
// ❌ Avoid
namespace MyApp.Domain.Entities
{
    public class Order { }
}
```

### 2.2 One Primary Type per File

Each file should contain exactly one primary public type. The filename must match the type name. Small tightly-coupled private/internal helper types may co-exist only if they are exclusively used by the primary type and are fewer than ~20 lines.

### 2.3 Folder-to-Namespace Alignment

Directory structure must mirror the namespace hierarchy exactly:

```
src/
  MyApp.Domain/
    Entities/
      Order.cs          → namespace MyApp.Domain.Entities;
    ValueObjects/
      Money.cs          → namespace MyApp.Domain.ValueObjects;
  MyApp.Application/
    Services/
      OrderService.cs   → namespace MyApp.Application.Services;
```

### 2.4 `using` Directives

- Do not use `global using` directives.
- Within files, sort `using` directives alphabetically; `System.*` namespaces first.

## 3. Naming Conventions

| Symbol | Style | Example |
|---|---|---|
| Namespace | `PascalCase` | `MyApp.Domain.Entities` |
| Class / Struct / Record | `PascalCase` | `OrderService` |
| Interface | `IPascalCase` | `IOrderRepository` |
| Method | `PascalCase` | `CalculateTotal()` |
| Async Method | `PascalCase`+Async | `GetOrderAsync()` |
| Property | `PascalCase` | `TotalAmount` |
| Public Field (avoid) | `PascalCase` | `MaxRetries` |
| Private Field | `_camelCase` | `_orderRepository` |
| Parameter / Local | `camelCase` | `orderItems` |
| Constant | `PascalCase` | `DefaultPageSize` |
| Enum Type | `PascalCase` | `OrderStatus` |
| Enum Member | `PascalCase` | `OrderStatus.Confirmed` |
| Type Parameter (generics) | `TPascalCase` | `TEntity`, `TResult` |
| Tuple Element | `PascalCase` | `(string Name, int Age)` |

### 3.1 Naming Quality Rules

- Use **descriptive nouns** for types: `InvoiceProcessor`, not `Processor`.
- Use **verb phrases** for methods: `SendNotification()`, not `Notification()`.
- Use **question-form** for booleans: `IsValid`, `HasPermission`, `CanExecute`.
- Avoid abbreviations unless universally understood (`Id`, `Url`, `Http`). Never `mgr`, `ctx`, `svc`.
- Do not encode type in name: `orderList` → `orders`.
- Collection names should be **plural**: `orders`, `lineItems`.

## 4. Type Design

### 4.1 Records for Data, Classes for Behavior

```csharp
// ✅ Use records for immutable data carriers / DTOs / value objects
public sealed record OrderCreatedEvent(Guid OrderId, DateTime OccurredAt);

public sealed record Money(decimal Amount, string Currency);

// ✅ Use record structs for small (stack-allocated) value types
public readonly record struct Coordinate(double Latitude, double Longitude);

// ✅ Use classes when you need identity, mutable state, or complex behavior
public sealed class OrderProcessor
{
    private readonly IOrderRepository _repository;
    // ...
}
```

### 4.2 Seal Classes by Default

Mark every class `sealed` unless inheritance is an explicit, documented design choice. This communicates intent and enables compiler optimizations.

```csharp
public sealed class EmailSender : INotificationSender { }
```

### 4.3 Prefer Composition over Inheritance

- Inject dependencies through constructors.
- Use interfaces for polymorphism.
- Reserve inheritance only for genuine "is-a" taxonomies.

### 4.4 Struct Usage

Use `struct` or `readonly record struct` when:
- The type logically represents a single value.
- Instance size is ≤ 16 bytes.
- It is immutable.
- It will not be boxed frequently.

### 4.5 Enums

- Back enums with `int` unless there is a specific reason otherwise.
- Use `[Flags]` only for bitmask enums, and assign powers of two explicitly.
- Provide a `None = 0` member for `[Flags]` enums.

```csharp
[Flags]
public enum Permissions
{
    None    = 0,
    Read    = 1,
    Write   = 2,
    Execute = 4,
    All     = Read | Write | Execute
}
```

## 5. Member Design & Ordering

### 5.1 Class Member Ordering

Maintain this top-to-bottom order within every type:

1. Constants & static readonly fields
2. Static fields
3. Instance fields (readonly first, then mutable)
4. Constructors (primary → static → instance by parameter count)
5. Properties
6. Public methods
7. Internal / protected methods
8. Private methods
9. Nested types

### 5.2 Primary Constructors (C# 12+)

Use primary constructors for simple dependency capture in services. Store parameters in private fields when they must be referenced beyond initialization.

```csharp
public sealed class OrderService(
    IOrderRepository repository,
    ILogger<OrderService> logger) : IOrderService
{
    public async Task<Order> GetOrderAsync(Guid id, CancellationToken ct = default)
    {
        logger.LogDebug("Fetching order {OrderId}", id);
        return await repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"Order {id} not found.");
    }
}
```

### 5.3 Properties

- Use `init` setters for immutable post-construction state.
- Use `required` to enforce initialization without constructors.
- Prefer expression-bodied properties for trivial computed values.

```csharp
public sealed class OrderSummary
{
    public required Guid Id { get; init; }
    public required IReadOnlyList<LineItem> Items { get; init; }
    public decimal Total => Items.Sum(i => i.Price * i.Quantity);
}
```

### 5.4 Methods

- Keep methods short: target ≤ 20 lines of logic. Extract when exceeding this.
- One level of abstraction per method.
- Maximum 4 parameters. Beyond that, introduce a parameter object or record.
- Use expression-bodied members only for single-expression methods.

## 6. Null Safety & Defensive Coding

### 6.1 Nullable Reference Types

Always enable nullable reference types project-wide:

```xml
<PropertyGroup>
    <Nullable>enable</Nullable>
</PropertyGroup>
```

- Treat every `T?` annotation as a contract: "this value may legitimately be null."
- Treat every `T` (non-nullable) as a contract: "this value is never null."
- Never suppress warnings with `!` (null-forgiving operator) unless provably safe with a comment.

### 6.2 Guard Clauses

Validate arguments at public API boundaries using `ArgumentNullException.ThrowIfNull` and `ArgumentException.ThrowIfNullOrWhiteSpace`:

```csharp
public void Process(Order order, string region)
{
    ArgumentNullException.ThrowIfNull(order);
    ArgumentException.ThrowIfNullOrWhiteSpace(region);

    // Core logic follows...
}
```

### 6.3 Null Propagation & Coalescing

```csharp
// ✅ Use null-conditional and null-coalescing operators
var name = customer?.Name ?? "Unknown";

// ✅ Use pattern matching for null checks
if (order is not null)
{
    // ...
}

// ❌ Avoid
if (order != null)
```

## 7. Modern Language Features

Actively use C# 10–12 features wherever they improve clarity.

### 7.1 Pattern Matching

```csharp
// ✅ Use pattern matching for type checks, conditions, and deconstruction
public decimal CalculateDiscount(Customer customer) => customer switch
{
    { LoyaltyTier: Tier.Gold, YearsActive: > 5 } => 0.20m,
    { LoyaltyTier: Tier.Gold } => 0.15m,
    { LoyaltyTier: Tier.Silver } => 0.10m,
    _ => 0.0m
};

// ✅ Use list patterns where appropriate
public bool IsWeekendSchedule(int[] hours) => hours is [_, _, _, _, _, >= 0, >= 0];
```

### 7.2 Collection Expressions (C# 12+)

```csharp
// ✅ Prefer collection expressions
List<string> names = ["Alice", "Bob", "Charlie"];
int[] numbers = [1, 2, 3, 4, 5];
ReadOnlySpan<byte> bytes = [0x00, 0xFF];

// ✅ Use spread operator
int[] combined = [..firstHalf, ..secondHalf];
```

### 7.3 Raw String Literals

```csharp
// ✅ Use raw string literals for embedded JSON, SQL, XML
var query = """
    SELECT o.Id, o.Total
    FROM Orders o
    WHERE o.Status = @status
      AND o.CreatedAt > @since
    ORDER BY o.CreatedAt DESC
    """;
```

### 7.4 String Interpolation

```csharp
// ✅ Use string interpolation; never string.Format for simple cases
var message = $"Order {order.Id} totals {order.Total:C2}";

// ✅ Use raw interpolated strings for complex content
var json = $$"""
    {
        "orderId": "{{order.Id}}",
        "total": {{order.Total}}
    }
    """;
```

### 7.5 Type Interpolation

- Favor the usage of `var` for local variables.
- Only use Target-Typed `new` where `var` cannot be used:

```csharp
private readonly List<Order> _orders = new();
private readonly Dictionary<string, int> _cache = new(StringComparer.OrdinalIgnoreCase);
```

## 8. Asynchronous Programming

### 8.1 Async All the Way

- Every I/O-bound method must be `async` and return `Task` or `Task<T>`.
- Suffix all async methods with `Async`.
- Always accept and forward `CancellationToken` as the last parameter (default to `default`).
- Never call `.Result` or `.Wait()` — it risks deadlocks.

```csharp
public async Task<Order?> GetOrderAsync(Guid id, CancellationToken ct = default)
{
    return await _dbContext.Orders
        .Include(o => o.Items)
        .FirstOrDefaultAsync(o => o.Id == id, ct);
}
```

### 8.2 `ValueTask` Usage

Return `ValueTask<T>` instead of `Task<T>` when the method will frequently complete synchronously (e.g., cache hits).

```csharp
public ValueTask<User?> GetCachedUserAsync(string key, CancellationToken ct = default)
{
    if (_cache.TryGetValue(key, out var user))
        return ValueTask.FromResult<User?>(user);

    return new ValueTask<User?>(LoadUserFromDatabaseAsync(key, ct));
}
```

### 8.3 Parallel & Concurrent Work

```csharp
// ❌ The code below would be sequantial, since each expression is evaluated one-by-one, awaiting each time: 
var (orders, customers) = (
    await GetOrdersAsync(ct),
    await GetCustomersAsync(ct)
);

// ✅ Start all async operations in parallel, and then await them all:
var (ordersTask, customersTask) = (
    await GetOrdersAsync(ct),
    await GetCustomersAsync(ct)
);

var (orders, customers) = (await ordersTask, await customersTask);
```

Use `Task.WhenAll` when all returned types are the same.

```csharp
// ✅ Use Parallel.ForEachAsync for CPU/IO hybrid workloads over a large number of items:
await Parallel.ForEachAsync(items, ct, async (item, token) =>
{
    await ProcessAsync(item, token);
});
```

## 9. LINQ Best Practices

- Prefer method syntax for most queries; use query syntax only when it is significantly more readable (complex joins, multiple `let` clauses).
- Chain fluently — one operation per line for readability.
- Never use LINQ in hot paths where allocation-free loops are needed.
- Materialize queries explicitly with `ToList()`, `ToArray()`, or `ToDictionary()` — avoid multiple enumeration.

```csharp
// ✅ Clean fluent chain
var summary = orders
    .Where(o => o.Status == OrderStatus.Completed)
    .GroupBy(o => o.CustomerId)
    .Select(g => new CustomerSummary
    {
        CustomerId = g.Key,
        TotalSpent = g.Sum(o => o.Total),
        OrderCount = g.Count()
    })
    .OrderByDescending(s => s.TotalSpent)
    .ToList();
```

## 10. Error Handling

### 10.1 Exception Strategy

- Throw exceptions for **exceptional/unexpected** failures.
- Use **Result patterns** (`Result<T>`) for expected, domain-level failures (validation, business rules).
- Never use exceptions for control flow.

### 10.2 Exception Types

- Throw `ArgumentException` / `ArgumentNullException` for bad inputs.
- Throw `InvalidOperationException` for invalid object state.
- Create custom domain exceptions that inherit from `Exception` for domain-specific failures.
- Always include meaningful messages.

```csharp
public sealed class OrderNotFoundException(Guid orderId)
    : Exception($"Order with ID '{orderId}' was not found.")
{
    public Guid OrderId { get; } = orderId;
}
```

### 10.3 Catch Clauses

- Catch the most specific exception type.
- Never catch `Exception` silently — always log or rethrow.
- Use `when` filters for conditional catches.
- Rethrow with `throw;`, never `throw ex;`.

```csharp
try
{
    await SendEmailAsync(notification, ct);
}
catch (SmtpException ex) when (ex.StatusCode == SmtpStatusCode.MailboxBusy)
{
    _logger.LogWarning(ex, "Mailbox busy for {Recipient}, will retry", notification.To);
    await ScheduleRetryAsync(notification, ct);
}
```

### 10.4 Result Pattern (for Expected Failures)

```csharp
public sealed record Result<T>
{
    public T? Value { get; }
    public string? Error { get; }
    public bool IsSuccess => Error is null;

    private Result(T value) => Value = value;
    private Result(string error) => Error = error;

    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(string error) => new(error);
}
```

## 11. Dependency Injection

### 11.1 Constructor Injection Only

- Inject all dependencies through constructors. Never use service locator (`IServiceProvider.GetService` inside business logic).
- Register services with the narrowest appropriate lifetime: `Transient` → `Scoped` → `Singleton`.
- Design services to be stateless or thread-safe when registered as `Singleton`.

### 11.2 Interface Segregation

- Define focused interfaces: `IOrderReader`, `IOrderWriter` over a monolithic `IOrderRepository` — unless both are always used together.
- Accept the most abstract type that satisfies the need: `IReadOnlyList<T>` over `List<T>`, `IEnumerable<T>` over `IReadOnlyList<T>`.

### 11.3 Registration

```csharp
// ✅ Group registrations logically
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddOrderModule(this IServiceCollection services)
    {
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddTransient<IOrderValidator, OrderValidator>();
        return services;
    }
}
```

## 12. Logging

- Use **structured logging** with `ILogger<T>` and message templates. Never interpolate strings into log messages.
- Use appropriate log levels: `Trace` → `Debug` → `Information` → `Warning` → `Error` → `Critical`.
- Include correlation identifiers and context in log entries.

```csharp
// ✅ Structured logging with semantic parameters
_logger.LogInformation("Order {OrderId} placed by {CustomerId} for {Total:C2}",
    order.Id, order.CustomerId, order.Total);

// ❌ Never interpolate
_logger.LogInformation($"Order {order.Id} placed by {order.CustomerId}");
```

Use `LoggerMessage.Define` or the `[LoggerMessage]` source generator for high-performance logging in hot paths:

```csharp
public static partial class LogMessages
{
    [LoggerMessage(Level = LogLevel.Information, Message = "Order {OrderId} processed in {ElapsedMs}ms")]
    public static partial void OrderProcessed(ILogger logger, Guid orderId, long elapsedMs);
}
```

## 13. XML Documentation

### 13.1 When to Document

- All public and protected API members.
- All interfaces and their members.
- Any internal member whose purpose is non-obvious.

### 13.2 Documentation Style

```csharp
/// <summary>
/// Calculates the total price for an order, applying applicable discounts.
/// </summary>
/// <param name="order">The order to calculate. Must contain at least one line item.</param>
/// <param name="discountCode">
/// An optional discount code. Pass <see langword="null"/> if no discount applies.
/// </param>
/// <returns>The total price after discounts, guaranteed to be non-negative.</returns>
/// <exception cref="ArgumentException">
/// Thrown when <paramref name="order"/> contains no line items.
/// </exception>
public decimal CalculateTotal(Order order, string? discountCode = null)
```

- Write `<summary>` in third-person declarative: "Calculates..." not "Calculate..." or "This method calculates..."
- Document all parameters, return values, and thrown exceptions.
- Use `<see cref=""/>` for cross-references, `<see langword=""/>` for keywords.

## 14. Formatting & Style

### 14.1 Braces & Indentation

- Use **Allman style** braces (opening brace on new line) — the C# convention.
- Use 4-space indentation, never tabs.
- Don't use braces for `if`, `else`, `for`, `foreach`, `while` for single-line bodies.

### 14.2 Line Length & Wrapping

- Target ≤ 120 characters per line.
- Wrap method parameters, LINQ chains, and ternary expressions at logical breakpoints.
- Align continuation lines with the relevant start point.

### 14.3 Comments

- **Prefer self-documenting code** over comments. If a comment is needed, it should explain **why**, not **what**.
- Use `//` for inline comments; reserve `/* */` for disabling code blocks temporarily.
- Use `// TODO:` for tracked technical debt with a linked issue number when possible.
- Never commit commented-out code. That's what version control is for.

## 15. Performance Awareness

These rules are not about premature optimization. They represent patterns that are as readable as their alternatives but have better runtime characteristics.

### 15.1 String Operations

```csharp
// ✅ Use StringComparison for all comparisons
name.Equals("admin", StringComparison.OrdinalIgnoreCase);
path.StartsWith("/api", StringComparison.Ordinal);

// ✅ Use StringBuilder for many concatenations in loops
var sb = new StringBuilder();
foreach (var item in items)
{
    sb.AppendLine(item.Name);
}

// ✅ Use string.Create or interpolated string handlers for high-perf scenarios
```

### 15.2 Collections

```csharp
// ✅ Specify capacity when known
var results = new List<Order>(expectedCount);
var lookup = new Dictionary<Guid, Order>(orders.Count);

// ✅ Use IReadOnlyList<T> / IReadOnlyDictionary<TK,TV> for return types
public IReadOnlyList<Order> GetOrders() => _orders.AsReadOnly();

// ✅ Use FrozenSet / FrozenDictionary for read-heavy lookup tables
private static readonly FrozenSet<string> AllowedRoles = 
    new[] { "Admin", "Manager", "User" }.ToFrozenSet(StringComparer.OrdinalIgnoreCase);

// ✅ Prefer HashSet<T> for membership tests over List<T>.Contains
```

### 15.3 Span & Memory

For performance-critical code, prefer `Span<T>` and `ReadOnlySpan<T>` over allocating arrays or substrings.

```csharp
// ✅ Avoid allocation for substring operations
public static bool IsValidHeader(ReadOnlySpan<char> header)
{
    return header.StartsWith("X-Custom-", StringComparison.Ordinal);
}
```

### 15.4 Cancellation

- Always flow `CancellationToken` through the entire async call chain.
- Check `ct.ThrowIfCancellationRequested()` in CPU-bound loops.

## 16. Testing Conventions

### 16.1 Test Naming

Use the pattern: `MethodName_Scenario_ExpectedResult`

```csharp
[Fact]
public async Task GetOrderAsync_WithValidId_ReturnsOrder()

[Fact]
public async Task GetOrderAsync_WithNonExistentId_ThrowsNotFoundException()

[Theory]
[InlineData(0)]
[InlineData(-1)]
public async Task GetOrderAsync_WithInvalidId_ThrowsArgumentException(int id)
```

### 16.2 Test Structure (Arrange–Act–Assert)

```csharp
[Fact]
public async Task CalculateTotal_WithGoldCustomerDiscount_AppliesTwentyPercent()
{
    // Arrange
    var order = new Order { Items = [new LineItem("Widget", 100m, 2)] };
    var customer = new Customer { LoyaltyTier = Tier.Gold, YearsActive = 6 };
    var sut = new PricingService();

    // Act
    var total = sut.CalculateTotal(order, customer);

    // Assert
    Assert.Equal(160m, total);
}
```

### 16.3 Test Guidelines

- One logical assertion per test (multiple `Assert` calls are fine if they validate one concept).
- Use `sut` (system under test) for the object being tested.
- Never test private methods directly — test through public behavior.
- Use fakes/stubs over mocks when possible; prefer in-memory implementations.
- Tests are production code: apply the same naming, formatting, and quality standards.

## 17. Security Defaults

- Never hardcode secrets, connection strings, or API keys. Use `IConfiguration`, `IOptions<T>`, or secret managers.
- Always parameterize SQL queries — never concatenate user input.
- Validate and sanitize all external input at the API boundary.
- Use `SecureString` sparingly and only when truly needed; prefer short-lived scoped variables for sensitive data.
- Apply `[Authorize]` explicitly; never rely on global filters alone for critical endpoints.

## 18. Common Anti-Patterns to Reject

| Anti-Pattern | Why | Do Instead |
|---|---|---|
| God class (>300 lines) | Violates SRP, untestable | Split into focused collaborators |
| Service locator | Hides dependencies, untestable | Constructor injection |
| `async void` | Unobservable exceptions | `async Task` (except event handlers) |
| Returning `null` from collections | Forces null checks everywhere | Return empty collection |
| `catch (Exception) { }` | Swallows bugs silently | Log and rethrow, or handle specifically |
| Magic strings/numbers | Fragile, no compiler safety | Constants, enums, strongly-typed config |
| Premature `IEnumerable<T>` | Multiple enumeration bugs | Materialize with `ToList()` or use `IReadOnlyList<T>` |
| Mutable static state | Thread safety nightmares | DI-managed singletons with proper synchronization |
| `#region` blocks | Hides code smells | Refactor the class instead |
| `DateTime.Now` in logic | Untestable | Inject `TimeProvider` |

## 19. Quick Reference Checklist

Before finalizing any code, verify:

- [ ] All public members have XML documentation
- [ ] All async methods accept and forward `CancellationToken`
- [ ] Guard clauses validate all public method parameters
- [ ] `IDisposable` / `IAsyncDisposable` is implemented where resources are held
