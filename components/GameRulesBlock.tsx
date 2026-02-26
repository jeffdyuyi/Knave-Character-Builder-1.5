import React from 'react';
import { ShieldAlert, Swords, HeartPulse, Scale, Dices, User, Users, ArrowUpCircle, Backpack, Skull, Sparkles, Book, Star, Package, Wand2, FlaskConical, Leaf } from 'lucide-react';

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
            <AttributeCard title="力量 (Strength)" desc="用于近战攻击和涉及身体机能的检定，譬如举起大门、掰弯铁杆等等。" />
            <AttributeCard title="灵巧 (Dexterity)" desc="用于涉及姿势、速度、反射的检定，譬如闪避、攀爬、潜行、平衡、扒窃、戏法等等。" />
            <AttributeCard title="体质 (Constitution)" desc="对每个玩家角色都很重要。用于抵抗毒素、疾病、寒冷等等的检定。玩家角色拥有 10 + 体质的物品槽，并且可以承受 10 + 体质的伤口而不死。" />
            <AttributeCard title="智力 (Intelligence)" desc="用于涉及专注、精密的检定，譬如开锁、炼金术、施展魔法、抵抗魔法效果、回忆逸闻、打造物件、修理机械等等。智力提高法术的效果，玩家角色每天可以施展等同于智力值的法术数量。" />
            <AttributeCard title="感知 (Wisdom)" desc="用于远程攻击和涉及察觉、直觉的检定，譬如觅食、追踪导航、搜索暗门、侦测幻象和抵抗法术。" />
            <AttributeCard title="魅力 (Charisma)" desc="用于需要个性影响力的检定，譬如说服、欺瞒、审问、恐吓、魅惑、激怒等等。玩家角色可以拥有等同于其魅力值的随从和庇护祝福。" />
          </div>
        </section>

        {/* 2. 检定 (Checks) */}
        <section className="mb-8 bg-white p-6 rounded border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 border-b border-stone-300 pb-2 mb-4">
            <Scale className="text-amber-700" size={20} />
            <h3 className="text-xl font-bold">检定 (Checks)</h3>
          </div>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              若某角色试图做出结果不确定且失败有后果的事情，需要进行一次<span className="font-bold text-stone-900">检定</span>。
            </p>
            <div className="p-3 bg-stone-100 border border-stone-300 rounded text-center font-bold text-lg font-mono">
              检定得数 = 1d20 + 能力值 + 修正 &ge; 11 + 任务难度(通常为5)
            </div>

            <div className="mt-4">
              <strong className="block text-base mb-1">对抗检定 (Opposed Checks)</strong>
              <p>对抗的能力值和护甲点数可以作为任务难度。如果生物没有能力值，则替代为其等级、一半等级或0（由裁判决定）。</p>
            </div>

            <div className="mt-4">
              <strong className="block text-base mb-1">优势与劣势</strong>
              <p>来自优势、劣势或职业的修正在投骰中体现为<span className="font-bold text-amber-700">&plusmn;5 增量</span>，不再是投2d20取高低。</p>
            </div>

            <div className="mt-4 p-3 bg-blue-50/50 border border-blue-200 rounded">
              <strong className="block text-base mb-1 text-blue-900">角色知识 (Character Knowledge)</strong>
              <p className="text-blue-800">不要进行所谓的“知识检定”。玩家角色知道所有常识和与职业相关的知识。所有其他知识必须被寻找。</p>
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
            <p>PC 拥有<span className="font-bold"> 10 + 体质 </span>数值的物品栏位。</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* ── 突袭 ── */}
            <div className="bg-amber-50 p-4 rounded border border-amber-200 col-span-1 lg:col-span-2">
              <h4 className="font-bold text-lg mb-2 text-amber-900">突袭 (Surprise)</h4>
              <p className="text-sm leading-relaxed">
                如果遭遇发生在距离队伍 <span className="font-bold">80 英尺</span>以内，距离最近的玩家角色与遭遇中距离最近的生物进行一次<span className="font-bold">感知检定</span>。
                如果一方以 <span className="font-bold">5 点或更多优势</span>胜出，则他们突袭了另一方。
                突袭方将在战斗中<span className="font-bold text-amber-800">首先行动</span>，并在第一轮的所有战斗检定中获得 <span className="font-bold text-amber-800">+5 加值</span>。
              </p>
            </div>

            {/* ── 先攻 ── */}
            <div className="bg-white p-4 rounded border border-stone-200">
              <h4 className="font-bold text-lg mb-2">先攻 (Initiative)</h4>
              <p className="text-sm mb-3 leading-relaxed">
                战斗以 <span className="font-bold">10 秒</span>为一个回合进行，在此期间每一方都有机会行动。
                当一方行动时，其所有生物可以按任意顺序<span className="font-bold">移动（玩家角色为 40 英尺）</span>并执行一项其他动作，例如攻击、施法、再次移动、进行战术动作等。
              </p>
              <div className="flex gap-2 text-sm text-center font-bold text-white">
                <div className="flex-1 bg-stone-800 py-1 rounded">1-3: 敌人行动</div>
                <div className="flex-1 bg-amber-700 py-1 rounded">4-6: PC 行动</div>
              </div>
              <AuthorNote>使用简易团队先攻来加速战斗，能保持全部玩家参战，并且避免簿记繁琐。由于每轮重投先攻时，一方连续行动两次。这样战斗会更加危险。</AuthorNote>
            </div>

            {/* ── 攻击 ── */}
            <div className="bg-white p-4 rounded border border-stone-200">
              <h4 className="font-bold text-lg mb-2">攻击 (Attack)</h4>
              <p className="text-sm mb-2 leading-relaxed">
                攻击是使用攻击者的<span className="font-bold">力量</span>（近战攻击）或<span className="font-bold">感知</span>（远程攻击）进行的检定，试图达到防御者的<span className="font-bold">护甲等级（护甲点数 + 11）</span>。命中时，攻击者对目标造成伤害。
              </p>
              <div className="p-2 bg-stone-100 border border-stone-300 rounded text-center text-xs font-mono mb-2">
                攻击 = 1d20 + 能力值 + 修正 ≥ 目标护甲点数 + 11
              </div>
              <ul className="text-sm space-y-1.5 mt-2">
                <li><span className="font-bold text-amber-700">总值 ≥ 21：</span>攻击者可同时成功执行一次自选的<span className="font-bold">自由战术动作</span>。</li>
                <li><span className="font-bold text-red-700">自然 1：</span>武器损坏，损失 1 点耐久。</li>
              </ul>
            </div>

            {/* ── 战术动作 ── */}
            <div className="bg-white p-4 rounded border border-stone-200">
              <h4 className="font-bold text-lg mb-2">战术动作 (Tactical Maneuvers)</h4>
              <p className="text-sm mb-2 leading-relaxed">
                包括<span className="font-bold">缴械、推撞、震慑、致盲、破坏装备、绊倒、扒窃、攀爬、束缚</span>，或GM同意的任何其他合理行动。
                它们只能<span className="font-bold">间接</span>造成伤害（例如，将敌人推下悬崖），并通过适当的能力检定来解决。
              </p>
              <p className="text-xs text-stone-500 italic">战术动作对于击倒强敌至关重要。</p>
            </div>

            {/* ── 远程攻击 & 偷袭 ── */}
            <div className="bg-white p-4 rounded border border-stone-200 space-y-3">
              <div>
                <h4 className="font-bold text-base mb-1">远程攻击 (Ranged Attack)</h4>
                <p className="text-sm leading-relaxed">
                  在<span className="font-bold">近战时无法</span>进行远程攻击。如果目标处于近战状态，则攻击受到 <span className="font-bold text-red-700">-5 罚值</span>。
                </p>
              </div>
              <div className="border-t border-stone-100 pt-3">
                <h4 className="font-bold text-base mb-1">偷袭 (Sneak Attack)</h4>
                <p className="text-sm leading-relaxed">
                  针对毫无防备的敌人的近战攻击<span className="font-bold">总是命中</span>并造成直接伤害。针对真正无防备的敌人发动的攻击会<span className="font-bold text-red-700">自动杀死</span>他们。
                </p>
              </div>
            </div>

            {/* ── 强力攻击 & 伤害 ── */}
            <div className="bg-white p-4 rounded border border-stone-200 space-y-3">
              <div>
                <h4 className="font-bold text-base mb-1">强力攻击 (Power Attack)</h4>
                <p className="text-sm leading-relaxed">
                  在成功的攻击掷骰之后但在掷伤害骰之前，玩家角色可以决定进行一次强力近战攻击，这将使掷出的<span className="font-bold">伤害骰数量翻倍</span>，但会导致<span className="font-bold text-red-700">武器损坏</span>。
                </p>
              </div>
              <div className="border-t border-stone-100 pt-3">
                <h4 className="font-bold text-base mb-1">伤害 (Damage)</h4>
                <p className="text-sm leading-relaxed">
                  命中造成的伤害等同于<span className="font-bold">武器伤害骰</span>的掷骰结果。如果敌人对所受伤害类型存在<span className="font-bold text-red-700">弱点</span>，则该伤害为直接伤害。如果敌人对该伤害类型<span className="font-bold text-stone-500">免疫</span>，则不造成伤害。
                </p>
              </div>
            </div>

            {/* ── 修正值 ── */}
            <div className="bg-stone-50 p-4 rounded border border-stone-200 col-span-1 lg:col-span-2">
              <h4 className="font-bold text-base mb-2">修正值 (Modifiers)</h4>
              <p className="text-sm leading-relaxed">
                攻击和战术动作检定可能会因<span className="font-bold">布阵、围攻、武器类型、瞄准、可见度、掩护、敌人体型、距离、突袭、高地优势</span>等因素而获得
                <span className="font-bold text-amber-700"> +5 </span>或<span className="font-bold text-red-700"> -5 </span>的修正值。
                <span className="text-stone-500 ml-1">职业不为战斗检定提供修正值。</span>
              </p>
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
            <p className="text-sm text-stone-700 mb-2 leading-relaxed">
              当非玩家角色在战斗中达到崩溃点时，他们必须通过在 <span className="font-bold">2d6</span> 上掷出等于或低于其<span className="font-bold">士气等级</span>的结果来测试其士气。若投骰结果超过其士气等级，他们会<span className="font-bold text-red-700">溃逃或投降</span>。
            </p>
            <p className="text-sm text-stone-700 mb-2 leading-relaxed">
              如果其领导者通过一次<span className="font-bold">魅力检定</span>，他们可以在每场战斗中重掷一次失败的检定。
            </p>
            <div className="text-xs text-stone-500 border-t border-stone-100 pt-2 mt-2">
              <span className="font-bold not-italic text-stone-600">崩溃点触发：</span>
              独行时失去一半HP、首次伤亡、损失一半兵力、领导者被杀、受到所恐惧之物攻击。
            </div>
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
                  <li><span className="font-bold">HP：</span>投掷 新等级数×d6。若得数 &le; 旧HP上限，则旧HP上限+1。否则使用新得数。</li>
                  <li><span className="font-bold">属性：</span>选择3项不同的属性，让其数值各加 1，或随机掷决定分配 (上限10)。</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* 7. 战争 (Warfare) */}
        <section className="mb-8">
          <div className="flex items-center gap-2 border-b-2 border-stone-800 pb-2 mb-4">
            <Swords className="text-stone-900" size={24} />
            <h3 className="text-2xl font-bold">战争 (Warfare)</h3>
          </div>
          <p className="text-sm text-stone-600 mb-5 leading-relaxed">
            如果你想计算一场战斗的结果，但使用正常的战斗规则会花费太长时间，请使用以下程序。
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* ── 部队单位参考 ── */}
            <div className="bg-stone-50 border border-stone-200 rounded p-4">
              <h4 className="font-bold text-base mb-3 flex items-center gap-2">
                <Users size={16} className="text-stone-600" /> 部队单位参考
              </h4>
              <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                以下每种部队单位每月花费 <span className="font-bold text-stone-700">100,000c</span>，并具有同等的战斗力。在确定战斗中各单位的成本和实力时，以此为指导。
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="col-span-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-200 pb-1 mb-1">法师</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />1 名大师级战斗法师</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />4 名战斗法师</div>
                <div className="col-span-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-200 pb-1 mb-1 mt-2">骑兵</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />25 名精英骑兵</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />50 名资深骑兵</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />100 名受训骑兵</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />200 名未受训骑兵</div>
                <div className="col-span-2 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-200 pb-1 mb-1 mt-2">步兵 / 弓箭手</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-stone-600 shrink-0" />50 名精英步兵或弓箭手</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-stone-500 shrink-0" />100 名资深步兵或弓箭手</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0" />200 名受训步兵或弓箭手</div>
                <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />400 名未受训步兵或弓箭手</div>
              </div>
            </div>

            {/* ── 战斗步骤 ── */}
            <div className="flex flex-col gap-3">

              {/* 步骤 1 */}
              <div className="bg-white border border-stone-200 rounded p-3">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-800 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <div>
                    <h5 className="font-bold text-sm mb-1">计算战斗力</h5>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      汇总双方部队单位的战斗力。GM 可酌情根据一方的<span className="font-bold">士气和布阵</span>情况，将其战斗力提高或降低最多 <span className="font-bold">50%</span>。双方领导者也可以进行一次<span className="font-bold">魅力检定</span>，尝试通过鼓舞人心的演讲将己方战斗力提高 50%。重要的是双方的<span className="font-bold">相对实力</span>，而非确切数字。
                    </p>
                  </div>
                </div>
              </div>

              {/* 步骤 2 */}
              <div className="bg-white border border-stone-200 rounded p-3">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-800 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <div className="w-full">
                    <h5 className="font-bold text-sm mb-2">确定优势</h5>
                    <p className="text-xs text-stone-500 mb-2">较强一方比较弱一方强大程度 → 检定加值：</p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {[
                        ['强大最多 50%', '+2'],
                        ['强大最多 2 倍', '+4'],
                        ['强大最多 3 倍', '+6'],
                        ['强大最多 4 倍', '+8'],
                        ['强大超过 4 倍', '+10'],
                      ].map(([cond, bonus]) => (
                        <div key={cond} className="flex justify-between items-center bg-stone-50 px-2 py-1 rounded border border-stone-100">
                          <span className="text-stone-600">{cond}</span>
                          <span className="font-black text-amber-700">{bonus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 步骤 3 */}
              <div className="bg-white border border-stone-200 rounded p-3">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-800 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <div>
                    <h5 className="font-bold text-sm mb-1">战斗检定</h5>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      较强一方使用上述加值进行 <span className="font-bold">三次检定</span>，目标是达到 <span className="font-bold">11 或更高</span>。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 步骤 4：选择结果（全宽） ── */}
            <div className="bg-white border border-stone-200 rounded p-4 col-span-1 lg:col-span-2">
              <div className="flex items-start gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-stone-800 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">4</span>
                <div>
                  <h5 className="font-bold text-sm mb-1">选择结果</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    每次<span className="font-bold text-amber-700">成功</span>允许较强一方秘密选择下列一个结果；每次<span className="font-bold text-red-700">失败</span>则允许较弱一方秘密选择一个结果。同一结果可多次选取。所有选择完成后，同时揭示并结算。
                    <span className="block mt-1 text-stone-500">选择结果最多的一方（无论结算如何）即为<span className="font-bold text-stone-700">胜利者</span>。败方必须从战场撤退。</span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {[
                  { name: '俘虏', desc: '一名敌方NPC被俘虏。', color: 'bg-blue-50 border-blue-200 text-blue-900', tag: '攻击' },
                  { name: '掠夺', desc: '一件敌方物品被掠夺。', color: 'bg-amber-50 border-amber-200 text-amber-900', tag: '攻击' },
                  { name: '歼灭', desc: '歼灭敌方 10% 的兵力。', color: 'bg-red-50 border-red-200 text-red-900', tag: '攻击' },
                  { name: '营救', desc: '取消一个"俘虏"结果。', color: 'bg-blue-50 border-blue-100 text-blue-700', tag: '防御' },
                  { name: '守护', desc: '取消一个"掠夺"结果。', color: 'bg-amber-50 border-amber-100 text-amber-700', tag: '防御' },
                  { name: '掩护', desc: '取消一个"歼灭"结果。', color: 'bg-red-50 border-red-100 text-red-700', tag: '防御' },
                ].map(r => (
                  <div key={r.name} className={`border rounded p-2.5 ${r.color}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-sm">{r.name}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${r.tag === '攻击' ? 'bg-stone-700 text-white' : 'bg-white/70 text-stone-500 border border-stone-200'}`}>{r.tag}</span>
                    </div>
                    <p className="text-xs leading-snug">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 8. 炼金术 (Alchemy) */}
        <section className="mb-8">
          <div className="flex items-center gap-2 border-b-2 border-stone-800 pb-2 mb-4">
            <FlaskConical className="text-stone-900" size={24} />
            <h3 className="text-2xl font-bold">炼金术 (Alchemy)</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* 药水效果 */}
            <div className="bg-purple-50 border border-purple-200 rounded p-4">
              <h4 className="font-bold text-base mb-2 text-purple-900 flex items-center gap-2">
                <FlaskConical size={15} /> 药水效果 (Potions)
              </h4>
              <p className="text-sm leading-relaxed text-stone-700 mb-3">
                药水能让饮用者产生<span className="font-bold">单一显著的魔法效果</span>。
              </p>
              <div className="space-y-2 text-xs text-stone-600">
                <div className="bg-white border border-purple-100 rounded p-2">
                  <span className="font-bold text-purple-800 block mb-0.5">持续性效果（如隐形）</span>
                  持续 <span className="font-bold">1 回合（10 分钟）</span>。
                </div>
                <div className="bg-white border border-purple-100 rounded p-2">
                  <span className="font-bold text-purple-800 block mb-0.5">较弱的持续性效果（如兽语）</span>
                  效果非常微弱时，可能持续<span className="font-bold">一小时甚至一天</span>。
                </div>
                <div className="bg-white border border-purple-100 rounded p-2">
                  <span className="font-bold text-purple-800 block mb-0.5">鉴定</span>
                  <span className="font-bold">一滴药水</span>能提供其效果的线索。
                </div>
              </div>
            </div>

            {/* 酿造 */}
            <div className="bg-white border border-stone-200 rounded p-4">
              <h4 className="font-bold text-base mb-2 flex items-center gap-2">
                <FlaskConical size={15} className="text-amber-600" /> 酿造 (Brewing)
              </h4>
              <div className="text-xs text-stone-500 mb-3 border border-stone-100 rounded p-2 bg-stone-50">
                <span className="font-bold text-stone-700">所需条件：</span>
                火 · 大锅 · 原料 · <span className="font-bold">4 小时（一个值夜班次）</span>
              </div>
              <ol className="text-sm space-y-2.5 text-stone-700 list-decimal list-inside">
                <li>玩家描述<span className="font-bold">药水效果、持续时间与将使用的原料</span>。</li>
                <li>GM 批准后，进行一次<span className="font-bold">智力检定</span>。</li>
                <li>额外花费一个值夜班次酿造，检定获得 <span className="font-bold text-amber-700">+5 加值</span>。</li>
                <li>成功则药水被创造；<span className="font-bold text-stone-500">无论结果如何，原料均被消耗</span>。</li>
              </ol>
              <div className="mt-3 bg-amber-50 border border-amber-100 rounded p-2 text-xs text-stone-600">
                <span className="font-bold text-amber-800">获得配方：</span>
                若检定结果<span className="font-bold">超出目标值 10 点或更多</span>，则获得该药水的配方，之后使用相同原料无需再次检定。
              </div>
            </div>

            {/* 采集 */}
            <div className="bg-white border border-stone-200 rounded p-4">
              <h4 className="font-bold text-base mb-2 flex items-center gap-2">
                <Leaf size={15} className="text-green-700" /> 采集原料 (Harvesting)
              </h4>
              <p className="text-sm leading-relaxed text-stone-700 mb-3">
                魔法植物可用于制作药水，但通常生长在<span className="font-bold">危险或失落的地点</span>。
              </p>
              <div className="space-y-2 text-xs text-stone-600">
                <div className="bg-green-50 border border-green-100 rounded p-2">
                  <span className="font-bold text-green-800 block mb-0.5">怪物部件（最常见）</span>
                  赋予怪物特殊能力的器官，例如<span className="font-bold">龙的肺（喷火）、龙的鳞片（防火）</span>等。
                </div>
                <div className="bg-stone-50 border border-stone-100 rounded p-2">
                  <span className="font-bold text-stone-700 block mb-0.5">采集耗时</span>
                  需要 <span className="font-bold">1 回合（10 分钟）</span>和合适的工具。
                </div>
                <div className="bg-stone-50 border border-stone-100 rounded p-2">
                  <span className="font-bold text-stone-700 block mb-0.5">栏位占用</span>
                  因需包装与保存液体，采集到的部件或植物<span className="font-bold">至少占据 1 个栏位</span>。
                </div>
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