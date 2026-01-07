import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return { ctx };
}

describe("notes router", () => {
  it("should have notes.list procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    // Test that the procedure exists and can be called
    // It will return empty array since no DB in test
    const result = await caller.notes.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("crm router", () => {
  it("should have crm.contacts.list procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.crm.contacts.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should have crm.companies.list procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.crm.companies.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should have crm.deals.list procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.crm.deals.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("projects router", () => {
  it("should have projects.list procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.projects.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should have projects.tasks.list procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.projects.tasks.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("content router", () => {
  it("should have content.list procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.content.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("emails router", () => {
  it("should have emails.list procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.emails.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("code router", () => {
  it("should have code.files.list procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.code.files.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should execute terminal commands", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.code.terminal({ command: "help" });
    expect(result.output).toBeDefined();
    expect(typeof result.output).toBe("string");
  });

  it("should handle echo command", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.code.terminal({ command: "echo Hello World" });
    expect(result.output).toBe("Hello World");
  });
});

describe("activities router", () => {
  it("should have activities.list procedure", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.activities.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
