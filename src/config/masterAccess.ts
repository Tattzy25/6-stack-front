/**
 * Master access has been permanently disabled.
 *
 * This module now only exposes inert helpers so that any lingering imports do not
 * accidentally reintroduce privileged flows. All functions intentionally refuse
 * to grant elevated access.
 */

export const masterAccess = Object.freeze({
  isEnabled: false,
  isMasterUser: () => false,
});

export function assertMasterAccessDisabled(): never {
  throw new Error('Master access has been permanently disabled. Remove related code paths.');
}
