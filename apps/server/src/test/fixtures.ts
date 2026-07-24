import RoleModel from "../models/roles-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import MemberModel from "../models/member.model";
import { Roles, RoleType } from "../enums/role.enum";
import { RolePermissions } from "../utils/role-permission";
import { signJwtToken } from "../utils/jwt";

export const seedRoles = async () => {
  for (const roleName in RolePermissions) {
    const role = roleName as RoleType;
    const existingRole = await RoleModel.findOne({ name: role });
    if (!existingRole) {
      await new RoleModel({ name: role, permissions: RolePermissions[role] }).save();
    }
  }
};

export const createMemberInWorkspace = async (
  email: string,
  workspaceId: string,
  roleName: RoleType
) => {
  const user = await UserModel.create({ name: email, email });
  const role = await RoleModel.findOne({ name: roleName });
  const member = await MemberModel.create({
    userId: user._id,
    workspaceId,
    role: role!._id,
  });
  const token = signJwtToken({ userId: user._id });
  return { user, member, token };
};

export const createWorkspaceWithOwner = async (email: string) => {
  const owner = await UserModel.create({ name: email, email });
  const workspace = await WorkspaceModel.create({
    name: `${email}'s Workspace`,
    owner: owner._id,
  });
  const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });
  await MemberModel.create({
    userId: owner._id,
    workspaceId: workspace._id,
    role: ownerRole!._id,
  });
  const token = signJwtToken({ userId: owner._id });
  return { owner, workspace, token };
};
