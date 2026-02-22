import React, { useState, useEffect } from 'react';
import { CustomItemDef, CustomSpell } from '../types';
import { generateId } from '../utils';
import { ScrollText, Coins, Plus, Trash2, Save, Wand2, Edit, X, RefreshCw } from 'lucide-react';

const HomebrewBlock: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'spells' | 'items'>('spells');
  const [customSpells, setCustomSpells] = useState<CustomSpell[]>([]);
  const [customItems, setCustomItems] = useState<CustomItemDef[]>([]);

  // Form states
  const [newSpell, setNewSpell] = useState({ name: '', description: '' });
  const [newItem, setNewItem] = useState({ name: '', cost: '', description: '' });

  // Editing states
  const [editingSpellId, setEditingSpellId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedSpells = localStorage.getItem('knave_custom_spells');
      const savedItems = localStorage.getItem('knave_custom_items');
      if (savedSpells) setCustomSpells(JSON.parse(savedSpells));
      if (savedItems) setCustomItems(JSON.parse(savedItems));
    } catch (e) {
      console.error("Failed to load homebrew content", e);
    }
  }, []);

  // Save to LocalStorage whenever lists change
  useEffect(() => {
    localStorage.setItem('knave_custom_spells', JSON.stringify(customSpells));
  }, [customSpells]);

  useEffect(() => {
    localStorage.setItem('knave_custom_items', JSON.stringify(customItems));
  }, [customItems]);

  // --- Spell Logic ---

  const handleSaveSpell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpell.name.trim()) return;

    if (editingSpellId) {
      // Update existing
      setCustomSpells(prev => prev.map(s => s.id === editingSpellId ? { ...s, ...newSpell } : s));
      setEditingSpellId(null);
    } else {
      // Create new
      setCustomSpells(prev => [...prev, { id: generateId(), ...newSpell }]);
    }
    setNewSpell({ name: '', description: '' });
  };

  const startEditSpell = (spell: CustomSpell) => {
    setNewSpell({ name: spell.name, description: spell.description });
    setEditingSpellId(spell.id);
    // Scroll to form (optional, for mobile mainly)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditSpell = () => {
    setNewSpell({ name: '', description: '' });
    setEditingSpellId(null);
  };

  const removeSpell = (id: string) => {
    if (window.confirm("确定要删除这个原创法术吗？")) {
      // Use functional update to ensure we are filtering the latest state
      setCustomSpells(prev => prev.filter(s => s.id !== id));
      if (editingSpellId === id) cancelEditSpell();
    }
  };

  // --- Item Logic ---

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    if (editingItemId) {
      // Update existing
      setCustomItems(prev => prev.map(i => i.id === editingItemId ? { ...i, ...newItem } : i));
      setEditingItemId(null);
    } else {
      // Create new
      setCustomItems(prev => [...prev, { id: generateId(), ...newItem }]);
    }
    setNewItem({ name: '', cost: '', description: '' });
  };

  const startEditItem = (item: CustomItemDef) => {
    setNewItem({ name: item.name, cost: item.cost, description: item.description });
    setEditingItemId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditItem = () => {
    setNewItem({ name: '', cost: '', description: '' });
    setEditingItemId(null);
  };

  const removeItem = (id: string) => {
    if (window.confirm("确定要删除这个原创物品吗？")) {
      // Use functional update to ensure we are filtering the latest state
      setCustomItems(prev => prev.filter(i => i.id !== id));
      if (editingItemId === id) cancelEditItem();
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-md border-2 border-stone-800 flex flex-col min-h-[500px]">
      <div className="bg-stone-900 text-white px-4 py-3 border-b-2 border-amber-600 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold font-serif tracking-wider">原创内容</h2>
          <span className="text-stone-400 text-sm font-serif italic">Homebrew Grimoires & Gear</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] text-stone-500 uppercase tracking-widest hidden sm:inline-block">Local Storage Active</span>
           <Wand2 className="text-amber-500" size={24} />
        </div>
      </div>

      <div className="flex border-b-2 border-stone-800 bg-stone-100 sticky top-[74px] z-10">
        <button
          onClick={() => setActiveTab('spells')}
          className={`flex-1 py-3 px-4 font-bold font-serif text-lg flex items-center justify-center gap-2 transition-colors
            ${activeTab === 'spells' ? 'bg-white text-stone-900 border-b-2 border-white -mb-[2px]' : 'text-stone-500 hover:bg-stone-200'}`}
        >
          <ScrollText size={20} />
          原创法术 ({customSpells.length})
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 py-3 px-4 font-bold font-serif text-lg flex items-center justify-center gap-2 transition-colors
            ${activeTab === 'items' ? 'bg-white text-stone-900 border-b-2 border-white -mb-[2px]' : 'text-stone-500 hover:bg-stone-200'}`}
        >
          <Coins size={20} />
          原创物品 ({customItems.length})
        </button>
      </div>

      <div className="p-6 bg-white min-h-[400px]">
        {activeTab === 'spells' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Spell Form */}
            <div className="lg:col-span-1 bg-stone-50 p-4 rounded border border-stone-200 h-fit sticky top-40 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 font-serif text-stone-900 border-b border-stone-200 pb-2">
                {editingSpellId ? <RefreshCw size={18} className="text-amber-600"/> : <Plus size={18} />} 
                {editingSpellId ? '编辑法术' : '添加新法术'}
              </h3>
              <form onSubmit={handleSaveSpell} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">法术名称</label>
                  <input 
                    className="w-full border border-stone-300 rounded p-2 font-serif focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800"
                    value={newSpell.name}
                    onChange={e => setNewSpell({...newSpell, name: e.target.value})}
                    placeholder="例如：火球术"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">法术描述</label>
                  <textarea 
                    className="w-full border border-stone-300 rounded p-2 font-serif h-32 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 resize-none"
                    value={newSpell.description}
                    onChange={e => setNewSpell({...newSpell, description: e.target.value})}
                    placeholder="描述效果、持续时间等..."
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className={`flex-grow ${editingSpellId ? 'bg-amber-700 hover:bg-amber-800' : 'bg-stone-800 hover:bg-stone-700'} text-white py-2 rounded font-bold transition-colors flex justify-center gap-2 items-center`}>
                    <Save size={16} /> {editingSpellId ? '更新法术' : '保存到本地'}
                  </button>
                  {editingSpellId && (
                    <button type="button" onClick={cancelEditSpell} className="bg-stone-200 text-stone-600 px-3 rounded hover:bg-stone-300 transition-colors" title="取消编辑">
                      <X size={18} />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Spell List */}
            <div className="lg:col-span-2 grid grid-cols-1 gap-4 content-start">
               {customSpells.length === 0 ? (
                 <div className="text-center text-stone-400 py-12 border-2 border-dashed border-stone-200 rounded">
                   暂无原创法术。请在左侧添加。<br/>所有数据将自动保存在您的浏览器中。
                 </div>
               ) : (
                 customSpells.map(spell => (
                   <div key={spell.id} className={`relative group bg-white border rounded p-4 transition-all ${editingSpellId === spell.id ? 'border-amber-500 ring-1 ring-amber-500 shadow-md bg-amber-50/30' : 'border-stone-200 hover:shadow-md'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold font-serif text-lg text-amber-900">{spell.name}</h4>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={() => startEditSpell(spell)} 
                            className="text-stone-400 hover:text-stone-900 hover:bg-stone-100 p-1 rounded"
                            title="编辑"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => removeSpell(spell.id)} 
                            className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
                            title="删除"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap font-serif">
                        {spell.description}
                      </p>
                   </div>
                 ))
               )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Item Form */}
             <div className="lg:col-span-1 bg-stone-50 p-4 rounded border border-stone-200 h-fit sticky top-40 shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 font-serif text-stone-900 border-b border-stone-200 pb-2">
                {editingItemId ? <RefreshCw size={18} className="text-amber-600"/> : <Plus size={18} />} 
                {editingItemId ? '编辑物品' : '添加新物品'}
              </h3>
              <form onSubmit={handleSaveItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">物品名称</label>
                  <input 
                    className="w-full border border-stone-300 rounded p-2 font-serif focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800"
                    value={newItem.name}
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                    placeholder="例如：魔法飞毯"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">费用 (Cost)</label>
                  <input 
                    className="w-full border border-stone-300 rounded p-2 font-serif focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800"
                    value={newItem.cost}
                    onChange={e => setNewItem({...newItem, cost: e.target.value})}
                    placeholder="例如：500c"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">描述/备注</label>
                  <textarea 
                    className="w-full border border-stone-300 rounded p-2 font-serif h-24 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800 resize-none"
                    value={newItem.description}
                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                    placeholder="功能、栏位占用等..."
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className={`flex-grow ${editingItemId ? 'bg-amber-700 hover:bg-amber-800' : 'bg-stone-800 hover:bg-stone-700'} text-white py-2 rounded font-bold transition-colors flex justify-center gap-2 items-center`}>
                    <Save size={16} /> {editingItemId ? '更新物品' : '保存到本地'}
                  </button>
                  {editingItemId && (
                    <button type="button" onClick={cancelEditItem} className="bg-stone-200 text-stone-600 px-3 rounded hover:bg-stone-300 transition-colors" title="取消编辑">
                      <X size={18} />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Item List */}
             <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
               {customItems.length === 0 ? (
                 <div className="col-span-full text-center text-stone-400 py-12 border-2 border-dashed border-stone-200 rounded">
                   暂无原创物品。请在左侧添加。<br/>所有数据将自动保存在您的浏览器中。
                 </div>
               ) : (
                 customItems.map(item => (
                   <div key={item.id} className={`relative group bg-white border rounded p-3 transition-all ${editingItemId === item.id ? 'border-amber-500 ring-1 ring-amber-500 shadow-md bg-amber-50/30' : 'border-stone-200 hover:shadow-md'}`}>
                      <div className="flex justify-between items-start border-b border-stone-100 pb-2 mb-2">
                        <h4 className="font-bold font-serif text-stone-900">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-amber-700 font-bold text-sm">{item.cost}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                            <button onClick={() => startEditItem(item)} type="button" className="text-stone-300 hover:text-stone-800 p-0.5" title="编辑">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => removeItem(item.id)} type="button" className="text-stone-300 hover:text-red-500 p-0.5" title="删除">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-stone-600 text-xs leading-relaxed font-serif">
                        {item.description || "无描述"}
                      </p>
                   </div>
                 ))
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomebrewBlock;