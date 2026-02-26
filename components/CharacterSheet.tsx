import React, { useRef, useCallback } from 'react';
import { Character, StatName, Stat } from '../types';
import { toPng } from 'html-to-image';
import { Download, ArrowLeft, Loader2, FileText, Heart, Package, Shield, Swords, Activity, Map, ArrowDown, Save } from 'lucide-react';
import { secureRandom } from '../utils';

interface CharacterSheetProps {
  character: Character;
  onEdit: () => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onEdit }) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Generate empty rows for printing if inventory is not full
  const maxSlots = 10 + character.stats[StatName.Constitution].value;
  const renderCount = Math.max(maxSlots, character.inventory.length);
  const leftColCount = Math.ceil(renderCount / 2);
  const rightColCount = renderCount - leftColCount;

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
      link.download = `${character.name || 'Knave_Character'} _Sheet.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('生成图片失败，请重试或使用浏览器打印功能。');
    } finally {
      setIsGenerating(false);
    }
  }, [character.name]);

  const handleDownloadMd = useCallback(() => {
    let md = `# KNAVE 角色卡\n\n`;
    md += `** 姓名:** ${character.name || '无名氏'} \n\n`;
    md += `** 等级:** ${character.level} | ** 经验值:** ${character.xp}/1000\n\n`;
    md += `**生命值 (HP):** ${character.hp.current} / ${character.hp.max}\n\n`;
    md += `**护甲 (AC):** ${totalDefense}\n\n`;

    md += `## 属性\n\n`;
    (Object.values(character.stats) as Stat[]).forEach(stat => {
      md += `- **${stat.name}:** ${stat.value}\n`;
    });
    md += `\n`;

    md += `## 特征\n\n`;
    const TRAIT_LABELS: Record<string, string> = {
      background: '背景 Background',
      physique: '体格 Physique',
      face: '面容 Face',
      skin: '皮肤 Skin',
      hair: '毛发 Hair',
      clothing: '衣物 Clothing',
      speech: '言谈 Speech',
      virtue: '美德 Virtue',
      vice: '恶癖 Vice',
      misfortune: '厄运 Misfortune',
      alignment: '阵营 Alignment',
    };
    Object.entries(character.traits).forEach(([k, v]) => {
      md += `- **${TRAIT_LABELS[k] || k.toUpperCase()}:** ${v || '---'}\n`;
    });
    md += `\n`;

    md += `## 物品栏 (${character.inventory.reduce((s, i) => s + (i.slots || 0), 0)}/${maxSlots} 栏位)\n\n`;
    character.inventory.forEach((i, idx) => {
      md += `${idx + 1}. **${i.name}**`;
      if (i.slots !== 1) md += ` (${i.slots}栏位)`;
      if (i.type === 'weapon' && i.damage) md += ` [伤害:${i.damage}]`;
      if (i.type === 'armor' && i.defense) md += ` [防御:+${i.defense}]`;
      if (i.quality !== undefined && i.quality > 0) md += ` (耐久:${i.quality})`;
      md += `\n`;
    });

    if (character.memo) {
      md += `\n## 个人备忘\n\n${character.memo}\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.name || 'Knave_Character'}_Sheet.md`;
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
            onClick={handleDownloadMd}
            className="flex items-center justify-center gap-2 bg-stone-100 text-stone-800 border border-stone-300 px-4 py-2 rounded shadow hover:bg-stone-50 transition-all font-bold flex-grow sm:flex-grow-0"
          >
            <FileText size={20} />
            保存为MD
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
      <div ref={sheetRef} className="bg-white p-8 shadow-2xl print:shadow-none print:p-0 text-black min-h-[297mm] flex flex-col relative">
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
        <div className="flex flex-col gap-6 flex-grow">

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
              {/* Background row */}
              <div className="flex border-b border-black text-xs font-serif font-bold h-8 mb-1">
                <div className="flex-1 flex flex-col justify-center px-2 relative">
                  <div className="uppercase text-[8px] text-stone-400">BACKGROUND</div>
                  <div className="text-sm font-bold">{character.traits.background || '—'}</div>
                </div>
              </div>
              {/* Traits grid: 2 columns x 5 rows */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
                {([
                  ['PHYSIQUE 体格', character.traits.physique],
                  ['FACE 面容', character.traits.face],
                  ['SKIN 皮肤', character.traits.skin],
                  ['HAIR 毛发', character.traits.hair],
                  ['CLOTHING 衣物', character.traits.clothing],
                  ['SPEECH 言谈', character.traits.speech],
                  ['VIRTUE 美德', character.traits.virtue],
                  ['VICE 恶癖', character.traits.vice],
                  ['MISFORTUNE 厄运', character.traits.misfortune],
                  ['ALIGNMENT 阵营', character.traits.alignment],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex flex-col border-b border-stone-200 py-0.5">
                    <span className="uppercase text-[8px] text-stone-400 leading-none">{label}</span>
                    <span className="font-serif font-bold text-[11px] text-stone-800 leading-tight">{value || '—'}</span>
                  </div>
                ))}
              </div>
              <div className="absolute top-2 right-3 text-[8px] text-stone-300 font-mono">ID: {secureRandom().toString(36).substr(2, 9).toUpperCase()}</div>
            </div>
          </div>

          {/* Bottom Section: Inventory - Full Width */}
          <div className="border-2 border-black flex flex-col flex-grow">
            <div className="bg-black text-white font-bold px-3 py-1.5 uppercase flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-lg tracking-widest">Inventory Slots</span>
                <span className="text-[10px] font-normal opacity-60">物品栏位</span>
              </div>
              <span className="text-xs font-mono">Encumbrance: {character.inventory.reduce((s, i) => s + (i.slots || 0), 0)} / {maxSlots}</span>
            </div>

            <div className="grid grid-cols-2 flex-grow">
              {/* Left Inventory Column */}
              <div className="border-r border-black flex flex-col">
                {Array.from({ length: leftColCount }).map((_, idx) => {
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
                {Array.from({ length: rightColCount }).map((_, idx) => {
                  const realIdx = idx + leftColCount;
                  const item = character.inventory[realIdx];
                  if (realIdx >= renderCount) return null;
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