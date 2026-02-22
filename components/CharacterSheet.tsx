import React, { useRef, useCallback } from 'react';
import { Character, StatName, Stat } from '../types';
import { toPng } from 'html-to-image';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';

interface CharacterSheetProps {
  character: Character;
  onEdit: () => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onEdit }) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Generate empty rows for printing if inventory is not full
  const maxSlots = character.stats[StatName.Constitution].defense;
  const emptySlots = Math.max(0, maxSlots - character.inventory.length);

  // Calculate Armor Class from inventory
  const armorItems = character.inventory.filter(i => i.type === 'armor');
  
  // Logic: Body armor usually has Defense >= 10. Bonus items (shield/helm) usually have Defense <= 5.
  // Find the single highest body armor, default to 11 (unarmored)
  const bodyArmors = armorItems.filter(i => (i.defense || 0) >= 10);
  
  // Fix TS Error: Explicitly define the accumulator type to handle both the default object and Item objects
  const bestBodyArmor = bodyArmors.reduce(
    (prev, current) => {
      const currentDefense = current.defense || 0;
      return prev.defense > currentDefense 
        ? prev 
        : { defense: currentDefense, name: current.name };
    }, 
    { defense: 11, name: 'Unarmored' } as { defense: number; name: string }
  );
  
  // Sum bonuses from other items (shields, helmets, or anything with defense < 10)
  const bonuses = armorItems
    .filter(i => (i.defense || 0) < 10)
    .reduce((sum, i) => sum + (i.defense || 0), 0);
  
  const totalDefense = (bestBodyArmor.defense || 11) + bonuses;
  const armorDescription = [
    bestBodyArmor.name !== 'Unarmored' ? bestBodyArmor.name : '',
    ...armorItems.filter(i => (i.defense || 0) < 10).map(i => i.name)
  ].filter(Boolean).join(' + ');

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

  return (
    <div className="max-w-[210mm] mx-auto">
      {/* Controls - No Print / No Capture */}
      <div className="no-print mb-6 flex justify-between items-center bg-stone-200 p-4 rounded-sm border border-stone-300 shadow-sm">
        <button 
          onClick={onEdit} 
          className="flex items-center gap-2 text-stone-700 hover:text-stone-900 font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          返回编辑 (Back)
        </button>
        <button 
          onClick={handleDownloadPng} 
          disabled={isGenerating}
          className="flex items-center gap-2 bg-stone-800 text-white px-6 py-2 rounded shadow hover:bg-stone-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
          {isGenerating ? '生成中...' : '保存为图片 (Save as PNG)'}
        </button>
      </div>

      {/* The Sheet - Capture Target */}
      <div ref={sheetRef} className="bg-white p-8 shadow-2xl print:shadow-none print:p-0 text-black aspect-[210/297] flex flex-col">
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
        <div className="grid grid-cols-12 gap-6 flex-grow">
          
          {/* Left Column: Stats */}
          <div className="col-span-4 flex flex-col gap-6">
            
            {/* Attributes Table */}
            <div className="border-2 border-black">
              <div className="grid grid-cols-4 bg-black text-white text-xs font-bold p-1 text-center uppercase">
                <div>Def.</div>
                <div className="col-span-2">Attribute</div>
                <div>Bonus</div>
              </div>
              {(Object.values(character.stats) as Stat[]).map((stat) => (
                <div key={stat.name} className="grid grid-cols-4 border-b border-stone-300 last:border-0 text-center items-center h-10">
                   <div className="font-bold text-lg border-r border-stone-300">{stat.defense}</div>
                   <div className="col-span-2 font-serif font-bold text-lg uppercase tracking-wide">{stat.name}</div>
                   <div className="font-bold text-lg border-l border-stone-300">+{stat.bonus}</div>
                </div>
              ))}
            </div>

            {/* Armor Class */}
            <div className="border-2 border-black p-2 text-center">
              <div className="uppercase text-xs font-bold tracking-widest text-stone-500 mb-1">Armor Defense</div>
              <div className="text-5xl font-black">{totalDefense}</div>
              <div className="text-sm italic mt-1 px-2 truncate">{armorDescription || "无甲"}</div>
            </div>

            {/* Hit Points */}
            <div className="border-2 border-black p-2 text-center">
              <div className="flex justify-between text-xs font-bold uppercase border-b border-black pb-1 mb-2">
                <span>Max HP</span>
                <span>Current</span>
              </div>
              <div className="flex justify-between items-baseline px-4">
                <span className="text-3xl font-bold text-stone-400">{character.hp.max}</span>
                <span className="text-5xl font-black">{character.hp.current}</span>
              </div>
            </div>

             {/* Traits List */}
             <div className="border-2 border-black p-4 text-sm font-serif flex-grow">
              <h3 className="font-bold uppercase border-b border-black mb-2">Traits</h3>
              <ul className="space-y-1">
                {Object.entries(character.traits).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span className="capitalize text-stone-500 text-xs">{key}:</span>
                    <span className="font-bold">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column: Inventory */}
          <div className="col-span-8 flex flex-col h-full">
            <div className="border-2 border-black h-full flex flex-col">
               <div className="bg-black text-white font-bold p-2 uppercase flex justify-between items-center shrink-0">
                 <span>Inventory Slots</span>
                 <span className="text-xs font-normal opacity-75">Max: {maxSlots}</span>
               </div>
               
               {/* Inventory Rows */}
               <div className="flex flex-col flex-grow">
                 {character.inventory.map((item, idx) => (
                   <div key={item.id} className="flex border-b border-stone-400 min-h-[40px] items-center px-2 py-1">
                     <div className="w-8 font-mono text-stone-400 text-xs flex-shrink-0">{idx + 1}.</div>
                     <div className="flex-grow font-serif text-lg leading-tight">
                       {item.name}
                       {/* Show Stats inline for sheet */}
                       <span className="text-sm text-stone-500 ml-2">
                          {item.type === 'weapon' && item.damage && `(${item.damage})`}
                          {item.type === 'armor' && item.defense && item.defense >= 10 && `(AC ${item.defense})`}
                          {item.type === 'armor' && item.defense && item.defense < 10 && `(+${item.defense} AC)`}
                       </span>
                     </div>
                     {item.quality !== undefined && (
                        <div className="w-16 text-center text-xs text-stone-500 border-l border-r border-stone-200 mx-2">
                           Q: {item.quality}
                        </div>
                     )}
                     <div className="w-12 text-center text-xs flex-shrink-0">
                       {item.slots > 1 ? `${item.slots} slots` : ''}
                     </div>
                   </div>
                 ))}
                 {/* Empty Rows */}
                 {Array.from({ length: emptySlots }).map((_, idx) => (
                   <div key={`empty-${idx}`} className="flex border-b border-stone-400 h-10 items-center px-2 opacity-50 last:border-b-0">
                      <div className="w-8 font-mono text-stone-300 text-xs">{character.inventory.length + idx + 1}.</div>
                      <div className="flex-grow border-b border-stone-200 border-dotted h-6"></div>
                   </div>
                 ))}
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