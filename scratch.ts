import mongoose from "mongoose";
import RoleModel from "../apps/server/src/models/roles-permission.model";

const checkRoles = async () => {
  await mongoose.connect("mongodb+srv://agupta9042_db_user:ktjFWCvTBYaLBX5S@cluster0.7flo4qw.mongodb.net/?appName=Cluster0");
  const roles = await RoleModel.find({});
  console.log("Roles found:", roles.map(r => r.name));
  process.exit(0);
};
checkRoles();
