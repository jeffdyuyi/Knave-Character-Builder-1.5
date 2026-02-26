import { v4 as uuidv4 } from 'uuid';
import { Item, Stat, StatName } from './types';

// Cryptographically secure pseudorandom number generator replacing Math.random()
export const secureRandom = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
};

// Dice functions
export const d = (sides: number) => Math.floor(secureRandom() * sides) + 1;
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
export const pick = <T>(arr: T[]): T => arr[Math.floor(secureRandom() * arr.length)];

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
  quality: type === 'weapon' || type === 'armor' ? 3 : 0, // Default quality
  ...props
});