import { connectTestDb, disconnectTestDb, clearTestDb } from "./db";
import { seedRoles, createWorkspaceWithOwner } from "./fixtures";
import {
  registerUserService,
  verifyUserService,
} from "../services/auth.service";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/appError";
import { Roles } from "../enums/role.enum";
import WorkspaceModel from "../models/workspace.model";

beforeAll(async () => {
  await connectTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
  await seedRoles();
});

describe("registerUserService", () => {
  it("creates a user, an owned workspace, and an OWNER membership", async () => {
    const { userId, workspaceId } = await registerUserService({
      email: "new@test.com",
      name: "New User",
      password: "password123",
    });

    const { role } = await getMemberRoleInWorkspace(String(userId), String(workspaceId));
    expect(role).toBe(Roles.OWNER);

    const workspace = await WorkspaceModel.findById(workspaceId);
    expect(workspace?.owner.toString()).toBe(String(userId));
  });

  it("rejects a duplicate email", async () => {
    await registerUserService({
      email: "dupe@test.com",
      name: "First",
      password: "password123",
    });

    await expect(
      registerUserService({
        email: "dupe@test.com",
        name: "Second",
        password: "password456",
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe("verifyUserService", () => {
  it("succeeds with the correct password", async () => {
    await registerUserService({
      email: "login@test.com",
      name: "Login User",
      password: "correct-password",
    });

    const user = await verifyUserService({
      email: "login@test.com",
      password: "correct-password",
    });

    expect(user.email).toBe("login@test.com");
  });

  it("rejects an incorrect password", async () => {
    await registerUserService({
      email: "login2@test.com",
      name: "Login User",
      password: "correct-password",
    });

    await expect(
      verifyUserService({ email: "login2@test.com", password: "wrong-password" })
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("rejects a nonexistent email", async () => {
    await expect(
      verifyUserService({ email: "nobody@test.com", password: "whatever" })
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe("getMemberRoleInWorkspace (tenant membership check)", () => {
  it("throws for a user who is not a member of the workspace", async () => {
    const { workspace } = await createWorkspaceWithOwner("ownerX@test.com");
    const outsider = await registerUserService({
      email: "outsider@test.com",
      name: "Outsider",
      password: "password123",
    });

    await expect(
      getMemberRoleInWorkspace(String(outsider.userId), String(workspace._id))
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("throws NotFoundException for a workspace that does not exist", async () => {
    const { owner } = await createWorkspaceWithOwner("ownerY@test.com");
    const fakeWorkspaceId = "000000000000000000000000";

    await expect(
      getMemberRoleInWorkspace(String(owner._id), fakeWorkspaceId)
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
