import { StatName } from "./types";

export const INITIAL_STATS = [
  StatName.Strength,
  StatName.Dexterity,
  StatName.Constitution,
  StatName.Intelligence,
  StatName.Wisdom,
  StatName.Charisma,
];

// Re-export all random tables and data from the new database folder to maintain backward compatibility
export * from './data';