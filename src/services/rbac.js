// Role-Based Access Control (RBAC) Service
// Defines roles, permissions, and access control logic

export const ROLES = {
  SUPER_ADMIN: 'superadmin',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

export const PERMISSIONS = {
  // Office Management
  CREATE_OFFICE: 'create_office',
  EDIT_OFFICE: 'edit_office',
  DELETE_OFFICE: 'delete_office',
  VIEW_OFFICE: 'view_office',
  MANAGE_OFFICE_USERS: 'manage_office_users',

  // User Management
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  VIEW_USER: 'view_user',
  MANAGE_ROLES: 'manage_roles',

  // Project Management
  CREATE_PROJECT: 'create_project',
  EDIT_PROJECT: 'edit_project',
  DELETE_PROJECT: 'delete_project',
  VIEW_PROJECT: 'view_project',
  VIEW_ALL_PROJECTS: 'view_all_projects',

  // Project Type Management
  CREATE_PROJECT_TYPE: 'create_project_type',
  EDIT_PROJECT_TYPE: 'edit_project_type',
  DELETE_PROJECT_TYPE: 'delete_project_type',
  VIEW_PROJECT_TYPE: 'view_project_type',

  // Employee Management
  CREATE_EMPLOYEE: 'create_employee',
  EDIT_EMPLOYEE: 'edit_employee',
  DELETE_EMPLOYEE: 'delete_employee',
  VIEW_EMPLOYEE: 'view_employee',

  // Reports & Print
  GENERATE_REPORTS: 'generate_reports',
  PRINT_DOCUMENTS: 'print_documents',
  EXPORT_DATA: 'export_data',
  EXPORT_EXCEL: 'export_excel',

  // System Management
  MANAGE_SYSTEM_SETTINGS: 'manage_system_settings',
  VIEW_AUDIT_LOG: 'view_audit_log',
  BACKUP_DATA: 'backup_data'
};

/**
 * Role Permission Matrix
 * Defines which permissions each role has
 */
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // All permissions for super admin
    PERMISSIONS.CREATE_OFFICE,
    PERMISSIONS.EDIT_OFFICE,
    PERMISSIONS.DELETE_OFFICE,
    PERMISSIONS.VIEW_OFFICE,
    PERMISSIONS.MANAGE_OFFICE_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.VIEW_USER,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.VIEW_ALL_PROJECTS,
    PERMISSIONS.CREATE_PROJECT_TYPE,
    PERMISSIONS.EDIT_PROJECT_TYPE,
    PERMISSIONS.DELETE_PROJECT_TYPE,
    PERMISSIONS.VIEW_PROJECT_TYPE,
    PERMISSIONS.CREATE_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.DELETE_EMPLOYEE,
    PERMISSIONS.VIEW_EMPLOYEE,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.PRINT_DOCUMENTS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.EXPORT_EXCEL,
    PERMISSIONS.MANAGE_SYSTEM_SETTINGS,
    PERMISSIONS.VIEW_AUDIT_LOG,
    PERMISSIONS.BACKUP_DATA
  ],

  [ROLES.ADMIN]: [
    // Office Admin - can manage office and its users
    PERMISSIONS.VIEW_OFFICE,
    PERMISSIONS.EDIT_OFFICE,
    PERMISSIONS.MANAGE_OFFICE_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.VIEW_USER,
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.VIEW_PROJECT_TYPE,
    PERMISSIONS.CREATE_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.DELETE_EMPLOYEE,
    PERMISSIONS.VIEW_EMPLOYEE,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.PRINT_DOCUMENTS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.EXPORT_EXCEL
  ],

  [ROLES.EDITOR]: [
    // Editor - can create and edit projects
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.VIEW_PROJECT_TYPE,
    PERMISSIONS.VIEW_EMPLOYEE,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.PRINT_DOCUMENTS,
    PERMISSIONS.EXPORT_DATA
  ],

  [ROLES.VIEWER]: [
    // Viewer - read-only access
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.VIEW_PROJECT_TYPE,
    PERMISSIONS.VIEW_EMPLOYEE,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.PRINT_DOCUMENTS
  ]
};

/**
 * Check if user has a specific permission
 * @param {string} userRole - User's role
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return false;
  }
  return ROLE_PERMISSIONS[userRole].includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @param {string} userRole - User's role
 * @param {array} permissions - Array of permissions to check
 * @returns {boolean} - True if user has at least one permission
 */
export const hasAnyPermission = (userRole, permissions = []) => {
  if (!Array.isArray(permissions)) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
};

/**
 * Check if user has all specified permissions
 * @param {string} userRole - User's role
 * @param {array} permissions - Array of permissions to check
 * @returns {boolean} - True if user has all permissions
 */
export const hasAllPermissions = (userRole, permissions = []) => {
  if (!Array.isArray(permissions)) return false;
  return permissions.every(permission => hasPermission(userRole, permission));
};

/**
 * Get all permissions for a specific role
 * @param {string} role - Role name
 * @returns {array} - Array of permissions
 */
export const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if user can access office data
 * Super admin can access all offices
 * Others can only access their own office
 * @param {object} user - User object with role and officeId
 * @param {string} officeId - Office ID to check access
 * @returns {boolean}
 */
export const canAccessOffice = (user, officeId) => {
  if (!user || !officeId) return false;

  // Super admin can access all offices
  if (user.role === ROLES.SUPER_ADMIN) {
    return true;
  }

  // Others can only access their own office
  return user.officeId === officeId;
};

/**
 * Check if user can view all projects across offices
 * @param {object} user - User object
 * @returns {boolean}
 */
export const canViewAllProjects = (user) => {
  if (!user) return false;
  return user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN;
};

/**
 * Get accessible offices for user
 * @param {object} user - User object
 * @param {array} allOffices - Array of all offices
 * @returns {array} - Filtered offices
 */
export const getAccessibleOffices = (user, allOffices = []) => {
  if (!user || !Array.isArray(allOffices)) return [];

  if (user.role === ROLES.SUPER_ADMIN) {
    return allOffices;
  }

  // Return only user's office
  return allOffices.filter(office => office.id === user.officeId);
};

/**
 * Filter projects based on user access
 * @param {object} user - User object
 * @param {array} projects - Array of projects
 * @returns {array} - Filtered projects
 */
export const filterProjectsByUserAccess = (user, projects = []) => {
  if (!user || !Array.isArray(projects)) return [];

  if (user.role === ROLES.SUPER_ADMIN) {
    return projects;
  }

  // Return only projects from user's office
  return projects.filter(project => project.officeId === user.officeId);
};

/**
 * Filter employees based on user access
 * @param {object} user - User object
 * @param {array} employees - Array of employees
 * @returns {array} - Filtered employees
 */
export const filterEmployeesByUserAccess = (user, employees = []) => {
  if (!user || !Array.isArray(employees)) return [];

  if (user.role === ROLES.SUPER_ADMIN) {
    return employees;
  }

  // Return only employees from user's office
  return employees.filter(emp => emp.officeId === user.officeId);
};

/**
 * Check if user can edit a specific project
 * @param {object} user - User object
 * @param {object} project - Project object
 * @returns {boolean}
 */
export const canEditProject = (user, project) => {
  if (!user || !project) return false;

  // Super admin can edit any project
  if (user.role === ROLES.SUPER_ADMIN) {
    return true;
  }

  // Admin can edit projects in their office
  if (user.role === ROLES.ADMIN && user.officeId === project.officeId) {
    return true;
  }

  // Editor can edit projects in their office
  if (user.role === ROLES.EDITOR && user.officeId === project.officeId) {
    return true;
  }

  return false;
};

/**
 * Check if user can delete a specific project
 * @param {object} user - User object
 * @param {object} project - Project object
 * @returns {boolean}
 */
export const canDeleteProject = (user, project) => {
  if (!user || !project) return false;

  // Super admin can delete any project
  if (user.role === ROLES.SUPER_ADMIN) {
    return true;
  }

  // Admin can delete projects in their office
  if (user.role === ROLES.ADMIN && user.officeId === project.officeId) {
    return true;
  }

  // Editor can delete projects in their office (if allowed)
  if (user.role === ROLES.EDITOR && user.officeId === project.officeId) {
    return hasPermission(user.role, PERMISSIONS.DELETE_PROJECT);
  }

  return false;
};

/**
 * Get role display name
 * @param {string} role - Role name
 * @returns {string} - Display name
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.ADMIN]: 'Office Admin',
    [ROLES.EDITOR]: 'Editor',
    [ROLES.VIEWER]: 'Viewer'
  };
  return roleNames[role] || role;
};

/**
 * Get role level (for hierarchy)
 * Higher number = more permissions
 * @param {string} role - Role name
 * @returns {number}
 */
export const getRoleLevel = (role) => {
  const levels = {
    [ROLES.SUPER_ADMIN]: 4,
    [ROLES.ADMIN]: 3,
    [ROLES.EDITOR]: 2,
    [ROLES.VIEWER]: 1
  };
  return levels[role] || 0;
};

/**
 * Check if user role is higher than another role
 * @param {string} userRole - User's role
 * @param {string} compareRole - Role to compare
 * @returns {boolean}
 */
export const isRoleHigherThan = (userRole, compareRole) => {
  return getRoleLevel(userRole) > getRoleLevel(compareRole);
};

/**
 * Validate if user can assign a role to another user
 * @param {object} adminUser - Admin user object
 * @param {string} roleToAssign - Role to assign
 * @returns {boolean}
 */
export const canAssignRole = (adminUser, roleToAssign) => {
  if (!adminUser) return false;

  // Super admin can assign any role
  if (adminUser.role === ROLES.SUPER_ADMIN) {
    return true;
  }

  // Admin can assign roles lower than their own
  if (adminUser.role === ROLES.ADMIN) {
    return getRoleLevel(ROLES.ADMIN) > getRoleLevel(roleToAssign);
  }

  // Others cannot assign roles
  return false;
};

/**
 * Check if user can manage office
 * @param {object} user - User object
 * @param {string} officeId - Office ID
 * @returns {boolean}
 */
export const canManageOffice = (user, officeId) => {
  if (!user) return false;

  // Super admin can manage all offices
  if (user.role === ROLES.SUPER_ADMIN) {
    return true;
  }

  // Admin can manage only their office
  if (user.role === ROLES.ADMIN && user.officeId === officeId) {
    return true;
  }

  return false;
};

/**
 * Get accessible sections for user within an office
 * @param {object} user - User object
 * @param {array} sections - Array of sections
 * @returns {array} - Accessible sections
 */
export const getAccessibleSections = (user, sections = []) => {
  if (!user) return [];

  // For now, all users can access all sections in their office
  // This can be customized based on specific requirements
  return sections;
};

export default {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getPermissionsForRole,
  canAccessOffice,
  canViewAllProjects,
  getAccessibleOffices,
  filterProjectsByUserAccess,
  filterEmployeesByUserAccess,
  canEditProject,
  canDeleteProject,
  getRoleDisplayName,
  getRoleLevel,
  isRoleHigherThan,
  canAssignRole,
  canManageOffice,
  getAccessibleSections
};
