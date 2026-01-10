import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";

// This is your JSON object
const RBAC_DATA: any = {
  USER: {
    description: "Default role for all registered users",
    inherits: [],
    permissions: [
      {
        code: "USR-U1",
        name: "profile_update",
        label: "Update Profile",
        description: "Allows editing own profile details",
      },
      {
        code: "PST-A1",
        name: "post_create",
        label: "Create Post",
        description: "Allows creating a new post",
      },
      {
        code: "PST-B2",
        name: "post_update_own",
        label: "Edit Own Post",
        description: "Allows editing posts created by the user",
      },
      {
        code: "PST-C3",
        name: "post_delete_own",
        label: "Delete Own Post",
        description: "Allows deleting posts created by the user",
      },
      {
        code: "CMT-A1",
        name: "comment_create",
        label: "Create Comment",
        description: "Allows commenting on posts",
      },
      {
        code: "CMT-B2",
        name: "comment_delete_own",
        label: "Delete Own Comment",
        description: "Allows deleting own comments",
      },
      {
        code: "FOL-A1",
        name: "follow_user",
        label: "Follow User",
        description: "Allows following other users",
      },
      {
        code: "MSG-A1",
        name: "message_send",
        label: "Send Message",
        description: "Allows sending private messages",
      },
      {
        code: "STR-A1",
        name: "story_create",
        label: "Create Story",
        description: "Allows creating stories",
      },
      {
        code: "RPT-A1",
        name: "report_content",
        label: "Report Content",
        description: "Allows reporting inappropriate content",
      },
    ],
  },
  MODERATOR: {
    description: "Content moderation and report handling",
    inherits: ["USER"],
    permissions: [
      {
        code: "RPT-X1",
        name: "report_review",
        label: "Review Reports",
        description: "Allows reviewing and resolving reported content",
      },
      {
        code: "PST-X2",
        name: "post_remove_any",
        label: "Remove Any Post",
        description: "Allows removing posts created by any user",
      },
      {
        code: "CMT-X2",
        name: "comment_remove_any",
        label: "Remove Any Comment",
        description: "Allows removing comments from any user",
      },
      {
        code: "STR-X2",
        name: "story_remove_any",
        label: "Remove Any Story",
        description: "Allows removing stories from any user",
      },
      {
        code: "USR-S1",
        name: "user_suspend",
        label: "Suspend User",
        description: "Allows temporarily suspending a user",
      },
      {
        code: "USR-V1",
        name: "user_view_details",
        label: "View User Details",
        description: "Allows viewing non-public user profile data",
      },
    ],
  },
  ADMIN: {
    description: "Platform administrators",
    inherits: ["MODERATOR"],
    permissions: [
      {
        code: "USR-Z1",
        name: "user_ban",
        label: "Ban User",
        description: "Allows permanently banning a user",
      },
      {
        code: "USR-Z2",
        name: "user_assign_role",
        label: "Assign Role",
        description: "Allows assigning roles to users",
      },
      {
        code: "COM-Z1",
        name: "community_manage",
        label: "Manage Communities",
        description: "Allows managing and deleting communities",
      },
      {
        code: "LOG-Z1",
        name: "auditlog_view",
        label: "View Audit Logs",
        description: "Allows viewing system audit logs",
      },
      {
        code: "SYS-S1",
        name: "settings_manage",
        label: "Manage System Settings",
        description: "Allows changing global platform configurations",
      },
    ],
  },
  SUPER_ADMIN: {
    description: "Full system access & Developer level overrides",
    inherits: ["ADMIN"],
    permissions: [
      {
        code: "SYS-ALL",
        name: "system_all",
        label: "Full System Access",
        description: "Grants unrestricted access to all system actions",
      },
      {
        code: "DB-M1",
        name: "database_manage",
        label: "Manage Database",
        description: "Direct access to sensitive data management",
      },
    ],
  },
};

async function main() {
  console.log("🚀 Starting RBAC Seeding...");

  // 1. Create All Unique Permissions
  const permissionMap: Record<string, string> = {}; // { "USR-U1": "uuid" }

  for (const roleKey in RBAC_DATA) {
    for (const perm of RBAC_DATA[roleKey].permissions) {
      const createdPerm = await prisma.permission.upsert({
        where: { code: perm.code },
        update: {
          name: perm.name,
          label: perm.label,
          description: perm.description,
        },
        create: perm,
      });
      permissionMap[perm.code] = createdPerm.id;
    }
  }

  // Helper function to recursively get inherited permissions
  const getPermissionsForRole = (roleKey: string): string[] => {
    let codes = RBAC_DATA[roleKey].permissions.map(
      (p: any) => p.code
    ) as string[];

    for (const parentRole of RBAC_DATA[roleKey].inherits) {
      codes = [...codes, ...getPermissionsForRole(parentRole)];
    }

    return [...new Set(codes)]; // Remove duplicates
  };

  // 2. Create Roles and Attach Permissions
  for (const roleName in RBAC_DATA) {
    const allCodes = getPermissionsForRole(roleName);
    const permissionIds = allCodes.map((code) => permissionMap[code]);

    // Create or Update Role
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: { description: RBAC_DATA[roleName].description },
      create: {
        name: roleName,
        description: RBAC_DATA[roleName].description,
      },
    });

    // Clean up existing permissions for this role to prevent duplicates before re-adding
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });

    // Link all permissions (Own + Inherited)
    await prisma.rolePermission.createMany({
      data: permissionIds.map((pId) => ({
        roleId: role.id,
        permissionId: pId,
      })),
    });

    console.log(
      `✅ Role [${roleName}] seeded with ${permissionIds.length} permissions.`
    );
  }

  // 3. Create initial Super Admin User
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const superAdminRole = await prisma.role.findUnique({
    where: { name: "SUPER_ADMIN" },
  });

  if (superAdminRole) {
    await prisma.user.upsert({
      where: { email: "admin@ynov.com" },
      update: {},
      create: {
        email: "admin@ynov.com",
        password: adminPassword,
        isEmailVerified: true,
        roleId: superAdminRole.id,
        profile: {
          create: {
            username: "admin",
            fullName: "Super Admin",
          },
        },
      },
    });
    console.log("👤 Default Super Admin created: admin@ynov.com / Admin123!");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
