import { v4 as uuidv4 } from 'uuid';
import { Item, Stat, StatName } from './types';

// Dice functions
export const d = (sides: number) => Math.floor(Math.random() * sides) + 1;
export const d6 = () => d(6);
export const d8 = () => d(8);
export const d20 = () => d(20);
export const d100 = () => d(100);

export const getStatByDice = (roll: number): StatName => {
  switch (roll) {
    case 1: return StatName.Strength;
    case 2: return StatName.Dexterity;
    case 3: return StatName.Constitution;
    case 4: return StatName.Intelligence;
    case 5: return StatName.Wisdom;
    case 6: return StatName.Charisma;
  }
  return StatName.Strength;
};

// Array picker
export const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ID generator
export const generateId = () => uuidv4();

export const createItem = (
  name: string,
  slots: number = 1,
  type: Item['type'] = 'gear',
  props: Partial<Item> = {}
): Item => ({
  id: generateId(),
  name,
  slots,
  type,
  quality: 3, // Default quality
  ...props
});