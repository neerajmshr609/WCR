export type Permission = 'org_admin' | 'consult' | 'blog' | 'org_member';

export class Permissions {
  // Temp dev solution; All users have all roles
  constructor(
    private readonly _permission: Permission[],
    private readonly _isAdmin: boolean = false,
  ) {
  }

  isClient(): boolean {
    return !this._permission.length;
  }

  isCounselor(): boolean {
    return this._permission.includes('consult');
  }

  isAdmin(): boolean {
    return this._isAdmin;
  }

  isOrganizationAdmin(): boolean {
    return this._permission.includes('org_admin');
  }

  canEditBlog(): boolean {
    return this._permission.includes('blog');
  }
}

export const permissionsFactory = (
  permissions?: Permission[] | Permissions,
  isAdmin?: boolean,
) => {
  if (permissions instanceof Permissions) {
    return permissions;
  } else if (Array.isArray(permissions)) {
    return new Permissions(permissions, isAdmin);
  } else {
    return new Permissions([], isAdmin);
  }
};
