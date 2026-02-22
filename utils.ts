import { v4 as uuidv4 } from 'uuid';
import { Item, Stat, StatName } from './types';

// Dice functions
export const d = (sides: number) => Math.floor(Math.random() * sides) + 1;
export const d6 = () => d(6);
export const d8 = () => d(8);
export const d20 = () => d(20);

// Generate 3d6, keep lowest as bonus
export const rollStat = (name: StatName): Stat => {
  const dice = [d6(), d6(), d6()];
  const bonus = Math.min(...dice);
  const defense = bonus + 10;
  return { name, dice, bonus, defense };
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