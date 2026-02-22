import React from 'react';
import { Item } from '../types';
import { Trash2, Plus, Backpack, Shield, Sword, Hammer } from 'lucide-react';

interface InventoryBlockProps {
  inventory: Item[];
  maxSlots: number;
  onAddItem: (item: Item) => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, updates: Partial<Item>) => void;
  onAutoGenerate: () => void;
}

const InventoryBlock: React.FC<InventoryBlockProps> = ({ 
  inventory, 
  maxSlots, 
  onAddItem, 
  onRemoveItem, 
  onUpdateItem,
  onAutoGenerate
}) => {
  const [newItemName, setNewItemName] = React.useState('');
  
  const totalSlotsUsed = inventory.reduce((sum, item) => sum + item.slots, 0);
  const isOverencumbered = totalSlotsUsed > maxSlots;

  // Calculate Total Armor Defense
  const armorItems = inventory.filter(i => i.type === 'armor');
  
  // Find base AC from body armor (Defense >= 10). Default is 11 (Unarmored).
  const bodyArmors = armorItems.filter(i => (i.defense || 0) >= 10);
  const baseAC = bodyArmors.reduce((max, item) => Math.max(max, item.defense || 0), 11);
  
  // Sum bonuses from accessories (shields/helmets, Defense < 10).
  const bonusAC = armorItems
    .filter(i => (i.defense || 0) < 10)
    .reduce((sum, i) => sum + (i.defense || 0), 0);
    
  const totalDefense = baseAC + bonusAC;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem({
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      slots: 1,
      type: 'gear',
      quality: 3
    });
    setNewItemName('');
  };

  return (
    <div className="bg-white p-4 rounded-sm shadow-md border-2 border-stone-800 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b pb-2 border-stone-300">
        <h2 className="text-2xl font-bold font-serif">物品栏 (Inventory)</h2>
        <button 
          onClick={onAutoGenerate}
          className="flex items-center gap-1 px-3 py-1 bg-amber-700 text-white rounded text-sm hover:bg-amber-800 transition-colors"
        >
          <Backpack size={16} />
          一键初始装备
        </button>
      </div>

      <div className="mb-4 bg-stone-100 p-3 rounded-sm border border-stone-200 space-y-2">
        <div className="flex items-center justify-between">
            <span className="font-bold text-stone-600 text-sm uppercase tracking-wide">负重 (Slots)</span>
            <div className={`font-mono font-bold text-lg ${isOverencumbered ? 'text-red-600' : 'text-stone-800'}`}>
            {totalSlotsUsed} / {maxSlots}
            </div>
        </div>
        <div className="flex items-center justify-between border-t border-stone-300 pt-2">
            <span className="font-bold text-stone-600 text-sm uppercase tracking-wide flex items-center gap-1">
                <Shield size={14} />
                总护甲 (AC)
            </span>
            <div className="font-mono font-bold text-lg text-stone-800">
            {totalDefense}
            </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto mb-4 border border-stone-200 rounded min-h-[400px]">
        {inventory.length === 0 ? (
          <div className="text-center text-stone-400 py-8 italic">空空如也...</div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {inventory.map((item) => (
              <li key={item.id} className="p-2 hover:bg-stone-50 group transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2 flex-grow">
                    {/* Slot Count */}
                    <button 
                       onClick={() => onUpdateItem(item.id, { slots: Math.max(0, item.slots + 1) % 10 })}
                       title="点击修改占用栏位"
                       className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-stone-200 hover:bg-stone-300 rounded-full text-xs font-bold text-stone-600 transition-colors"
                    >
                      {item.slots}
                    </button>
                    
                    {/* Item Name */}
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
                      className="font-serif text-stone-800 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-stone-800 focus:outline-none w-full"
                    />

                    {/* Type Toggles */}
                    <div className="flex gap-1">
                      <button 
                        onClick={() => onUpdateItem(item.id, { type: item.type === 'armor' ? 'gear' : 'armor' })}
                        className={`p-1 rounded ${item.type === 'armor' ? 'bg-slate-200 text-slate-700' : 'text-stone-300 hover:text-stone-400'}`}
                        title="标记为护甲"
                      >
                        <Shield size={14} />
                      </button>
                      <button 
                        onClick={() => onUpdateItem(item.id, { type: item.type === 'weapon' ? 'gear' : 'weapon' })}
                        className={`p-1 rounded ${item.type === 'weapon' ? 'bg-red-100 text-red-700' : 'text-stone-300 hover:text-stone-400'}`}
                        title="标记为武器"
                      >
                        <Sword size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="ml-2 text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Conditional Stats Row */}
                {(item.type === 'armor' || item.type === 'weapon') && (
                   <div className="ml-8 flex gap-4 text-xs items-center text-stone-500 bg-stone-50/50 p-1 rounded">
                      
                      {item.type === 'armor' && (
                        <div className="flex items-center gap-1">
                          <span className="uppercase font-bold text-[10px]">Def:</span>
                          <input 
                            type="number" 
                            placeholder="0"
                            value={item.defense || ''}
                            onChange={(e) => onUpdateItem(item.id, { defense: parseInt(e.target.value) || 0 })}
                            className="w-8 border-b border-stone-300 bg-transparent text-center focus:outline-none focus:border-stone-800 text-stone-900 font-bold"
                          />
                        </div>
                      )}

                      {item.type === 'weapon' && (
                        <div className="flex items-center gap-1">
                          <span className="uppercase font-bold text-[10px]">Dmg:</span>
                          <input 
                            type="text" 
                            placeholder="d6"
                            value={item.damage || ''}
                            onChange={(e) => onUpdateItem(item.id, { damage: e.target.value })}
                            className="w-12 border-b border-stone-300 bg-transparent text-center focus:outline-none focus:border-stone-800 text-stone-900 font-bold"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Hammer size={10} className="text-stone-400"/>
                        <span className="uppercase font-bold text-[10px]">Qual:</span>
                        <input 
                          type="number" 
                          placeholder="3"
                          value={item.quality}
                          onChange={(e) => onUpdateItem(item.id, { quality: parseInt(e.target.value) || 0 })}
                          className="w-8 border-b border-stone-300 bg-transparent text-center focus:outline-none focus:border-stone-800 text-stone-900 font-bold"
                        />
                      </div>

                   </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input 
          type="text" 
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="添加物品..."
          className="flex-grow border border-stone-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-stone-500"
        />
        <button type="submit" className="bg-stone-800 text-white px-3 py-1 rounded hover:bg-stone-700">
          <Plus size={16} />
        </button>
      </form>
    </div>
  );
};

export default InventoryBlock;