import React, { useState } from 'react';
import { SPELLS_DATA, ITEM_PRICES, MAGIC_RULES } from '../constants';
import { Search, ScrollText, Coins, Sparkles, Book, ShieldAlert, Dices } from 'lucide-react';
import { secureRandom } from '../utils';

const ReferenceBlock: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'spells' | 'items'>('spells');
  const [filter, setFilter] = useState('');
  const [randomSpell, setRandomSpell] = useState<typeof SPELLS_DATA[0] | null>(null);

  const filteredSpells = SPELLS_DATA.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));

  const handleRandomSpell = () => {
    const idx = Math.floor(secureRandom() * SPELLS_DATA.length);
    setRandomSpell(SPELLS_DATA[idx]);
    setFilter(''); // 清空筛选，让高亮可见
  };

  return (
    <div className="bg-white rounded-sm shadow-md border-2 border-stone-800 flex flex-col min-h-[500px]">
      {/* Header/Tabs */}
      <div className="bg-stone-900 text-white px-4 py-3 border-b-2 border-amber-600 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold font-serif tracking-wider">速查表</h2>
          <span className="text-stone-400 text-sm font-serif italic">Quick Reference - 法术与物品</span>
        </div>
      </div>
      <div className="flex border-b-2 border-stone-800 bg-stone-100 sticky top-[74px] z-10">
        <button
          onClick={() => setActiveTab('spells')}
          className={`flex-1 py-3 px-4 font-bold font-serif text-lg flex items-center justify-center gap-2 transition-colors
            ${activeTab === 'spells' ? 'bg-white text-stone-900 border-b-2 border-white -mb-[2px]' : 'text-stone-500 hover:bg-stone-200'}`}
        >
          <ScrollText size={20} />
          无等级法术
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 py-2 px-2 sm:py-3 sm:px-4 font-bold font-serif text-sm sm:text-lg flex items-center justify-center gap-2 transition-colors
            ${activeTab === 'items' ? 'bg-white text-stone-900 border-b-2 border-white -mb-[2px]' : 'text-stone-500 hover:bg-stone-200'}`}
        >
          <Coins size={20} />
          物品费用
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-stone-200 bg-stone-50">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder={activeTab === 'spells' ? "搜索法术..." : "搜索物品..."}
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setRandomSpell(null); }}
              className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-600 font-serif"
            />
          </div>
          {activeTab === 'spells' && (
            <button
              onClick={handleRandomSpell}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-bold rounded transition-colors shrink-0 text-sm"
              title="随机获取一条法术"
            >
              <Dices size={16} /> 随机法术
            </button>
          )}
        </div>
      </div>
      {/* 随机法术结果：按钮之下、规则之上 */}
      {randomSpell && activeTab === 'spells' && (
        <div className="px-4 pb-3 pt-2 bg-stone-50 border-b border-stone-200">
          <div className="p-3 bg-amber-50 border-2 border-amber-400 rounded shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                <Dices size={12} /> 随机法术结果
              </span>
              <button onClick={() => setRandomSpell(null)} className="text-amber-400 hover:text-amber-700 text-xs font-bold">✕ 关闭</button>
            </div>
            <div className="font-serif font-bold text-stone-900 text-lg">{randomSpell.name}</div>
            <p className="text-sm text-stone-700 mt-1 leading-snug">{randomSpell.desc}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 bg-white">
        {activeTab === 'spells' ? (
          <div>
            {/* Magic Rules Section */}
            {!filter && (
              <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded text-sm text-stone-700 space-y-3">
                <h3 className="font-bold font-serif text-lg text-amber-900 border-b border-amber-200 pb-1 flex items-center gap-2">
                  <Sparkles size={18} /> 魔法说明
                </h3>
                <p>{MAGIC_RULES.intro}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white/50 p-3 rounded border border-amber-100">
                    <strong className="block text-amber-800 mb-1 flex items-center gap-1"><Book size={14} /> 施法与魔典</strong>
                    {MAGIC_RULES.casting}
                    <br /><br />
                    {MAGIC_RULES.grimoires}
                  </div>
                  <div className="bg-white/50 p-3 rounded border border-amber-100 h-fit">
                    <strong className="block text-amber-800 mb-1 flex items-center gap-1"><ShieldAlert size={14} /> 豁免检定</strong>
                    {MAGIC_RULES.saves}
                  </div>
                </div>
              </div>
            )}

            {/* 法术列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSpells.length > 0 ? (
                filteredSpells.map((spell, idx) => (
                  <div
                    key={idx}
                    className={`group relative p-3 border rounded transition-colors ${randomSpell?.name === spell.name
                      ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-300'
                      : 'border-stone-200 hover:bg-stone-50 hover:border-stone-400'
                      }`}
                  >
                    <div className="flex gap-2 items-baseline mb-1">
                      <span className="font-mono text-stone-400 text-xs w-6 text-right font-bold">{idx + 1}.</span>
                      <span className="font-serif text-stone-900 font-bold">{spell.name}</span>
                    </div>
                    <p className="text-sm text-stone-600 pl-8 leading-snug">{spell.desc}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-stone-400 italic">未找到匹配的法术</div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(ITEM_PRICES).map(([category, items]) => {
              const filteredItems = items.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()));
              if (filteredItems.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="font-bold text-stone-900 border-b-2 border-stone-800 mb-2 pb-1 font-serif text-xl">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 border-b border-stone-100 hover:bg-stone-50">
                        <span className="font-serif text-stone-800">{item.name}</span>
                        <span className="font-mono font-bold text-amber-700">{item.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {Object.values(ITEM_PRICES).flat().filter(i => i.name.toLowerCase().includes(filter.toLowerCase())).length === 0 && (
              <div className="text-center py-8 text-stone-400 italic">未找到匹配的物品</div>
            )}
            <div className="text-xs text-stone-500 mt-4 border-t pt-2">
              注：所有价格均以铜便士(c)计算。对于船只、房地产等物的回报通常表现为以易货、馈赠或宣誓效忠，而非钱币。
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferenceBlock;