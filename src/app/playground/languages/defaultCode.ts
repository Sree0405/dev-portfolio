const JAVASCRIPT_DEFAULT = `// JavaScript Playground — ES2023
const greet = (name) => \`Hello, \${name}!\`;

console.log(greet("Developer"));

const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "editor" },
];

console.table(users);

console.time("fibonacci");
const fib = (n) => (n <= 1 ? n : fib(n - 1) + fib(n - 2));
console.log("fib(10) =", fib(10));
console.timeEnd("fibonacci");
`;

const TYPESCRIPT_DEFAULT = `// TypeScript Playground
interface User {
  id: number;
  name: string;
  role: "admin" | "editor" | "viewer";
}

const users: User[] = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "editor" },
];

const greet = (user: User): string => \`Hello, \${user.name} (\${user.role})\`;

users.forEach((user) => console.log(greet(user)));
console.table(users);

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

const divide = (a: number, b: number): Result<number> =>
  b === 0 ? { ok: false, error: "Division by zero" } : { ok: true, value: a / b };

console.log(divide(10, 2));
`;

export { JAVASCRIPT_DEFAULT, TYPESCRIPT_DEFAULT };
