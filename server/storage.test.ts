import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Storage Drive Router", () => {
  it("should list drives for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const drives = await caller.storage.listDrives();
    
    expect(drives).toBeDefined();
    expect(Array.isArray(drives)).toBe(true);
  });

  it("should list files for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const files = await caller.storage.listFiles({ driveId: 1 });
    
    expect(files).toBeDefined();
    expect(Array.isArray(files)).toBe(true);
  });

  it("should list secrets for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const secrets = await caller.storage.listSecrets();
    
    expect(secrets).toBeDefined();
    expect(Array.isArray(secrets)).toBe(true);
  });
});

describe("Password Manager Router", () => {
  it("should list passwords for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const passwords = await caller.passwords.listPasswords();
    
    expect(passwords).toBeDefined();
    expect(Array.isArray(passwords)).toBe(true);
  });

  it("should list password folders for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const folders = await caller.passwords.listFolders();
    
    expect(folders).toBeDefined();
    expect(Array.isArray(folders)).toBe(true);
  });

  it("should list TOTP tokens for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const tokens = await caller.passwords.listTotpTokens();
    
    expect(tokens).toBeDefined();
    expect(Array.isArray(tokens)).toBe(true);
  });

  it("should get security stats for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.passwords.getSecurityStats();
    
    expect(stats).toBeDefined();
    expect(typeof stats.totalPasswords).toBe("number");
    expect(typeof stats.weakPasswords).toBe("number");
    expect(typeof stats.totpEnabled).toBe("number");
    expect(typeof stats.securityScore).toBe("number");
  });
});
