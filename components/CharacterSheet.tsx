import React, { useRef, useCallback } from 'react';
import { Character, StatName, Stat } from '../types';
import { toPng } from 'html-to-image';
import { Download, ArrowLeft, Loader2, FileText } from 'lucide-react';

interface CharacterSheetProps {
  character: Character;
  onEdit: () => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onEdit }) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Generate empty rows for printing if inventory is not full
  const maxSlots = 10 + character.stats[StatName.Constitution].value;
  const emptySlots = Math.max(0, maxSlots - character.inventory.length);

  // Calculate Armor Class from inventory (Knave 2)
  const armorItems = character.inventory.filter(i => i.type === 'armor');

  // In Knave 2, base AC is 11, and each armor piece gives its defense points.
  const totalDefense = 11 + armorItems.reduce((sum, i) => sum + (i.defense || 0), 0);
  const armorDescription = armorItems.length > 0 ? armorItems.map(i => i.name).join(' + ') : '无甲 (Unarmored)';

  const handleDownloadPng = useCallback(async () => {
    if (sheetRef.current === null) {
      return;
    }

    setIsGenerating(true);

    try {
      // Small delay to ensure render stability if needed, though usually not strictly necessary with React
      // Using toPng from html-to-image
      const dataUrl = await toPng(sheetRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2 // Higher resolution
      });

      const link = document.createElement('a');
      link.download = `${character.name || 'Knave_Character'}_Sheet.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('生成图片失败，请重试或使用浏览器打印功能。');
    } finally {
      setIsGenerating(false);
    }
  }, [character.name]);

  const handleDownloadTxt = useCallback(() => {
    let txt = `==== KNAVE 角色卡 ====\n`;
    txt += `姓名: ${character.name || '无名氏'}\n`;
    txt += `等级: ${character.level} | 经验值: ${character.xp}/1000\n`;
    txt += `生命值 (HP): ${character.hp.current} / ${character.hp.max}\n`;
    txt += `护甲 (AC): ${totalDefense}\n\n`;

    txt += `[属性]\n`;
    (Object.values(character.stats) as Stat[]).forEach(stat => {
      txt += `${stat.name}: ${stat.value}\n`;
    });
    txt += `\n`;

    txt += `[特征]\n`;
    Object.entries(character.traits).forEach(([k, v]) => {
      txt += `${k.toUpperCase()}: ${v || '---'}\n`;
    });
    txt += `\n`;

    txt += `[物品栏 (${character.inventory.reduce((s, i) => s + (i.slots || 0), 0)}/${maxSlots} 栏位)]\n`;
    character.inventory.forEach((i, idx) => {
      txt += `${idx + 1}. ${i.name}`;
      if (i.slots !== 1) txt += ` (${i.slots}栏位)`;
      if (i.type === 'weapon' && i.damage) txt += ` [伤害:${i.damage}]`;
      if (i.type === 'armor' && i.defense) txt += ` [防御:+${i.defense}]`;
      if (i.quality !== undefined && i.quality > 0) txt += ` (耐久:${i.quality})`;
      txt += `\n`;
    });

    if (character.memo) {
      txt += `\n[个人备忘]\n${character.memo}\n`;
    }

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.name || 'Knave_Character'}_Sheet.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }, [character, totalDefense, maxSlots]);

  return (
    <div className="max-w-[210mm] mx-auto">
      {/* Controls - No Print / No Capture */}
      <div className="no-print mb-6 flex justify-between items-center bg-stone-200 p-4 rounded-sm border border-stone-300 shadow-sm flex-wrap gap-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 text-stone-700 hover:text-stone-900 font-bold transition-colors shrink-0"
        >
          <ArrowLeft size={20} />
          返回编辑 (Back)
        </button>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadTxt}
            className="flex items-center justify-center gap-2 bg-stone-100 text-stone-800 border border-stone-300 px-4 py-2 rounded shadow hover:bg-stone-50 transition-all font-bold flex-grow sm:flex-grow-0"
          >
            <FileText size={20} />
            保存为TXT
          </button>
          <button
            onClick={handleDownloadPng}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 bg-stone-800 text-white px-4 py-2 rounded shadow hover:bg-stone-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold flex-grow sm:flex-grow-0"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            {isGenerating ? '生成中...' : '保存为PNG'}
          </button>
        </div>
      </div>

      {/* The Sheet - Capture Target */}
      <div ref={sheetRef} className="bg-white p-8 shadow-2xl print:shadow-none print:p-0 text-black aspect-[210/297] flex flex-col relative overflow-hidden">
        {character.isDead && (
          <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="text-red-700/20 font-black text-[120px] md:text-[180px] -rotate-45 uppercase border-[12px] md:border-[16px] border-red-700/20 px-8 py-4 tracking-widest pointer-events-none">
              DECEASED
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex justify-between items-end border-b-4 border-black mb-6 pb-2 shrink-0">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter">KNAVE</h1>
            <h2 className="text-2xl font-serif italic text-stone-600">恶棍</h2>
          </div>
          <div className="text-right">
            <div className="text-xl font-serif">{character.name || "无名氏"}</div>
            <div className="text-sm text-stone-500">
              Level {character.level} | XP {character.xp} / 1000
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex flex-col gap-6 flex-grow overflow-hidden">

          <div className="grid grid-cols-12 gap-6 shrink-0">
            {/* Left Column: Stats */}
            <div className="col-span-4 flex flex-col gap-4">
              {/* Attributes Table */}
              <div className="border-2 border-black">
                <div className="grid grid-cols-3 bg-black text-white text-[10px] font-bold p-1 text-center uppercase">
                  <div className="col-span-2 text-left px-2">Attribute</div>
                  <div>Value</div>
                </div>
                {(Object.values(character.stats) as Stat[]).map((stat) => (
                  <div key={stat.name} className="grid grid-cols-3 border-b border-stone-300 last:border-0 text-center items-center h-8">
                    <div className="col-span-2 text-left px-1 font-serif font-bold text-base uppercase tracking-tight">{stat.name}</div>
                    <div className="font-bold text-base border-l border-stone-300">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Armor & HP Row */}
              <div className="grid grid-cols-2 gap-2">
                <div className="border-2 border-black p-1 text-center">
                  <div className="uppercase text-[8px] font-bold tracking-tighter text-stone-500">Armor</div>
                  <div className="text-3xl font-black leading-none">{totalDefense}</div>
                </div>
                <div className="border-2 border-black p-1 text-center">
                  <div className="uppercase text-[8px] font-bold tracking-tighter text-stone-500">HP</div>
                  <div className="text-3xl font-black leading-none">{character.hp.current}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Traits */}
            <div className="col-span-8 border-2 border-black p-3 relative bg-stone-50/30">
              <h3 className="font-bold uppercase text-xs border-b-2 border-black mb-2 inline-block">Character Description</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {Object.entries(character.traits).map(([key, value]) => (
                  <div key={key} className="flex items-baseline gap-2 border-b border-stone-200 pb-0.5">
                    <span className="capitalize text-stone-400 text-[9px] font-bold uppercase min-w-[60px]">{key}:</span>
                    <span className="font-serif text-sm font-bold truncate">{value || '---'}</span>
                  </div>
                ))}
              </div>
              <div className="absolute top-2 right-3 text-[8px] text-stone-300 font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            </div>
          </div>

          {/* Bottom Section: Inventory - Full Width */}
          <div className="border-2 border-black flex flex-col flex-grow min-h-0">
            <div className="bg-black text-white font-bold px-3 py-1.5 uppercase flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-lg tracking-widest">Inventory Slots</span>
                <span className="text-[10px] font-normal opacity-60">物品栏位</span>
              </div>
              <span className="text-xs font-mono">Encumbrance: {character.inventory.reduce((s, i) => s + (i.slots || 0), 0)} / {maxSlots}</span>
            </div>

            <div className="grid grid-cols-2 flex-grow overflow-hidden">
              {/* Left Inventory Column */}
              <div className="border-r border-black flex flex-col">
                {Array.from({ length: Math.ceil(maxSlots / 2) }).map((_, idx) => {
                  const item = character.inventory[idx];
                  return (
                    <div key={`inv-l-${idx}`} className="flex border-b border-stone-300 h-9 items-center px-3 relative group">
                      <div className="w-6 font-mono text-stone-300 text-[10px] flex-shrink-0">{idx + 1}</div>
                      {item ? (
                        <div className="flex flex-grow items-center justify-between min-w-0">
                          <div className="flex-grow font-serif text-base leading-tight truncate pr-2">
                            <span className="font-bold">{item.name}</span>
                            <span className="text-[10px] text-stone-400 ml-2 italic">
                              {item.type === 'weapon' && item.damage && `${item.damage}`}
                              {item.type === 'armor' && item.defense && `+${item.defense}AP`}
                            </span>
                          </div>
                          {item.quality !== undefined && item.quality > 0 && (
                            <div className="flex items-center gap-1 shrink-0 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                              <span className="text-[8px] font-bold text-stone-400 uppercase">Dur:</span>
                              <span className="text-[10px] font-black">{item.quality}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex-grow border-b border-stone-100 border-dotted h-4 opacity-50"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Right Inventory Column */}
              <div className="flex flex-col">
                {Array.from({ length: Math.ceil(maxSlots / 2) }).map((_, idx) => {
                  const realIdx = idx + Math.ceil(maxSlots / 2);
                  const item = character.inventory[realIdx];
                  if (realIdx >= maxSlots) return null;
                  return (
                    <div key={`inv-r-${idx}`} className="flex border-b border-stone-300 h-9 items-center px-3 relative">
                      <div className="w-6 font-mono text-stone-300 text-[10px] flex-shrink-0">{realIdx + 1}</div>
                      {item ? (
                        <div className="flex flex-grow items-center justify-between min-w-0">
                          <div className="flex-grow font-serif text-base leading-tight truncate pr-2">
                            <span className="font-bold">{item.name}</span>
                            <span className="text-[10px] text-stone-400 ml-2 italic">
                              {item.type === 'weapon' && item.damage && `${item.damage}`}
                              {item.type === 'armor' && item.defense && `+${item.defense}AP`}
                            </span>
                          </div>
                          {item.quality !== undefined && item.quality > 0 && (
                            <div className="flex items-center gap-1 shrink-0 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                              <span className="text-[8px] font-bold text-stone-400 uppercase">Dur:</span>
                              <span className="text-[10px] font-black">{item.quality}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex-grow border-b border-stone-100 border-dotted h-4 opacity-50"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 text-xs text-center text-stone-400 font-serif shrink-0 space-y-1">
          <p>Knave by Ben Milton. Created with Knave Character Builder.</p>
          <div className="flex justify-center gap-4 opacity-75 scale-90">
            <span>成都线下跑团群：691707475</span>
            <span>不咕鸟创作交流群：261751459</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;