import request from "supertest";
import app from "../app";
import { connectTestDb, disconnectTestDb, clearTestDb } from "./db";
import { seedRoles, createWorkspaceWithOwner, createMemberInWorkspace } from "./fixtures";
import { Roles } from "../enums/role.enum";

const BASE = "/api/v1";

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

describe("multi-tenant workspace isolation", () => {
  it("blocks a user of workspace B from listing workspace A's projects", async () => {
    const { workspace: workspaceA, token: tokenA } = await createWorkspaceWithOwner("ownerA@test.com");
    const { token: tokenB } = await createWorkspaceWithOwner("ownerB@test.com");

    await request(app)
      .post(`${BASE}/project/workspace/${workspaceA._id}/create`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ name: "Workspace A Project" })
      .expect(201);

    const res = await request(app)
      .get(`${BASE}/project/workspace/${workspaceA._id}/all`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/not a member/i);
  });

  it("blocks a user of workspace B from fetching a specific project inside workspace A", async () => {
    const { workspace: workspaceA, token: tokenA } = await createWorkspaceWithOwner("ownerA2@test.com");
    const { token: tokenB } = await createWorkspaceWithOwner("ownerB2@test.com");

    const createRes = await request(app)
      .post(`${BASE}/project/workspace/${workspaceA._id}/create`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ name: "Workspace A Project" })
      .expect(201);

    const projectId = createRes.body.project._id;

    const res = await request(app)
      .get(`${BASE}/project/${projectId}/workspace/${workspaceA._id}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(401);
  });

  it("allows the owning workspace's member to fetch the same project", async () => {
    const { workspace: workspaceA, token: tokenA } = await createWorkspaceWithOwner("ownerA3@test.com");

    const createRes = await request(app)
      .post(`${BASE}/project/workspace/${workspaceA._id}/create`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ name: "Workspace A Project" })
      .expect(201);

    const projectId = createRes.body.project._id;

    const res = await request(app)
      .get(`${BASE}/project/${projectId}/workspace/${workspaceA._id}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.project._id).toBe(projectId);
  });

  it("rejects requests with no JWT at all", async () => {
    const { workspace } = await createWorkspaceWithOwner("ownerA4@test.com");

    const res = await request(app).get(`${BASE}/project/workspace/${workspace._id}/all`);

    expect(res.status).toBe(401);
  });
});

describe("server-side RBAC enforcement", () => {
  it("blocks a MEMBER-role user from creating a project (lacks CREATE_PROJECT)", async () => {
    const { workspace } = await createWorkspaceWithOwner("owner@test.com");
    const { token: memberToken } = await createMemberInWorkspace(
      "member@test.com",
      String(workspace._id),
      Roles.MEMBER
    );

    const res = await request(app)
      .post(`${BASE}/project/workspace/${workspace._id}/create`)
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ name: "Should not be created" });

    expect(res.status).toBe(403);
  });

  it("allows a MEMBER-role user to view but not delete a project", async () => {
    const { workspace, token: ownerToken } = await createWorkspaceWithOwner("owner2@test.com");
    const { token: memberToken } = await createMemberInWorkspace(
      "member2@test.com",
      String(workspace._id),
      Roles.MEMBER
    );

    const createRes = await request(app)
      .post(`${BASE}/project/workspace/${workspace._id}/create`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Owner's Project" })
      .expect(201);
    const projectId = createRes.body.project._id;

    const viewRes = await request(app)
      .get(`${BASE}/project/${projectId}/workspace/${workspace._id}`)
      .set("Authorization", `Bearer ${memberToken}`);
    expect(viewRes.status).toBe(200);

    const deleteRes = await request(app)
      .delete(`${BASE}/project/${projectId}/workspace/${workspace._id}/delete`)
      .set("Authorization", `Bearer ${memberToken}`);
    expect(deleteRes.status).toBe(403);
  });

  it("allows the OWNER to delete the project the MEMBER could not", async () => {
    const { workspace, token: ownerToken } = await createWorkspaceWithOwner("owner3@test.com");

    const createRes = await request(app)
      .post(`${BASE}/project/workspace/${workspace._id}/create`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "Owner's Project" })
      .expect(201);
    const projectId = createRes.body.project._id;

    const deleteRes = await request(app)
      .delete(`${BASE}/project/${projectId}/workspace/${workspace._id}/delete`)
      .set("Authorization", `Bearer ${ownerToken}`);
    expect(deleteRes.status).toBe(200);
  });
});
