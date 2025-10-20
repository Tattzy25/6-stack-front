/**
 * MASTER ACCESS CONFIGURATION
 * 
 * This is the secret backdoor access code.
 * Only you and the system know about this.
 * 
 * Usage: Enter ANY email + this passcode = instant access
 */

export const MASTER_CONFIG = {
  // The master passcode that bypasses all authentication
  passcode: '<MASTER_PASSCODE>',
  
  // Master user details (created when master passcode is used)
  user: {
    id: 'master-admin-001',
    name: 'Master Admin',
    role: 'owner',
    email: '', // Will be set to whatever email was entered
  },
  
  // Whether master access is enabled (for production safety)
  enabled: false,
};

/**
 * Check if a passcode is the master passcode
 */
export function isMasterPasscode(passcode: string): boolean {
  if (!MASTER_CONFIG.enabled) return false;
  return passcode === MASTER_CONFIG.passcode;
}

/**
 * Create a master user session
 */
export function createMasterUser(email: string) {
  return {
    id: MASTER_CONFIG.user.id,
    email: email || 'master@tattty.local',
    name: MASTER_CONFIG.user.name,
    role: MASTER_CONFIG.user.role,
    isMasterAdmin: true,
    avatar: undefined,
  };
}

/**
 * Update the master passcode (for dashboard settings later)
 */
export function updateMasterPasscode(newPasscode: string): boolean {
  // TODO: In production, this should update a secure backend config
  // For now, this is a placeholder for the dashboard feature
  console.log('🔐 Master passcode update requested:', newPasscode);
  return true;
}

/**
 * Check if a user ID is a master user
 */
export function isMasterUser(userId: string): boolean {
  return userId === MASTER_CONFIG.user.id;
}

/**
 * Master access utilities object
 */
export const masterAccess = {
  isMasterUser,
  isMasterPasscode,
  createMasterUser,
  updateMasterPasscode,
  config: MASTER_CONFIG,
};
