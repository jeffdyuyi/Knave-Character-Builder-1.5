import React, { useState } from 'react';
import { SPELLS_DATA, ITEM_PRICES, MAGIC_RULES } from '../constants';
import { Search, ScrollText, Coins, Sparkles, Book, ShieldAlert, Dices, Star, Package, Wand2 } from 'lucide-react';
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
              <div className="mb-6 space-y-4">

                {/* ── 施法 ── */}
                <div className="bg-amber-50 border border-amber-200 rounded p-4">
                  <h3 className="font-bold font-serif text-lg text-amber-900 border-b border-amber-200 pb-1 mb-3 flex items-center gap-2">
                    <Sparkles size={18} /> 施法 (Spellcasting)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-stone-700">
                    <div className="bg-white/70 p-3 rounded border border-amber-100 space-y-2">
                      <strong className="block text-amber-800 flex items-center gap-1"><Book size={14} /> 法术书 (Grimoires)</strong>
                      <p>一本<span className="font-bold">法术书</span>占据一个物品栏位，并且包含一个单独的法术。它们不能由玩家角色创造或复制，必须在<span className="font-bold">探索地下城时找到</span>，或从其他魔法使用者那里<span className="font-bold">偷来</span>。</p>
                      <p><span className="font-bold">施放法术：</span>施放一个法术需要<span className="font-bold">一个动作</span>。每本法术书<span className="font-bold">每天只能使用一次</span>，但玩家角色每天可以使用的法术书数量<span className="font-bold text-amber-700">等同于其智力值</span>。</p>
                    </div>
                    <div className="bg-white/70 p-3 rounded border border-amber-100 space-y-2">
                      <strong className="block text-amber-800">法术说明</strong>
                      <p>当描述中出现<span className="font-bold font-mono">「智力（INT）」</span>时，用任何不超过施法者智力值的数字替换它，该数字在需要时算作法术的等级。</p>
                      <p>「<span className="font-bold">物品（item）</span>」是指可以用一只手举起的物体；「<span className="font-bold">物件（object）</span>」是指任何不超过人类大小的东西。除非另有说明，所有持续效果的法术持续 <span className="font-bold">10 分钟（1 回合）</span>，施法距离为 <span className="font-bold">40 英尺</span>。</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded border border-purple-100">
                      <strong className="block text-purple-900 mb-1">混沌法术书 (Chaos Grimoires)</strong>
                      <p className="text-purple-800">这些法术书会在前一个法术被施放后的<span className="font-bold">第一个黎明</span>，将其法术替换为一个<span className="font-bold">随机的新法术</span>。新法术可以从法术列表中掷骰获得，或随机生成。</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border border-blue-100">
                      <strong className="block text-blue-900 mb-1 flex items-center gap-1"><ShieldAlert size={14} /> 豁免 (Saves)</strong>
                      <p className="text-blue-800">当一个法术针对一个<span className="font-bold">不情愿的、等级高于该法术</span>的生物时，该生物可以进行一次对抗法术等级的检定。<span className="font-bold">成功时</span>，法术效果减半；检定结果<span className="font-bold">超出目标值 10 点或更多</span>，则效果无效。</p>
                    </div>
                  </div>
                </div>

                {/* ── 圣物魔法 ── */}
                <div className="bg-stone-50 border border-stone-200 rounded p-4">
                  <h3 className="font-bold font-serif text-lg text-stone-900 border-b border-stone-200 pb-1 mb-3 flex items-center gap-2">
                    <Star size={18} className="text-amber-600" /> 圣物魔法 (Relic Magic)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-stone-700">
                    <div className="space-y-1">
                      <strong className="block flex items-center gap-1"><Package size={13} className="text-stone-500" /> 守护者 (Patrons)</strong>
                      <p>守护者是强大的魔法存在（通常是非实体的），他们通过圣物将部分力量授予玩家角色。他们可能是<span className="font-bold">小神、圣徒、自然之灵、异界来客</span>等。每位守护者都有一个或两个他们最为关注的<span className="font-bold text-amber-700">领域</span>，无论是积极的还是消极的。</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="block flex items-center gap-1"><Package size={13} className="text-stone-500" /> 圣物 (Relics)</strong>
                      <p>圣物是与特定守护者服务绑定的魔法物品，通常在<span className="font-bold">地下城或神龛</span>中找到。如果守护者愿意，玩家角色的物品也可以转化为圣物。圣物总是至少占据<span className="font-bold">一个物品栏位</span>。</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="block">神龛 (Shrines)</strong>
                      <p>神龛是供奉特定守护者的宗教场所，玩家角色可以在那里自由地与他们交流，前提是他们获得了守护者的<span className="font-bold">恩宠</span>并且至少拥有一件其圣物。城市里有供奉所有守护者的神龛，城镇有 <span className="font-bold">d6 个</span>神龛，而村庄通常只有<span className="font-bold">一个</span>神龛。</p>
                    </div>
                    <div className="space-y-1">
                      <strong className="block">祝福 (Blessings)</strong>
                      <p>找到圣物并与守护者交流后，守护者会给出一个<span className="font-bold">任务</span>。完成任务后，守护者为圣物注入一个与其领域相关的<span className="font-bold">持续性祝福</span>（小而有用的东西，应与玩家合作设计）。玩家角色可以拥有任意数量的圣物，但同时只能激活<span className="font-bold text-amber-700">等同于魅力值</span>的祝福数量，激活的祝福在每个早晨确定。</p>
                    </div>
                    <div className="md:col-span-2 border-t border-stone-200 pt-2">
                      <strong className="block mb-1">恩宠与失宠 (Favor & Disfavor)</strong>
                      <p>玩家角色如果采取了与守护者目标相悖的行动，可能招致<span className="font-bold text-red-700">失宠</span>，守护者可能切断对其祝福的获取。重获恩宠通常意味着为他们<span className="font-bold">完成另一个任务</span>或为过失赎罪。如果玩家角色尽力保持恩宠，则可能获得<span className="font-bold text-green-700">更强大的祝福</span>、额外的圣物或追随者作为奖励。</p>
                    </div>
                  </div>
                </div>

                {/* ── 生成新法术 ── */}
                <div className="bg-purple-50 border border-purple-200 rounded p-4">
                  <h3 className="font-bold font-serif text-lg text-purple-900 border-b border-purple-200 pb-1 mb-3 flex items-center gap-2">
                    <Wand2 size={18} /> 生成新法术 (Generating New Spells)
                  </h3>
                  <p className="text-sm text-stone-700 mb-3">
                    游戏主持人可以使用<span className="font-bold">法术公式表</span>来生成新的法术书，或为混沌法术书创造法术。掷出一个公式后，将括号内的词替换为对应随机表格的结果，以创造法术名称（确切措辞可以调整）。然后，游戏主持人和玩家可以共同确定法术的效果。
                  </p>
                  <div className="bg-white/80 border border-purple-100 rounded p-3 text-sm text-stone-700">
                    <strong className="block text-purple-800 mb-1">示例</strong>
                    <p>掷出公式 <span className="font-bold font-mono">「[名字]的[品质][元素][形态]」</span>，替换后可能得到<span className="font-bold">「阿斯特温的虹彩泪水之环」</span>。玩家将其调整为「阿斯特温的虹彩泪环」，并提议这会在地面上创造一个闪闪发光的圆环，使任何身处其中的人开始无法控制地哭泣。游戏主持人同意，并明确指出该圆环的宽度为<span className="font-bold">智力（INT）× 10 英尺</span>，身处其中的生物每轮都必须通过一次感知检定，否则该轮所有检定都会受到 <span className="font-bold text-red-700">-5 的罚值</span>。无法哭泣的生物不会受到影响。</p>
                  </div>
                  <p className="text-xs text-stone-500 mt-2 italic">可参照 DM 工具中的「魔法与法术」相关表格获取法术生成素材。</p>
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