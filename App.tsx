import React, { useState, useCallback } from 'react';
import { 
  Character, 
  StatName, 
  Item, 
  Traits 
} from './types';
import { 
  rollStat, 
  d8, 
  pick, 
  createItem, 
  d, 
  d20
} from './utils';
import { 
  INITIAL_STATS, 
  TRAIT_TABLES, 
  STARTING_ARMOR, 
  DUNGEONEERING_GEAR, 
  GENERAL_GEAR_1, 
  GENERAL_GEAR_2 
} from './constants';
import StatBlock from './components/StatBlock';
import TraitBlock from './components/TraitBlock';
import InventoryBlock from './components/InventoryBlock';
import CharacterSheet from './components/CharacterSheet';
import ReferenceBlock from './components/ReferenceBlock';
import GameRulesBlock from './components/GameRulesBlock';
import { Dices, Printer, RefreshCw, BookOpen, PenTool, List, ExternalLink } from 'lucide-react';

const generateInitialCharacter = (): Character => {
  // Generate Stats
  const stats = {} as Character['stats'];
  INITIAL_STATS.forEach(name => {
    stats[name] = rollStat(name);
  });

  // Generate HP
  const hpVal = d8();

  return {
    name: '',
    level: 1,
    xp: 0,
    hp: { current: hpVal, max: hpVal },
    stats,
    traits: {
      physique: '', face: '', skin: '', hair: '', clothing: '',
      virtue: '', vice: '', speech: '', background: '', misfortune: '', alignment: ''
    },
    inventory: [],
  };
};

const App: React.FC = () => {
  const [character, setCharacter] = useState<Character>(generateInitialCharacter());
  const [viewMode, setViewMode] = useState<'edit' | 'sheet' | 'rules' | 'tables'>('edit');

  // Actions
  const rerollStats = useCallback(() => {
    const newStats = { ...character.stats };
    INITIAL_STATS.forEach(name => {
      newStats[name] = rollStat(name);
    });
    setCharacter(prev => ({ ...prev, stats: newStats }));
  }, [character.stats]);

  const swapStats = useCallback((stat1: StatName, stat2: StatName) => {
    setCharacter(prev => {
      const s1 = prev.stats[stat1];
      const s2 = prev.stats[stat2];
      
      // Swap ONLY dice and derived values, keep the key/name mapping correct
      return {
        ...prev,
        stats: {
          ...prev.stats,
          [stat1]: { ...s1, dice: s2.dice, bonus: s2.bonus, defense: s2.defense },
          [stat2]: { ...s2, dice: s1.dice, bonus: s1.bonus, defense: s1.defense },
        }
      };
    });
  }, []);

  const rerollHp = useCallback(() => {
    // Roll HP based on level: Level d8
    setCharacter(prev => {
      const lvl = Math.max(1, prev.level);
      let total = 0;
      for (let i = 0; i < lvl; i++) {
        total += d8();
      }
      return { ...prev, hp: { current: total, max: total } };
    });
  }, []);

  const randomizeTraits = useCallback(() => {
    const newTraits = {} as Traits;
    (Object.keys(TRAIT_TABLES) as Array<keyof Traits>).forEach(key => {
      newTraits[key] = pick(TRAIT_TABLES[key]);
    });
    setCharacter(prev => ({ ...prev, traits: newTraits }));
  }, []);

  const generateStartingGear = useCallback(() => {
    const newInventory: Item[] = [];

    // 1. Rations (2 days)
    newInventory.push(createItem("旅行口粮 (2日)", 1, 'food'));

    // 2. Weapon of Choice
    // In a real app, we might randomly pick a weapon, but "Self-chosen" is the rule default
    newInventory.push(createItem("自选武器", 1, 'weapon', { damage: 'd6', quality: 3 }));

    // 3. Armor (Roll)
    const armorRoll = d20();
    const armorData = STARTING_ARMOR.find(a => a.roll.includes(armorRoll)) || STARTING_ARMOR[0];
    
    // Add Body Armor if not "No Armor" (slots > 0 check handles "No Armor" which usually has 0 slots)
    if (armorData.slots > 0) {
      newInventory.push(createItem(armorData.name, armorData.slots, 'armor', { 
        defense: armorData.defense, 
        quality: armorData.quality 
      }));
    }

    // 4. Helm/Shield (Roll)
    const helmRoll = d20();
    // 1-13: None, 14-16: Helm, 17-19: Shield, 20: Both
    if (helmRoll >= 14 && helmRoll <= 16) {
      newInventory.push(createItem("头盔", 1, 'armor', { defense: 1, quality: 1 }));
    }
    if (helmRoll >= 17 && helmRoll <= 19) {
      newInventory.push(createItem("盾牌", 1, 'armor', { defense: 1, quality: 1 }));
    }
    if (helmRoll === 20) {
      newInventory.push(createItem("头盔", 1, 'armor', { defense: 1, quality: 1 }));
      newInventory.push(createItem("盾牌", 1, 'armor', { defense: 1, quality: 1 }));
    }

    // 5. Gear
    newInventory.push(createItem(pick(DUNGEONEERING_GEAR), 1, 'gear'));
    newInventory.push(createItem(pick(DUNGEONEERING_GEAR), 1, 'gear'));
    newInventory.push(createItem(pick(GENERAL_GEAR_1), 1, 'gear'));
    newInventory.push(createItem(pick(GENERAL_GEAR_2), 1, 'gear'));

    setCharacter(prev => ({
      ...prev,
      inventory: newInventory
    }));
  }, []);

  const addItem = (item: Item) => {
    setCharacter(prev => ({ ...prev, inventory: [...prev.inventory, item] }));
  };

  const removeItem = (id: string) => {
    setCharacter(prev => ({ ...prev, inventory: prev.inventory.filter(i => i.id !== id) }));
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setCharacter(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const handleXpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const xp = Math.max(0, parseInt(e.target.value) || 0);
    // Knave rules: usually 1000 XP per level.
    const level = Math.floor(xp / 1000) + 1;
    setCharacter(prev => ({ ...prev, xp, level }));
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const level = Math.max(1, parseInt(e.target.value) || 1);
    // Sync XP to minimum for that level
    const xp = (level - 1) * 1000;
    setCharacter(prev => ({ ...prev, level, xp }));
  };

  const handleMaxHpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = Math.max(1, parseInt(e.target.value) || 1);
    setCharacter(prev => ({ ...prev, hp: { ...prev.hp, max, current: max } }));
  };

  if (viewMode === 'sheet') {
    return <CharacterSheet character={character} onEdit={() => setViewMode('edit')} />;
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto flex flex-col">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b-2 border-stone-800 pb-4 gap-4 md:gap-0">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-stone-900 leading-none">Knave</h1>
          <h2 className="text-xl sm:text-2xl font-serif text-stone-600 italic">恶棍角色生成器</h2>
          
          {/* Credits Section */}
          <div className="mt-3 pt-2 border-t border-stone-300 text-[10px] sm:text-xs font-serif text-stone-500 space-y-1">
             <p>
               <span className="font-bold text-stone-600">中文版贡献：</span>
               翻译 ZzNoah <span className="text-stone-300 mx-1">|</span> 
               校对 白药君 <span className="text-stone-300 mx-1">|</span> 
               排版 年糕
             </p>
             <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
               <a 
                 href="https://questingbeast.itch.io/knave" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="flex items-center gap-1 hover:text-amber-700 hover:underline transition-colors"
               >
                 <ExternalLink size={10} /> Knave 英文原作
               </a>
               <span className="hidden sm:inline text-stone-300">|</span>
               <a 
                 href="https://zznoah.itch.io/knave-chs" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="flex items-center gap-1 hover:text-amber-700 hover:underline transition-colors"
               >
                 <ExternalLink size={10} /> 中文版下载 (Itch.io)
               </a>
             </div>
             <p className="text-stone-400 italic pt-1">
               本工具由不咕鸟（基德）使用AI制作
             </p>
          </div>
        </div>

        <div className="flex gap-4 self-end md:self-center">
          <div className="bg-white rounded-full shadow-lg p-1 flex gap-2 sm:gap-0">
             <button 
              onClick={() => setViewMode('edit')}
              className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all ${viewMode === 'edit' ? 'bg-stone-800 text-white shadow-inner' : 'text-stone-600 hover:bg-stone-100'}`}
              title="编辑角色"
            >
              <PenTool size={20} className="sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-bold mt-1">编辑</span>
            </button>
            <button 
              onClick={() => setViewMode('rules')}
              className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all ${viewMode === 'rules' ? 'bg-stone-800 text-white shadow-inner' : 'text-stone-600 hover:bg-stone-100'}`}
              title="核心规则"
            >
              <BookOpen size={20} className="sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-bold mt-1">规则</span>
            </button>
             <button 
              onClick={() => setViewMode('tables')}
              className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all ${viewMode === 'tables' ? 'bg-stone-800 text-white shadow-inner' : 'text-stone-600 hover:bg-stone-100'}`}
              title="法术与物品速查"
            >
              <List size={20} className="sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-bold mt-1">速查</span>
            </button>
            <button 
              onClick={() => setViewMode('sheet')}
              className="flex flex-col items-center justify-center bg-blue-700 text-white w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg hover:bg-blue-600 hover:scale-105 transition-all ml-2"
              title="查看角色卡"
            >
              <Printer size={20} className="sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-bold mt-1">角色卡</span>
            </button>
          </div>
        </div>
      </header>

      {/* View Rendering Logic */}
      <div className="flex-grow">
        {viewMode === 'rules' && <GameRulesBlock />}
        {viewMode === 'tables' && <ReferenceBlock />}
        
        {viewMode === 'edit' && (
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Column 1: Stats & Vitals */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-sm shadow-md border-2 border-stone-800 space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-stone-500 uppercase mb-1">角色姓名 (Name)</label>
                    <input 
                      type="text" 
                      value={character.name}
                      onChange={(e) => setCharacter(prev => ({...prev, name: e.target.value}))}
                      className="w-full text-2xl font-serif font-bold border-b-2 border-stone-300 focus:border-stone-800 focus:outline-none bg-transparent"
                      placeholder="无名恶棍..."
                    />
                 </div>

                 {/* Regenerate Button */}
                 <button 
                    onClick={() => {
                      rerollStats();
                      rerollHp();
                      randomizeTraits();
                      generateStartingGear();
                    }}
                    className="w-full bg-stone-800 text-white py-2 rounded-sm shadow hover:bg-stone-700 transition-all text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Dices size={16} />
                    重新生成所有属性与装备
                  </button>
                 
                 <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase mb-1">经验值 (XP)</label>
                      <input 
                        type="number" 
                        value={character.xp}
                        onChange={handleXpChange}
                        className="w-full font-mono font-bold text-lg border border-stone-300 rounded px-2 py-1 focus:border-stone-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase mb-1">等级 (Level)</label>
                      <input 
                        type="number" 
                        value={character.level}
                        onChange={handleLevelChange}
                        className="w-full font-serif font-bold text-xl text-stone-800 border-b border-stone-300 py-1 focus:border-stone-800 focus:outline-none bg-transparent"
                      />
                    </div>
                 </div>
              </div>

              <StatBlock stats={character.stats} onRerollAll={rerollStats} onSwap={swapStats} />

              <div className="bg-white p-4 rounded-sm shadow-md border-2 border-stone-800 flex justify-between items-center">
                 <div>
                   <h3 className="text-lg font-bold font-serif">生命值 (HP)</h3>
                   <div className="text-sm text-stone-500">Max HP ({character.level}d8)</div>
                 </div>
                 <div className="flex items-center gap-2">
                   <input 
                      type="number"
                      value={character.hp.max}
                      onChange={handleMaxHpChange}
                      className="w-24 text-4xl font-black text-red-800 text-right border-b-2 border-stone-200 focus:border-red-800 focus:outline-none bg-transparent"
                   />
                   <button onClick={rerollHp} className="bg-stone-200 p-2 rounded-full hover:bg-stone-300" title={`重投生命值 (当前等级 ${character.level})`}>
                     <RefreshCw size={16} />
                   </button>
                 </div>
              </div>
            </div>

            {/* Column 2: Traits */}
            <div>
              <TraitBlock traits={character.traits} onRandomize={randomizeTraits} />
            </div>

            {/* Column 3: Inventory */}
            <div>
              <InventoryBlock 
                inventory={character.inventory} 
                maxSlots={character.stats[StatName.Constitution].defense}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                onUpdateItem={updateItem}
                onAutoGenerate={generateStartingGear}
              />
            </div>

          </main>
        )}
      </div>

      <footer className="mt-12 text-center text-stone-400 text-sm font-serif pb-4 pt-6 border-t border-stone-300/50">
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6">
          <span>成都线下跑团群：691707475</span>
          <span className="hidden sm:inline">|</span>
          <span>不咕鸟创作交流群：261751459</span>
        </div>
      </footer>
    </div>
  );
};

export default App;