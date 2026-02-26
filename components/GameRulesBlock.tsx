import React from 'react';
import { ShieldAlert, Swords, HeartPulse, Scale, Dices, User, Users, ArrowUpCircle, Backpack, Skull, Sparkles, Book, Star, Package, Wand2, FlaskConical, Leaf, Map, Compass } from 'lucide-react';

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
        <section className="mb-8">
          <div className="flex items-center gap-2 border-b-2 border-stone-800 pb-2 mb-4">
            <Scale className="text-stone-900" size={24} />
            <h3 className="text-2xl font-bold">检定 (Checks)</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* 基础检定 */}
            <div className="bg-white border border-stone-200 rounded p-4 col-span-1 lg:col-span-2">
              <p className="text-sm leading-relaxed text-stone-700 mb-3">
                当一个生物尝试<span className="font-bold">有风险的行动</span>时，他们通过掷一个 d20 并加上其某项能力值来进行检定。如果其总值达到或超过游戏主持人设定的<span className="font-bold">目标数字</span>，则成功。如果一个生物没有能力值，游戏主持人可以根据其在该任务上的表现，使用其<span className="font-bold">等级、等级的一半或零</span>作为替代。游戏主持人不应为那些可以通过批判性思维解决的情境要求进行检定。除非玩家角色拥有合适的工具或职业，否则某些行动可能无法完成。
              </p>
              <div className="p-2 bg-stone-100 border border-stone-300 rounded text-center text-xs font-mono font-bold">
                1d20 + 能力值 + 修正 ≥ 目标数字（11 + 难度，默认难度为 5）
              </div>
            </div>

            {/* 设定目标数字 */}
            <div className="bg-stone-50 border border-stone-200 rounded p-4">
              <h4 className="font-bold text-base mb-2">设定目标数字</h4>
              <p className="text-sm leading-relaxed text-stone-700">
                以 <span className="font-bold">11</span> 为基础，然后加上一个从 <span className="font-bold">0 到 10</span> 的难度等级（默认为 <span className="font-bold">5</span>）。如果检定是针对另一个生物，则难度等级等于其相关能力值或等级。在攻击中，难度是防御者的护甲点数（<span className="font-bold font-mono">11 + AP</span> 的目标数字被称为护甲等级）。
              </p>
            </div>

            {/* 反向检定 */}
            <div className="bg-stone-50 border border-stone-200 rounded p-4">
              <h4 className="font-bold text-base mb-2">反向检定 (Inverse Checks)</h4>
              <p className="text-sm leading-relaxed text-stone-700">
                通过反转游戏主持人通常进行的检定，可以让玩家进行所有掷骰。例如：一个哥布林试图攻击玩家角色时，可以将其等级加到 d20 上，尝试达到玩家角色的护甲等级（<span className="font-mono font-bold">11 + 玩家角色的护甲点数</span>）。反向掷骰时，玩家角色可以将其护甲点数加到 d20 上，目标是达到 <span className="font-mono font-bold">11 + 哥布林等级</span> 的目标数字。
              </p>
            </div>

            {/* 修正值 */}
            <div className="bg-amber-50 border border-amber-200 rounded p-4">
              <h4 className="font-bold text-base mb-2 text-amber-900">修正值 (Modifiers)</h4>
              <p className="text-sm leading-relaxed text-stone-700">
                游戏主持人可以对掷骰玩家在检定中拥有的每个<span className="font-bold text-red-700">劣势施加 -5 罚值</span>，对每个<span className="font-bold text-amber-700">优势施加 +5 加值</span>。（例如，相关的职业、巧妙的方法、额外的时间、正确的工具等）。
              </p>
            </div>

            {/* 社交检定 */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h4 className="font-bold text-base mb-2 text-blue-900">社交检定 (Social Checks)</h4>
              <p className="text-sm leading-relaxed text-stone-700">
                在大多数情况下，社交互动的结果可以通过常识和角色扮演来解决，但在有风险的情况下，游戏主持人可能会要求进行检定。这些检定使用玩家角色的<span className="font-bold">魅力值</span>对抗非玩家角色的<span className="font-bold">感知值或魅力值</span>，具体取决于情境。可以根据目标的性格、与玩家角色的关系、阵营或道德立场、玩家角色的措辞、贿赂、威胁等因素施加修正值。
              </p>
            </div>

            {/* 知识 & 搜索检定 */}
            <div className="bg-white border border-stone-200 rounded p-4 space-y-3 col-span-1 lg:col-span-2">
              <div>
                <h4 className="font-bold text-base mb-1">知识检定 (Knowledge)</h4>
                <p className="text-sm leading-relaxed text-stone-700">
                  玩家角色回忆知识时<span className="font-bold">无需进行检定</span>。玩家角色自动知晓所有<span className="font-bold">常识</span>以及其<span className="font-bold">职业所涵盖的任何专业知识</span>。任何其他知识都必须在游戏中发现。
                </p>
              </div>
              <div className="border-t border-stone-100 pt-3">
                <h4 className="font-bold text-base mb-1">搜索检定 (Search)</h4>
                <p className="text-sm leading-relaxed text-stone-700">
                  隐藏的事物要么在花费足够时间搜索后<span className="font-bold">自动发现</span>（通常地下城房间为<span className="font-bold">十分钟</span>，荒野六角格为<span className="font-bold">一整个值夜班次</span>），要么必须通过游戏内行动才能找到。区域的<span className="font-bold">明显特征</span>应立即向玩家角色描述，<span className="font-bold">细节</span>则应在玩家提问和调查时进行描述。
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 占位：以下原内容继续 */}

        {/* 3. 栏位、伤害与死亡 */}
        <section className="mb-8">
          <div className="flex items-center gap-2 border-b-2 border-stone-800 pb-2 mb-4">
            <Backpack className="text-stone-900" size={24} />
            <h3 className="text-2xl font-bold">栏位、伤害与死亡</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* 栏位 */}
            <div className="bg-amber-50 border border-amber-200 rounded p-4">
              <h4 className="font-bold text-base mb-2 text-amber-900">栏位 (Item Slots)</h4>
              <p className="text-sm leading-relaxed text-stone-700 mb-2">
                玩家角色拥有 <span className="font-bold">10 + 体质值</span> 的物品栏位来记录他们的装备。
              </p>
              <ul className="text-sm space-y-1.5 text-stone-700">
                <li>大多数物品，包括那些能单手握持的小件物品组合，占据 <span className="font-bold">1 个栏位</span>。</li>
                <li>双手物品占据 <span className="font-bold">2 个栏位</span>。</li>
                <li><span className="font-bold">500 枚钱币</span>占据一个完整栏位。</li>
              </ul>
            </div>

            {/* 伤害 */}
            <div className="bg-white border border-stone-200 rounded p-4">
              <h4 className="font-bold text-base mb-2">伤害 (Damage)</h4>
              <p className="text-sm leading-relaxed text-stone-700">
                玩家角色受到的伤害会从其<span className="font-bold">生命值（HP）</span>中扣除。一旦其生命值降至 0，每点伤害会从<span className="font-bold">最高编号的栏位</span>开始，到最低编号的栏位，用一个相应的<span className="font-bold text-red-700">创伤</span>（如刺伤、冻伤、烧伤等）填充一个物品栏位。受创伤栏位中的物品必须被丢弃。
              </p>
            </div>

            {/* 直接伤害 */}
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h4 className="font-bold text-base mb-2 text-red-900">直接伤害 (Direct Damage)</h4>
              <p className="text-sm leading-relaxed text-stone-700">
                直接伤害会<span className="font-bold">绕过生命值（HP）</span>并直接增加创伤。这种情况发生在生物的战斗技能无法保护它们时（例如，坠落或被偷袭时）。怪物从直接伤害中受到<span className="font-bold text-red-700">三倍伤害</span>，因为它们没有物品栏位。
              </p>
            </div>

            {/* 死亡 */}
            <div className="bg-stone-800 border border-stone-700 rounded p-4">
              <h4 className="font-bold text-base mb-2 text-white flex items-center gap-2">
                <Skull size={15} className="text-red-400" /> 死亡 (Death)
              </h4>
              <p className="text-sm leading-relaxed text-stone-200">
                当玩家角色的<span className="font-bold">所有物品栏位都被创伤填满</span>时，他们便会死亡。没有物品栏位的生物，如怪物，则在<span className="font-bold text-red-400">生命值降至 0</span> 时直接死亡。
              </p>
            </div>

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

        {/* 6. 治疗与升级 */}
        <section className="mb-8">
          <div className="flex items-center gap-2 border-b-2 border-stone-800 pb-2 mb-4">
            <HeartPulse className="text-stone-900" size={24} />
            <h3 className="text-2xl font-bold">治疗与升级</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* 治疗 */}
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h4 className="font-bold text-base mb-2 text-green-900 flex items-center gap-2">
                <HeartPulse size={15} /> 治疗 (Healing)
              </h4>
              <p className="text-sm leading-relaxed text-stone-700">
                只要玩家角色在前一晚睡足<span className="font-bold">两个值夜班次</span>并<span className="font-bold">进食一餐</span>，其生命值（HP）就会在每个早晨<span className="font-bold text-green-700">恢复到最大值</span>。如果他们在<span className="font-bold">安全庿护所</span>，还会治愈<span className="font-bold">一处创伤</span>。
              </p>
            </div>

            {/* 经验值 */}
            <div className="bg-amber-50 border border-amber-200 rounded p-4">
              <h4 className="font-bold text-base mb-2 text-amber-900 flex items-center gap-2">
                <ArrowUpCircle size={15} /> 经验值 (XP)
              </h4>
              <p className="text-sm leading-relaxed text-stone-700">
                从偏远、危险地点回收并带回文明世界的每 <span className="font-bold">1 錢币（c）</span>价值的宝藏，会为玩家角色奖励 <span className="font-bold text-amber-700">1 点经验值（XP）</span>，并在所有提供协助的玩家角色之间<span className="font-bold">平均分配</span>。
              </p>
              <p className="text-xs text-stone-500 mt-2 italic">如果使用其他系统的预设地下城（铜/銀/琥珀金/金/擂金币），将总价值换算成金币，并获得等量的 XP。</p>
            </div>

            {/* 升级 */}
            <div className="bg-white border border-stone-200 rounded p-4 col-span-1 lg:col-span-2">
              <h4 className="font-bold text-base mb-3">升级 (Level Up)</h4>
              <p className="text-sm leading-relaxed text-stone-700 mb-3">
                达到特定的经验值（XP）阈値时，玩家角色会提升等级，这会使其<span className="font-bold">三项不同的能力值各增加 1 点</span>。经验值（XP）<span className="font-bold">不会重置为零</span>。这三项能力值可以由玩家选择，也可以随机选择。
              </p>
              <div className="bg-stone-50 border border-stone-100 rounded p-3 text-sm">
                <span className="font-bold block mb-1">HP 重掷：</span>
                每次升级还允许玩家使用一个<span className="font-bold">额外的 d6</span> 来重掷其玩家角色的最高生命值（HP）。如果掷出的总值<span className="font-bold">不大于</span>其之前的最大值，则在其之前的最大值上<span className="font-bold text-amber-700">加 1</span>。
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

        {/* 9. 旅行 (Travel) */}
        <section className="mb-8">
          <div className="flex items-center gap-2 border-b-2 border-stone-800 pb-2 mb-4">
            <Map className="text-stone-900" size={24} />
            <h3 className="text-2xl font-bold">旅行 (Travel)</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* 值夜班次 */}
            <div className="bg-stone-50 border border-stone-200 rounded p-4 col-span-1 lg:col-span-2">
              <h4 className="font-bold text-base mb-2">值夜班次 (Watches)</h4>
              <p className="text-sm leading-relaxed text-stone-700">
                旅行时，一天分为六个四小时的值夜班次：<span className="font-bold">三个白天的，三个夜晚的</span>。大多数主要行动（旅行、觅食、搜索等）需要一个值夜班次才能完成。
              </p>
            </div>

            {/* 旅行速度 */}
            <div className="bg-white border border-stone-200 rounded p-4">
              <h4 className="font-bold text-base mb-2 flex items-center gap-2">
                <Compass size={15} className="text-stone-600" /> 旅行速度 (Speed)
              </h4>
              <p className="text-sm leading-relaxed text-stone-700 mb-2">
                玩家角色每个值夜班次可以移动<span className="font-bold">一个六英里六角格</span>，每天最多三次。每日第三个值夜班次之后，每继续旅行一个值夜班次，除非成功通过一次<span className="font-bold">体质检定</span>，否则每个玩家角色都会受到、<span className="font-bold text-red-700">1 点直接伤害</span>。
              </p>
              <div className="text-xs text-stone-500 space-y-1">
                <div>黑暗、困难地形或恶劣天气中速度<span className="font-bold">减半</span>；骑乘时速度<span className="font-bold">加倍</span>。</div>
              </div>
            </div>

            {/* 导航 */}
            <div className="bg-white border border-stone-200 rounded p-4">
              <h4 className="font-bold text-base mb-2">导航 (Navigation)</h4>
              <p className="text-sm leading-relaxed text-stone-700">
                如果在旅行时地形或天气令人迷向，游戏主持人可能会要求队伍领袖进行一次<span className="font-bold">感知检定</span>（由游戏主持人秘密掷骰），以确定他们是否会移动到<span className="font-bold">随机的相邻六角格</span>中。
              </p>
            </div>

            {/* 探索 */}
            <div className="bg-amber-50 border border-amber-200 rounded p-4">
              <h4 className="font-bold text-base mb-2 text-amber-900">探索 (Exploration)</h4>
              <p className="text-sm leading-relaxed text-stone-700 mb-2">
                队伍可以花费一个值夜班次探索一个<span className="font-bold">六英里六角格</span>的区域，以揭示任何途经时不会注意到的感兴趣区域（例如，杂草丛生的废墙、隐蔽的水池等）。
              </p>
              <div className="text-xs text-stone-600 border-t border-amber-100 pt-2">
                <span className="font-bold text-amber-800">秘密特征：</span>秘密特征（例如埋藏的宝藏或通往山中的暗门）应该有相应的线索，通过探索该六角格来揭示。它们只能通过玩家角色与游戏世界互动来找到。
              </div>
            </div>

            {/* 觅食 */}
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h4 className="font-bold text-base mb-2 text-green-900">觅食 (Foraging)</h4>
              <p className="text-sm leading-relaxed text-stone-700">
                寻找食物需要一个值夜班次，并需通过一次<span className="font-bold">感知检定</span>，检定会因天气、地形等因素而有修正値。成功时，一个玩家角色会收集到 <span className="font-bold text-green-700">d6 份口粮</span>。
              </p>
            </div>

            {/* 旅行危险骰 */}
            <div className="bg-white border border-stone-200 rounded p-4">
              <h4 className="font-bold text-base mb-2">旅行危险骰 (Hazard Die)</h4>
              <p className="text-sm leading-relaxed text-stone-700">
                在每个<span className="font-bold">值夜班次结束时</span>，掷旅行危险骰并应用其结果。
              </p>
              <p className="text-xs text-stone-500 mt-2 italic">可参阅主持人工具中的「旅行危险」随机表。</p>
            </div>

          </div>
        </section>

      </div>
    </div >
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