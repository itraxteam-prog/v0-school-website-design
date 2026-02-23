/**
 * Example Test Cases for Node.js Auth System
 */

/*
import { hashPassword, verifyPassword } from "@/lib/utils/auth-crypto";
import { loginSchema } from "@/lib/validations/auth";

describe("Node.js Auth System", () => {
  it("should hash and verify passwords using bcryptjs", async () => {
    const password = "password123";
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("should validate Zod schema", () => {
    expect(loginSchema.safeParse({ email: "valid@mail.com", password: "p" }).success).toBe(false);
  });
});
*/

/**
 * Test Scenarios:
 * 1. ADMIN Login -> Redirects to /portal/admin
 * 2. TEACHER Login -> Redirects to /portal/teacher
 * 3. STUDENT Login -> Redirects to /portal/student
 * 4. SUSPENDED Account -> Shows "ACCOUNT_SUSPENDED" error message
 * 5. WRONG Password -> Shows "Invalid credentials"
 * 6. EMPTY Fields -> Triggers Zod validation errors on frontend
 */

export const runtime = "nodejs";

export async function GET() {
  return new Response(JSON.stringify({ status: "tests defined in source" }), {
    headers: { "Content-Type": "application/json" },
  });
}
