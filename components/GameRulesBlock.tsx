import React from 'react';
import { ShieldAlert, Swords, HeartPulse, Scale, Dices, User, Users, ArrowUpCircle, Backpack, Skull } from 'lucide-react';

const GameRulesBlock: React.FC = () => {
  return (
    <div className="bg-white rounded-sm shadow-md border-2 border-stone-800 flex flex-col min-h-[500px] text-stone-900">
      <div className="bg-stone-900 text-white px-6 py-4 border-b-2 border-amber-600 flex justify-between items-center flex-shrink-0 sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold font-serif tracking-wider">运行游戏</h2>
          <span className="text-stone-400 text-sm font-serif italic">Core Rules & Procedures</span>
        </div>
        <Dices className="text-amber-500" size={24} />
      </div>

      <div className="p-6 bg-[#fffdf5] font-serif">
        
        {/* 1. 属性 (Attributes) */}
        <section className="mb-8">
          <div className="flex items-center gap-2 border-b-2 border-stone-800 pb-2 mb-4">
            <User className="text-stone-900" size={24} />
            <h3 className="text-2xl font-bold">属性 (Attributes)</h3>
          </div>
          <p className="mb-4 text-stone-600 italic text-sm">这六项属性用于不同情形：</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AttributeCard title="力量 (Strength)" desc="用于近战攻击和涉及身体机能的豁免，譬如举起大门、掰弯铁杆等等。" />
            <AttributeCard title="敏捷 (Dexterity)" desc="用于涉及姿势、速度、反射的豁免，譬如闪避、攀爬、前行、平衡等等。" />
            <AttributeCard title="体质 (Constitution)" desc="用于抵抗毒素、疾病、寒冷等等。体质奖励会加到治疗投骰中。一名PC的物品栏位数量永远等同体质防御。" />
            <AttributeCard title="智力 (Intelligence)" desc="用于涉及专注、精密的豁免，譬如施展魔法、抵抗魔法效果、回忆逸闻、打造物件、修理机械、扒窃等等。" />
            <AttributeCard title="睿知 (Wisdom)" desc="用于远程攻击和涉及察觉、直觉的豁免，譬如追踪导航、搜索暗门、侦测幻象等等。" />
            <AttributeCard title="魅力 (Charisma)" desc="用于说服、欺瞒、审问、恐吓、魅惑、激怒等等。PC能雇佣魅力奖励数额的随从。" />
          </div>
        </section>

        {/* 2. 检定与豁免 (Checks & Saves) */}
        <section className="mb-8 bg-white p-6 rounded border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 border-b border-stone-300 pb-2 mb-4">
            <Scale className="text-amber-700" size={20} />
            <h3 className="text-xl font-bold">豁免 (Saves)</h3>
          </div>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              若某角色试图做出结果不确定且失败有后果的事情，需要进行一次<span className="font-bold text-stone-900">豁免</span>。
            </p>
            <div className="p-3 bg-stone-100 border border-stone-300 rounded text-center font-bold text-lg font-mono">
              豁免得数 = 1d20 + 相关属性奖励 &gt; 15
            </div>
            <AuthorNote>
              需求豁免超过15意味着新PC有25%成功率，而10级角色有约75%成功率，因为10级能有+10属性奖励。这反映了取自早期D&D豁免机制的通用模式。
            </AuthorNote>
            
            <div className="mt-4">
              <strong className="block text-base mb-1">对抗豁免 (Opposed Saves)</strong>
              <p>若豁免对抗另一角色，则不再以超过15为目标，而是改为：<span className="font-bold">投骰方的得数 &gt; 对方的相关防御值</span>。若投骰方失败，则对方成功。</p>
            </div>

            <div className="mt-4">
               <strong className="block text-base mb-1">优势与劣势</strong>
               <p>若情境因素使豁免明显更易或更难，裁判可授予投骰<span className="font-bold">优势</span>或<span className="font-bold">劣势</span>。若投骰有优势，投2d20并采用较高者。若投骰有劣势，投2d20并采用较低者。</p>
            </div>
          </div>
        </section>

        {/* 3. 物品栏位 (Item Slots) */}
        <section className="mb-8">
          <div className="flex items-center gap-2 border-b border-stone-300 pb-2 mb-4">
            <Backpack className="text-amber-700" size={20} />
            <h3 className="text-xl font-bold">物品栏位 (Item Slots)</h3>
          </div>
          <div className="bg-amber-50/50 p-4 rounded text-sm space-y-2 border border-amber-100">
            <p>PC 拥有数额等同<span className="font-bold">体质防御</span>的物品栏位。</p>
            <ul className="list-disc list-inside space-y-1 text-stone-700">
              <li>多数物品（魔典、药水、单日口粮、轻型武器、工具等）占用 1 栏位。</li>
              <li>格外沉重硕大的物品（护甲、中型至重型武器）会占用更多栏位。</li>
              <li>一组小型同类物品可叠放在同一栏位里。100枚硬币可存进1栏位。</li>
              <li>一般而言，1栏位可承受5磅重量。</li>
            </ul>
          </div>
        </section>

        {/* 4. 战斗 (Combat) */}
        <section className="mb-8">
          <div className="flex items-center gap-2 border-b-2 border-stone-800 pb-2 mb-4">
            <Swords className="text-stone-900" size={24} />
            <h3 className="text-2xl font-bold">战斗 (Combat)</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded border border-stone-200">
                <h4 className="font-bold text-lg mb-2">先攻 (Initiative)</h4>
                <p className="text-sm mb-2">每战斗轮开始时，投骰 1d6 决定先攻。</p>
                <div className="flex gap-2 text-sm text-center font-bold text-white mb-2">
                  <div className="flex-1 bg-stone-800 py-1 rounded">1-3: 敌人行动</div>
                  <div className="flex-1 bg-amber-700 py-1 rounded">4-6: PC 行动</div>
                </div>
                <AuthorNote>使用简易团队先攻来加速战斗，能保持全部玩家参战，并且避免簿记繁琐。由于每轮重投先攻时，一方连续行动两次。这样战斗会更加危险。</AuthorNote>
              </div>

              <div className="bg-white p-4 rounded border border-stone-200">
                <h4 className="font-bold text-lg mb-2">攻击与伤害</h4>
                <p className="text-sm mb-2">近战武器使用<span className="font-bold">力量</span>，远程武器使用<span className="font-bold">睿知</span>。</p>
                <div className="p-2 bg-stone-100 border border-stone-300 rounded text-center text-sm font-mono mb-2">
                  攻击得数 = 1d20 + 属性奖励 &gt; 目标护甲防御(AC)
                </div>
                <p className="text-sm mb-2">命中时，投掷武器伤害骰。若武器合适（如钝器对抗骷髅），可增加相应奖励伤害骰。</p>
                <div className="text-sm border-t border-stone-100 pt-2 mt-2">
                  <span className="font-bold text-red-700">死亡：</span>
                  HP到0时昏迷；HP到-1或以下时死亡。玩家在旧PC死亡时应尽快投骰生成一名新的1级PC重新加入游戏。
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded border border-stone-200">
                 <h4 className="font-bold text-lg mb-2">绝招与优势</h4>
                 <p className="text-sm mb-2"><span className="font-bold">绝招：</span>击晕、推搡、缴械等花招。按照豁免对抗结算。</p>
                 <div className="bg-amber-50 p-3 rounded border border-amber-100">
                   <strong className="block text-sm mb-1 text-amber-900">战斗优势 (Combat Advantage)</strong>
                   <p className="text-xs mb-2">若是角色在战斗中对付某个目标时带有优势（缺乏防备、位于低处、丧失平衡等），则可选择：</p>
                   <ul className="text-xs space-y-1 font-bold text-stone-800">
                     <li>【A】对目标的攻击投骰或绝招获得优势；</li>
                     <li>【B】在同一轮中对该目标进行无优势的一次攻击<span className="text-red-700">和</span>一次特技尝试。</li>
                   </ul>
                 </div>
              </div>

              <div className="bg-white p-4 rounded border border-stone-200">
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><ShieldAlert size={18}/> 暴击与耐久</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-bold text-amber-700">自然 20 (攻击方):</span>
                    <p>防御方的护甲损失 1 点耐久，并且防御方承受额外伤害骰（按武器类型）。若无护甲，则直接承受最大化伤害？(原文未详述无甲情况，依规则通常为额外伤害)。</p>
                  </div>
                  <div>
                    <span className="font-bold text-stone-600">自然 1 (攻击方):</span>
                    <p>攻击方的武器损失 1 点耐久。耐久为0时，该物品损毁。</p>
                  </div>
                  <p className="text-xs text-stone-500 italic">每耐久点的维修费等同物品售价的10%。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 反应、士气与恢复 */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Reactions */}
           <div className="bg-white p-4 rounded border border-stone-200">
             <div className="flex items-center gap-2 mb-3">
               <Users className="text-stone-700" size={20} />
               <h3 className="font-bold text-lg">反应 (Reactions)</h3>
             </div>
             <p className="text-sm mb-2">当NPC反应不明晰时，裁判可投骰 2d6：</p>
             <table className="w-full text-sm text-center border-collapse border border-stone-300">
               <thead>
                 <tr className="bg-stone-100">
                   <th className="border border-stone-300 py-1">2</th>
                   <th className="border border-stone-300 py-1">3-5</th>
                   <th className="border border-stone-300 py-1">6-8</th>
                   <th className="border border-stone-300 py-1">9-11</th>
                   <th className="border border-stone-300 py-1">12</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td className="border border-stone-300 py-1 font-bold text-red-700">敌意</td>
                   <td className="border border-stone-300 py-1">不友善</td>
                   <td className="border border-stone-300 py-1 text-stone-500">不确定</td>
                   <td className="border border-stone-300 py-1">健谈</td>
                   <td className="border border-stone-300 py-1 font-bold text-green-700">乐于帮助</td>
                 </tr>
               </tbody>
             </table>
           </div>

           {/* Morale */}
           <div className="bg-white p-4 rounded border border-stone-200">
             <div className="flex items-center gap-2 mb-3">
               <Skull className="text-stone-700" size={20} />
               <h3 className="font-bold text-lg">士气 (Morale)</h3>
             </div>
             <p className="text-sm text-stone-700 mb-2">
               怪物和NPC都有士气值，通常在5-9。当其面临远超预期的危险时，裁判进行 <span className="font-bold">2d6</span> 士气投骰对比士气值。
             </p>
             <p className="text-sm font-bold mb-2 text-stone-900">若投骰得数高于士气值，则NPC会尝试逃跑、撤退或谈判。</p>
             <p className="text-xs text-stone-500">触发：击败半数敌众、击败首领、独行敌人HP降半等。</p>
           </div>
        </section>

        {/* 6. 治疗与提升 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-4 rounded border border-stone-200">
             <div className="flex items-center gap-2 mb-2">
               <HeartPulse className="text-red-700" size={20} />
               <h3 className="font-bold text-lg">治疗 (Healing)</h3>
             </div>
             <ul className="text-sm space-y-2 list-disc list-inside">
               <li><span className="font-bold">饱餐一顿和整夜休息：</span> 恢复 1d8 + 体质奖励 HP。</li>
               <li><span className="font-bold">安全避风港休息：</span> 恢复全部 HP。</li>
             </ul>
           </div>

           <div className="bg-white p-4 rounded border border-stone-200">
             <div className="flex items-center gap-2 mb-2">
               <ArrowUpCircle className="text-green-700" size={20} />
               <h3 className="font-bold text-lg">提升 (Levelling)</h3>
             </div>
             <div className="text-sm space-y-2">
               <p>当 PC 积累了 <span className="font-bold">1000 XP</span> 就能提升一级。</p>
               <div className="bg-stone-50 p-2 rounded text-xs">
                 <p className="font-bold mb-1">升级效果：</p>
                 <ol className="list-decimal list-inside space-y-1">
                   <li><span className="font-bold">HP：</span>投掷 新等级数×d8。若得数 &lt; 旧HP上限，则旧HP上限+1。否则使用新得数。</li>
                   <li><span className="font-bold">属性：</span>选择3项不同的属性，让其防御和奖励各自+1 (上限20/+10)。</li>
                 </ol>
               </div>
             </div>
           </div>
        </section>

      </div>
    </div>
  );
};

// Helper Components
const AttributeCard: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="border-l-4 border-stone-300 pl-3">
    <strong className="block text-stone-900 text-lg mb-1">{title}</strong>
    <p className="text-stone-700 text-sm leading-relaxed">{desc}</p>
  </div>
);

const AuthorNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-3 text-xs text-stone-500 italic border-t border-stone-100 pt-2 font-serif">
    <span className="font-bold not-italic text-stone-400 mr-1">[作者评注]</span>
    {children}
  </div>
);

export default GameRulesBlock;