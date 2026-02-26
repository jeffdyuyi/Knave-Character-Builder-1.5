import React, { useState, useCallback, useEffect } from 'react';
import {
  Character,
  StatName,
  Stat,
  Item,
  Traits
} from './types';
import {
  d6,
  d8,
  pick,
  createItem,
  d,
  d20,
  secureRandom
} from './utils';
import {
  INITIAL_STATS,
  TRAIT_TABLES,
  STARTING_ARMOR,
  DUNGEONEERING_GEAR,
  GENERAL_GEAR_1,
  GENERAL_GEAR_2,
  CAREERS
} from './constants';
import StatBlock from './components/StatBlock';
import TraitBlock from './components/TraitBlock';
import InventoryBlock from './components/InventoryBlock';
import CharacterSheet from './components/CharacterSheet';
import ReferenceBlock from './components/ReferenceBlock';
import GameRulesBlock from './components/GameRulesBlock';
import MemoBlock from './components/MemoBlock';
import DmTablesBlock from './components/DmTablesBlock';
import { Dices, Printer, RefreshCw, BookOpen, PenTool, List, ExternalLink, StickyNote, Box } from 'lucide-react';

const generateInitialCharacter = (): Character => {
  // Generate Stats (Knave 2: distribute 3 points randomly)
  const stats: Record<StatName, Stat> = {
    [StatName.Strength]: { name: StatName.Strength, value: 0 },
    [StatName.Dexterity]: { name: StatName.Dexterity, value: 0 },
    [StatName.Constitution]: { name: StatName.Constitution, value: 0 },
    [StatName.Intelligence]: { name: StatName.Intelligence, value: 0 },
    [StatName.Wisdom]: { name: StatName.Wisdom, value: 0 },
    [StatName.Charisma]: { name: StatName.Charisma, value: 0 },
  };

  const rolls = [d6(), d6(), d6()];
  rolls.forEach(r => {
    switch (r) {
      case 1: stats[StatName.Strength].value += 1; break;
      case 2: stats[StatName.Dexterity].value += 1; break;
      case 3: stats[StatName.Constitution].value += 1; break;
      case 4: stats[StatName.Intelligence].value += 1; break;
      case 5: stats[StatName.Wisdom].value += 1; break;
      case 6: stats[StatName.Charisma].value += 1; break;
    }
  });

  // Generate HP (Knave 2: d6)
  const hpVal = d6();

  return {
    id: crypto.randomUUID(),
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
    memo: '',
    isDead: false,
  };
};

const LOCAL_STORAGE_KEY_LIST = 'knave_characters_list';
const LOCAL_STORAGE_KEY_LEGACY = 'knave_character_data';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const savedList = localStorage.getItem(LOCAL_STORAGE_KEY_LIST);
      if (savedList) {
        return JSON.parse(savedList);
      }
      const legacySaved = localStorage.getItem(LOCAL_STORAGE_KEY_LEGACY);
      if (legacySaved) {
        const char = JSON.parse(legacySaved);
        if (!char.id) char.id = crypto.randomUUID();
        return [char];
      }
    } catch (e) {
      console.error("Failed to load characters from storage", e);
    }
    return [generateInitialCharacter()];
  });
  const [activeCharId, setActiveCharId] = useState<string>(characters[0]?.id || '');
  const [viewMode, setViewMode] = useState<'edit' | 'sheet' | 'rules' | 'tables' | 'memo' | 'dm'>('edit');

  const character = characters.find(c => c.id === activeCharId) || characters[0] || generateInitialCharacter();

  const setCharacter = useCallback((updater: React.SetStateAction<Character>) => {
    setCharacters(prev => {
      const idx = prev.findIndex(c => c.id === activeCharId);
      if (idx === -1) return prev;
      const current = prev[idx];
      const next = typeof updater === 'function' ? updater(current) : updater;
      const newList = [...prev];
      newList[idx] = next;
      return newList;
    });
  }, [activeCharId]);

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_LIST, JSON.stringify(characters));
    } catch (e) {
      console.error("Failed to save characters to storage", e);
    }
  }, [characters]);

  // Actions
  const rerollStats = useCallback(() => {
    // Distribute 3 points using 3d6
    const newStats: Record<StatName, Stat> = {
      [StatName.Strength]: { name: StatName.Strength, value: 0 },
      [StatName.Dexterity]: { name: StatName.Dexterity, value: 0 },
      [StatName.Constitution]: { name: StatName.Constitution, value: 0 },
      [StatName.Intelligence]: { name: StatName.Intelligence, value: 0 },
      [StatName.Wisdom]: { name: StatName.Wisdom, value: 0 },
      [StatName.Charisma]: { name: StatName.Charisma, value: 0 },
    };

    const rolls = [d6(), d6(), d6()];
    rolls.forEach(r => {
      switch (r) {
        case 1: newStats[StatName.Strength].value += 1; break;
        case 2: newStats[StatName.Dexterity].value += 1; break;
        case 3: newStats[StatName.Constitution].value += 1; break;
        case 4: newStats[StatName.Intelligence].value += 1; break;
        case 5: newStats[StatName.Wisdom].value += 1; break;
        case 6: newStats[StatName.Charisma].value += 1; break;
      }
    });
    setCharacter(prev => ({ ...prev, stats: newStats }));
  }, [setCharacter]);

  const adjustStat = useCallback((statName: StatName, amount: number) => {
    setCharacter(prev => {
      const current = prev.stats[statName].value;
      const next = current + amount;
      if (next < 0 || next > 10) return prev;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          [statName]: { ...prev.stats[statName], value: next }
        }
      };
    });
  }, [setCharacter]);

  const rerollHp = useCallback(() => {
    // Roll HP based on level: Level d6
    setCharacter(prev => {
      const lvl = Math.max(1, prev.level);
      let total = 0;
      for (let i = 0; i < lvl; i++) {
        total += d6();
      }
      return { ...prev, hp: { current: total, max: total } };
    });
  }, [setCharacter]);

  const randomizeTraits = useCallback(() => {
    const randomCareer = pick(CAREERS);
    setCharacter(prev => {
      const newTraits: Traits = { ...prev.traits };
      (Object.keys(TRAIT_TABLES) as Array<keyof typeof TRAIT_TABLES>).forEach(key => {
        newTraits[key as keyof Traits] = pick(TRAIT_TABLES[key]);
      });
      newTraits.background = randomCareer.name;
      const careerItems = randomCareer.items.map(itemName => createItem(itemName, 1, 'gear'));
      return {
        ...prev,
        traits: newTraits,
        inventory: [...prev.inventory, ...careerItems]
      };
    });
  }, [setCharacter]);

  const handleBackgroundChange = useCallback((careerName: string) => {
    setCharacter(prev => {
      const career = CAREERS.find(c => c.name === careerName);
      let newInventory = [...prev.inventory];

      if (career) {
        // Add items to inventory
        const careerItems = career.items.map(itemName => createItem(itemName, 1, 'gear'));
        newInventory = [...newInventory, ...careerItems];
      }

      return {
        ...prev,
        traits: { ...prev.traits, background: careerName },
        inventory: newInventory
      };
    });
  }, [setCharacter]);

  const generateStartingGear = useCallback(() => {
    const newInventory: Item[] = [];

    // Knave 2 Starting Gear:
    // 3d6×10 Coins
    const coins = (d6() + d6() + d6()) * 10;
    newInventory.push(createItem(`${coins} 钱币`, Math.ceil(coins / 500), 'gear'));

    // 2 Rations
    newInventory.push(createItem("口粮 (2日)", 1, 'food'));

    // 50ft rope, 2 torches
    newInventory.push(createItem("绳索 (50')", 1, 'gear'));
    newInventory.push(createItem("火把 (2)", 1, 'gear'));
    newInventory.push(createItem("箭袋与箭矢 (20)", 1, 'gear'));

    // Weapon or Armor
    if (secureRandom() > 0.5) {
      const weapons = [
        { name: "匕首", damage: 'd6', slots: 1 },
        { name: "棍棒", damage: 'd6', slots: 1 },
        { name: "镰刀", damage: 'd6', slots: 1 },
        { name: "杖", damage: 'd6', slots: 1 },
        { name: "矛", damage: 'd8', slots: 2 },
        { name: "剑", damage: 'd8', slots: 2 },
        { name: "硬头锤", damage: 'd8', slots: 2 },
        { name: "斧", damage: 'd8', slots: 2 },
        { name: "连枷", damage: 'd8', slots: 2 },
      ];
      const w = pick(weapons);
      newInventory.push(createItem(w.name, w.slots, 'weapon', { damage: w.damage, quality: 3 }));
    } else {
      const armors = ["盾牌", "头盔", "布面甲", "锁子甲衫", "胸甲", "臂甲", "腿甲"];
      newInventory.push(createItem(pick(armors), 1, 'armor', { defense: 1, quality: 1 }));
    }

    // Spellbooks based on Intelligence
    // Get current INT
    setCharacter(prev => {
      const intValue = prev.stats[StatName.Intelligence].value;
      const inventoryWithSpells = [...newInventory];
      for (let i = 0; i < intValue; i++) {
        inventoryWithSpells.push(createItem(`法术书 (随机)`, 1, 'gear'));
      }
      return {
        ...prev,
        inventory: inventoryWithSpells
      };
    });
  }, [setCharacter]);

  const addItem = useCallback((item: Item) => {
    setCharacter(prev => ({ ...prev, inventory: [...prev.inventory, item] }));
  }, [setCharacter]);

  const removeItem = useCallback((id: string) => {
    setCharacter(prev => ({ ...prev, inventory: prev.inventory.filter(i => i.id !== id) }));
  }, [setCharacter]);

  const updateItem = useCallback((id: string, updates: Partial<Item>) => {
    setCharacter(prev => ({
      ...prev,
      inventory: prev.inventory.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  }, [setCharacter]);

  const handleXpChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const xp = val === '' ? 0 : Math.max(0, parseInt(val) || 0);
    // Knave rules: usually 1000 XP per level.
    const level = Math.floor(xp / 1000) + 1;
    setCharacter(prev => ({ ...prev, xp, level }));
  }, [setCharacter]);

  const handleLevelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const level = val === '' ? 1 : Math.max(1, parseInt(val) || 1);
    // Sync XP to minimum for that level
    const xp = (level - 1) * 1000;
    setCharacter(prev => ({ ...prev, level, xp }));
  }, [setCharacter]);

  const handleMaxHpChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const max = val === '' ? 1 : Math.max(1, parseInt(val) || 1);
    setCharacter(prev => ({ ...prev, hp: { ...prev.hp, max, current: prev.hp.current > max ? max : prev.hp.current } }));
  }, [setCharacter]);

  if (viewMode === 'sheet') {
    return <CharacterSheet character={character} onEdit={() => setViewMode('edit')} />;
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto flex flex-col">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b-2 border-stone-800 pb-4 gap-4 md:gap-0">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-stone-900 leading-none">KNAVE2E个人翻译</h1>
          <h2 className="text-xl sm:text-2xl font-serif text-stone-600 italic">Q1</h2>

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
                href="https://questingbeast.itch.io/knave-second-edition"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-amber-700 hover:underline transition-colors"
              >
                <ExternalLink size={10} /> 英文原作
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
            {/* 编辑 */}
            <button
              onClick={() => setViewMode('edit')}
              className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all ${viewMode === 'edit' ? 'bg-stone-800 text-white shadow-inner' : 'text-stone-600 hover:bg-stone-100'}`}
              title="编辑角色"
            >
              <PenTool size={20} className="sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-bold mt-1">编辑</span>
            </button>
            {/* 备忘 */}
            <button
              onClick={() => setViewMode('memo')}
              className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all ${viewMode === 'memo' ? 'bg-stone-800 text-white shadow-inner' : 'text-stone-600 hover:bg-stone-100'}`}
              title="个人备忘录"
            >
              <StickyNote size={20} className="sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-bold mt-1">备忘</span>
            </button>
            {/* 速查 */}
            <button
              onClick={() => setViewMode('tables')}
              className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all ${viewMode === 'tables' ? 'bg-stone-800 text-white shadow-inner' : 'text-stone-600 hover:bg-stone-100'}`}
              title="法术与物品速查"
            >
              <List size={20} className="sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-bold mt-1">速查</span>
            </button>
            {/* 规则 */}
            <button
              onClick={() => setViewMode('rules')}
              className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all ${viewMode === 'rules' ? 'bg-stone-800 text-white shadow-inner' : 'text-stone-600 hover:bg-stone-100'}`}
              title="核心规则"
            >
              <BookOpen size={20} className="sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-bold mt-1">规则</span>
            </button>
            {/* DM工具 */}
            <button
              onClick={() => setViewMode('dm')}
              className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all ${viewMode === 'dm' ? 'bg-stone-800 text-white shadow-inner' : 'text-stone-600 hover:bg-stone-100'}`}
              title="主持人工具"
            >
              <Box size={20} className="sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-bold mt-1">DM工具</span>
            </button>
            {/* 角色卡 */}
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
        {viewMode === 'dm' && <DmTablesBlock />}
        {viewMode === 'memo' && (
          <MemoBlock
            memo={character.memo || ''}
            onChange={(val) => setCharacter(prev => ({ ...prev, memo: val }))}
          />
        )}

        {viewMode === 'edit' && (
          <main className="flex flex-col gap-6">

            {/* Character Manager UI */}
            <div className="bg-stone-100 p-3 rounded-sm border border-stone-300 flex flex-wrap items-center gap-4">
              <label className="font-bold text-sm text-stone-600 uppercase">当前角色</label>
              <select
                value={activeCharId}
                onChange={(e) => setActiveCharId(e.target.value)}
                className="border-b-2 border-stone-300 bg-transparent px-2 py-1 font-serif font-bold text-stone-800 focus:outline-none focus:border-stone-800 flex-grow text-lg"
              >
                {characters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name || '无名氏'} [Lv {c.level}] {c.isDead ? '(撕卡)' : ''}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  onClick={() => {
                    const newChar = generateInitialCharacter();
                    setCharacters(prev => [...prev, newChar]);
                    setActiveCharId(newChar.id);
                  }}
                  className="bg-stone-800 text-white px-3 py-1.5 rounded-sm text-xs border border-stone-900 shadow-sm hover:bg-stone-700 hover:shadow font-bold transition-all flex-grow sm:flex-grow-0"
                >
                  新建角色
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`确认将角色 ${character.name || '无名氏'} 标记为撕卡(死亡)状态吗？`)) {
                      setCharacter(prev => ({ ...prev, isDead: !prev.isDead }));
                    }
                  }}
                  className={`px-3 py-1.5 rounded-sm text-xs shadow-sm font-bold transition-all flex-grow sm:flex-grow-0 border ${character.isDead ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200' : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'}`}
                >
                  {character.isDead ? '撤销撕卡' : '标记撕卡'}
                </button>
                <button
                  onClick={() => {
                    if (characters.length === 1) {
                      alert('至少保留一个角色。可以清空姓名和属性代替删除。');
                      return;
                    }
                    if (window.confirm(`确定要彻底删除角色 ${character.name || '无名氏'} 吗？此操作无法恢复！`)) {
                      setCharacters(prev => {
                        const nextList = prev.filter(c => c.id !== activeCharId);
                        setActiveCharId(nextList[0].id);
                        return nextList;
                      });
                    }
                  }}
                  className="bg-stone-200 text-stone-600 border border-stone-300 px-3 py-1.5 rounded-sm text-xs hover:bg-stone-300 shadow-sm font-bold transition-all flex-grow sm:flex-grow-0"
                >
                  删除
                </button>
              </div>
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${character.isDead ? 'opacity-70 grayscale' : ''}`}>
              {/* Column 1: Stats & Vitals */}
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-sm shadow-md border-2 border-stone-800 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-500 uppercase mb-1">角色姓名 (Name)</label>
                    <input
                      type="text"
                      value={character.name}
                      onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
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

                <StatBlock stats={character.stats} onRerollAll={rerollStats} onAdjustStat={adjustStat} />

                <div className="bg-white p-4 rounded-sm shadow-md border-2 border-stone-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold font-serif">生命值 (HP)</h3>
                    <div className="text-sm text-stone-500">Max HP ({character.level}d6)</div>
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
              <div className="h-full">
                <TraitBlock traits={character.traits} onRandomize={randomizeTraits} onBackgroundChange={handleBackgroundChange} />
              </div>

            </div> {/* End of Top Grid */}

            {/* Bottom Half: Inventory */}
            <div className="w-full mt-2">
              <InventoryBlock
                inventory={character.inventory}
                maxSlots={10 + character.stats[StatName.Constitution].value}
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