/**
 * Centralized localStorage keys. Every consumer of localStorage in the app
 * should import from here so:
 *  - we can grep all storage usage from one file
 *  - schema migrations can target known keys
 *  - generic names like "colorScheme" or "guitarSettings" don't collide with
 *    anything else on the same origin
 *
 * Names are preserved from their original sites so existing browser state
 * survives — don't rename without a migrator.
 */
export const STORAGE_KEYS = {
  PROGRESS: 'spanish_learning_progress',
  THEME: 'spanish_learning_theme',
  COLOR_SCHEME: 'colorScheme',
  GAMIFICATION: 'spanish_gamification',
  LEARNING_SETTINGS: 'learningSettings',
  GUITAR_SETTINGS: 'guitarSettings',
  DAILY_REMINDER: 'spanish_daily_reminder',
  LAST_DAILY_PRACTICE: 'spanish_last_daily_practice',
  CONVERSATION_CARDS_COMPLETED: 'spanish_conversation_cards_completed',
} as const;

/**
 * Current schema version for stored UserProgress payloads. Bump when the
 * UserProgress shape changes in an incompatible way, and add a migration
 * branch in migrateProgress() (lib/storage.ts).
 */
export const PROGRESS_SCHEMA_VERSION = 1;
