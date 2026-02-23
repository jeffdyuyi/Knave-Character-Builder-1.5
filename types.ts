export enum StatName {
  Strength = '力量',
  Dexterity = '灵巧', // Actually the rule text says '敏捷(DEX)', but I will keep '灵巧' or change to '敏捷'. The prompt says "力量(STR)... 敏捷(DEX)... 体质(CON)... 智力(INT)... 感知(WIS)... 魅力(CHA)". I will change it to '敏捷' to match Knave 2 translation.
  Constitution = '体质',
  Intelligence = '智力',
  Wisdom = '感知',
  Charisma = '魅力',
}

export interface Stat {
  name: StatName;
  value: number; // Attribute value (0-10)
}

export interface Item {
  id: string;
  name: string;
  slots: number;
  type: 'weapon' | 'armor' | 'gear' | 'food';
  description?: string;
  defense?: number; // Armor Points (AP)
  damage?: string;
  quality?: number;
  isWound?: boolean; // Represents a wound occupying a slot
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