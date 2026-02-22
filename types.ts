
export enum StatName {
  Strength = '力量',
  Dexterity = '敏捷',
  Constitution = '体质',
  Intelligence = '智力',
  Wisdom = '睿知',
  Charisma = '魅力',
}

export interface Stat {
  name: StatName;
  dice: number[]; // The 3d6 rolled
  bonus: number; // Lowest die
  defense: number; // Bonus + 10
}

export interface Item {
  id: string;
  name: string;
  slots: number;
  type: 'weapon' | 'armor' | 'gear' | 'food';
  description?: string;
  defense?: number; // For armor/shields
  damage?: string; // For weapons (e.g. "d6", "d8")
  quality?: number; // Current durability points
}

export interface Traits {
  physique: string;
  face: string;
  skin: string;
  hair: string;
  clothing: string;
  virtue: string;
  vice: string;
  speech: string;
  background: string;
  misfortune: string;
  alignment: string;
}

export interface Character {
  name: string;
  level: number;
  xp: number;
  hp: {
    current: number;
    max: number;
  };
  stats: Record<StatName, Stat>;
  traits: Traits;
  inventory: Item[];
  // armor object removed, derived from inventory
}

export interface CustomSpell {
  id: string;
  name: string;
  description: string;
}

export interface CustomItemDef {
  id: string;
  name: string;
  cost: string;
  description: string;
}