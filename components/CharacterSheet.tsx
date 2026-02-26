import React, { useRef, useCallback, useMemo } from 'react';
import { Character, StatName, Stat } from '../types';
import { toPng } from 'html-to-image';
import { Download, ArrowLeft, Loader2, FileText } from 'lucide-react';

interface CharacterSheetProps {
  character: Character;
  onEdit: () => void;
}

// ── 属性说明文字 ──────────────────────────────────────────────────────────────
const STAT_DESCRIPTIONS: Record<StatName, { cn: string; en: string; desc: string }> = {
  [StatName.Strength]: { cn: '力量', en: 'STRENGTH', desc: '近战攻击、举起\n攀爬、挣脱' },
  [StatName.Dexterity]: { cn: '敏捷', en: 'DEXTERITY', desc: '闪避、潜行\n巧手' },
  [StatName.Constitution]: { cn: '体质', en: 'CONSTITUTION', desc: '物理抗性\n物品槽、承伤' },
  [StatName.Intelligence]: { cn: '智力', en: 'INTELLIGENCE', desc: '开锁、炼金术\n每日法术数量' },
  [StatName.Wisdom]: { cn: '感知', en: 'WISDOM', desc: '远程攻击、觅食\n导航、法术抗性' },
  [StatName.Charisma]: { cn: '魅力', en: 'CHARISMA', desc: '先攻、说服\n同伴、祝福' },
};

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

// ── SVG 几何图形组件 ───────────────────────────────────────────────────────────

const ShieldShape: React.FC<{ value: number | string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center gap-0.5">
    <svg viewBox="0 0 60 68" className="w-14 h-16">
      <path d="M30 4 L56 14 L56 38 Q56 58 30 66 Q4 58 4 38 L4 14 Z"
        fill="white" stroke="black" strokeWidth="2.5" />
      <text x="30" y="40" textAnchor="middle" dominantBaseline="middle"
        fontSize="18" fontWeight="bold" fontFamily="serif">{value}</text>
    </svg>
    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
  </div>
);

const CircleShape: React.FC<{ value: number | string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center gap-0.5">
    <svg viewBox="0 0 60 60" className="w-14 h-14">
      <circle cx="30" cy="30" r="27" fill="white" stroke="black" strokeWidth="2.5" />
      <text x="30" y="30" textAnchor="middle" dominantBaseline="middle"
        fontSize="18" fontWeight="bold" fontFamily="serif">{value}</text>
    </svg>
    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
  </div>
);

const HexShape: React.FC<{ value: number | string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center gap-0.5">
    <svg viewBox="0 0 60 68" className="w-14 h-16">
      <polygon points="30,4 56,19 56,49 30,64 4,49 4,19"
        fill="white" stroke="black" strokeWidth="2.5" />
      <text x="30" y="36" textAnchor="middle" dominantBaseline="middle"
        fontSize="16" fontWeight="bold" fontFamily="serif">{value}</text>
    </svg>
    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
  </div>
);

const BannerShape: React.FC<{ value: number | string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center gap-0.5">
    <svg viewBox="0 0 90 50" className="w-20 h-12">
      <path d="M4 4 L86 4 L86 38 L45 50 L4 38 Z"
        fill="white" stroke="black" strokeWidth="2.5" />
      <text x="45" y="24" textAnchor="middle" dominantBaseline="middle"
        fontSize="14" fontWeight="bold" fontFamily="serif">{value}</text>
    </svg>
    <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
  </div>
);

// ── 主组件 ────────────────────────────────────────────────────────────────────
const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onEdit }) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const maxSlots = 10 + character.stats[StatName.Constitution].value;
  const armorItems = character.inventory.filter(i => i.type === 'armor');
  const totalAP = armorItems.reduce((s, i) => s + (i.defense || 0), 0);
  const totalAC = Math.min(18, 11 + totalAP);
  const displayId = useMemo(() =>
    character.id.replace(/-/g, '').slice(0, 9).toUpperCase(), [character.id]);

  // 物品栏：最多显示 max(maxSlots, inventory.length) 行，但至少20格
  const displayRows = Math.max(20, maxSlots, character.inventory.length);
  const leftCount = Math.ceil(displayRows / 2);
  const rightCount = displayRows - leftCount;

  const handleDownloadPng = useCallback(async () => {
    if (!sheetRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(sheetRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
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

  const handleDownloadMd = useCallback(() => {
    let md = `# KNAVE 角色卡\n\n`;
    md += `**姓名:** ${character.name || '无名氏'}\n\n`;
    md += `**职业/背景:** ${character.traits.background || '---'}\n\n`;
    md += `**等级:** ${character.level} | **经验值:** ${character.xp}/1000\n\n`;
    md += `**生命值 (HP):** ${character.hp.current} / ${character.hp.max}\n\n`;
    md += `**护甲 (AC):** ${totalAC} | **护甲值 (AP):** ${totalAP}\n\n`;
    md += `## 属性\n\n`;
    (Object.values(character.stats) as Stat[]).forEach(stat => {
      md += `- **${stat.name}:** ${stat.value}\n`;
    });
    md += `\n## 特征\n\n`;
    Object.entries(character.traits).forEach(([k, v]) => {
      md += `- **${TRAIT_LABELS[k] || k.toUpperCase()}:** ${v || '---'}\n`;
    });
    md += `\n## 物品栏 (${character.inventory.reduce((s, i) => s + (i.slots || 0), 0)}/${maxSlots} 栏位)\n\n`;
    character.inventory.forEach((item, idx) => {
      md += `${idx + 1}. **${item.name}**`;
      if (item.slots !== 1) md += ` (${item.slots}栏位)`;
      if (item.type === 'weapon' && item.damage) md += ` [伤害:${item.damage}]`;
      if (item.type === 'armor' && item.defense) md += ` [AP:+${item.defense}]`;
      if (item.quality !== undefined && item.quality > 0) md += ` (耐久:${item.quality})`;
      md += `\n`;
    });
    if (character.memo) md += `\n## 个人备忘\n\n${character.memo}\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${character.name || 'Knave_Character'}_Sheet.md`;
    link.click();
    URL.revokeObjectURL(url);
  }, [character, totalAC, totalAP, maxSlots]);

  // ── 渲染物品行 ──────────────────────────────────────────────────────────────
  const renderInventoryRow = (idx: number) => {
    const item = character.inventory[idx];
    return (
      <div key={idx}
        className="flex items-center border-b border-dotted border-black h-8 px-2 last:border-b-0"
        style={{ borderBottomStyle: 'dotted', borderBottomWidth: '1.5px' }}
      >
        <span className="text-xs italic text-black mr-2 select-none w-5 shrink-0">{idx + 1}</span>
        {item ? (
          <div className="flex flex-grow items-center justify-between min-w-0">
            <span className="font-serif text-sm font-bold truncate">{item.name}</span>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {item.type === 'weapon' && item.damage && (
                <span className="text-[10px] text-black font-mono">{item.damage}</span>
              )}
              {item.type === 'armor' && item.defense && (
                <span className="text-[10px] text-black font-mono">+{item.defense}AP</span>
              )}
              {item.quality !== undefined && item.quality > 0 && (
                <span className="text-[10px] text-black">◈{item.quality}</span>
              )}
              {(item.slots || 1) > 1 && (
                <span className="text-[10px] text-black">[{item.slots}]</span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-grow" />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[210mm] mx-auto">
      {/* ── 控制栏（不导出）─────────────────────────────────────────── */}
      <div className="no-print mb-4 flex justify-between items-center bg-stone-100 p-3 rounded border border-stone-300 flex-wrap gap-3">
        <button onClick={onEdit}
          className="flex items-center gap-2 text-stone-700 hover:text-stone-900 font-bold transition-colors">
          <ArrowLeft size={18} /> 返回编辑 (Back)
        </button>
        <div className="flex gap-2">
          <button onClick={handleDownloadMd}
            className="flex items-center gap-1.5 bg-stone-100 text-stone-800 border border-stone-300 px-3 py-1.5 rounded shadow-sm hover:bg-stone-50 transition-all font-bold text-sm">
            <FileText size={16} /> 保存为MD
          </button>
          <button onClick={handleDownloadPng} disabled={isGenerating}
            className="flex items-center gap-1.5 bg-stone-800 text-white px-3 py-1.5 rounded shadow hover:bg-stone-700 disabled:opacity-50 transition-all font-bold text-sm">
            {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
            {isGenerating ? '生成中...' : '保存为PNG'}
          </button>
        </div>
      </div>

      {/* ── 角色卡主体（可导出）────────────────────────────────────────── */}
      <div ref={sheetRef}
        className="bg-white text-black font-serif select-none relative"
        style={{ width: '210mm', minHeight: '297mm', padding: '10mm', boxSizing: 'border-box', fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {/* 撕卡水印 */}
        {character.isDead && (
          <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
            <div style={{ color: 'rgba(180,0,0,0.15)', fontSize: '140px', fontWeight: 900, transform: 'rotate(-40deg)', border: '12px solid rgba(180,0,0,0.15)', padding: '8px 24px', letterSpacing: '12px', lineHeight: 1 }}>
              DECEASED
            </div>
          </div>
        )}

        {/* ══ 上半部分 ══════════════════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '52mm 1fr', gap: '6mm', marginBottom: '5mm' }}>

          {/* ── 左列：Logo + 6属性 ─────────────────────────────────────── */}
          <div>
            {/* KNAVE Logo */}
            <div style={{ marginBottom: '3mm', borderBottom: '2px solid black', paddingBottom: '2mm' }}>
              <div style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1, letterSpacing: '-2px', fontFamily: 'Georgia, serif', textTransform: 'uppercase' }}>Knave</div>
              <div style={{ fontSize: '10px', fontStyle: 'italic', marginTop: '-2px', fontFamily: 'Georgia, serif' }}>Second Edition</div>
            </div>

            {/* 6 属性 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
              {(Object.values(character.stats) as Stat[]).map(stat => {
                const info = STAT_DESCRIPTIONS[stat.name as StatName];
                return (
                  <div key={stat.name} style={{ display: 'flex', alignItems: 'center', gap: '3mm' }}>
                    {/* 圆形数值框 */}
                    <div style={{
                      width: '11mm', height: '11mm', borderRadius: '50%',
                      border: '2px solid black', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', fontWeight: 'bold'
                    }}>
                      {stat.value}
                    </div>
                    {/* 文字 */}
                    <div>
                      <div style={{ fontSize: '9px', fontWeight: 'bold', lineHeight: 1.2 }}>
                        {info.cn}<span style={{ fontSize: '8px', marginLeft: '1px' }}>{info.en}</span>
                      </div>
                      {info.desc.split('\n').map((line, i) => (
                        <div key={i} style={{ fontSize: '7.5px', color: '#333', lineHeight: 1.4, fontStyle: 'italic' }}>{line}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 右列：角色信息 ──────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>

            {/* NAME */}
            <div>
              <div style={{ fontSize: '8px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5mm' }}>NAME</div>
              <div style={{ borderBottom: '1.5px dotted black', height: '6mm', paddingLeft: '2mm', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'flex-end', paddingBottom: '1mm' }}>
                {character.name || ''}
              </div>
            </div>

            {/* CAREERS / BACKGROUND */}
            <div>
              <div style={{ fontSize: '8px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '0.5mm' }}>CAREERS</div>
              <div style={{ borderBottom: '1.5px dotted black', height: '6mm', paddingLeft: '2mm', fontSize: '11px', display: 'flex', alignItems: 'flex-end', paddingBottom: '1mm' }}>
                {character.traits.background || ''}
              </div>
            </div>

            {/* AC / AP / LEVEL / XP 几何图标行 */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3mm', marginTop: '1mm' }}>
              {/* AC - 盾形 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg viewBox="0 0 54 62" style={{ width: '14mm', height: '16mm' }}>
                  <path d="M27 3 L51 13 L51 36 Q51 54 27 61 Q3 54 3 36 L3 13 Z"
                    fill="white" stroke="black" strokeWidth="2.5" />
                  <text x="27" y="36" textAnchor="middle" dominantBaseline="middle"
                    fontSize="15" fontWeight="bold" fontFamily="Georgia, serif">{totalAC}</text>
                </svg>
                <span style={{ fontSize: '7px', fontWeight: 'bold', letterSpacing: '0.5px' }}>AC</span>
              </div>

              {/* AP - 五边形 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg viewBox="0 0 54 62" style={{ width: '14mm', height: '16mm' }}>
                  <polygon points="27,4 51,19 51,45 27,60 3,45 3,19"
                    fill="white" stroke="black" strokeWidth="2.5" />
                  <text x="27" y="33" textAnchor="middle" dominantBaseline="middle"
                    fontSize="15" fontWeight="bold" fontFamily="Georgia, serif">{totalAP}</text>
                </svg>
                <span style={{ fontSize: '7px', fontWeight: 'bold', letterSpacing: '0.5px' }}>AP</span>
              </div>

              {/* LEVEL - 六边形 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg viewBox="0 0 54 62" style={{ width: '14mm', height: '16mm' }}>
                  <polygon points="27,3 51,16 51,46 27,59 3,46 3,16"
                    fill="white" stroke="black" strokeWidth="2.5" />
                  <text x="27" y="32" textAnchor="middle" dominantBaseline="middle"
                    fontSize="15" fontWeight="bold" fontFamily="Georgia, serif">{character.level}</text>
                </svg>
                <span style={{ fontSize: '7px', fontWeight: 'bold', letterSpacing: '0.5px' }}>LEVEL</span>
              </div>

              {/* XP - 丝带形 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg viewBox="0 0 90 50" style={{ width: '26mm', height: '14mm' }}>
                  <path d="M4 4 L86 4 L86 36 L45 48 L4 36 Z"
                    fill="white" stroke="black" strokeWidth="2.5" />
                  <text x="45" y="23" textAnchor="middle" dominantBaseline="middle"
                    fontSize="13" fontWeight="bold" fontFamily="Georgia, serif">{character.xp}</text>
                </svg>
                <span style={{ fontSize: '7px', fontWeight: 'bold', letterSpacing: '0.5px' }}>XP</span>
              </div>
            </div>

            {/* MAX HP + PORTRAIT + HP竖条 */}
            <div style={{ display: 'flex', gap: '3mm', flexGrow: 1 }}>
              {/* MAX HP + HP竖条 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm', alignItems: 'center' }}>
                {/* MAX HP 方块 */}
                <div style={{ border: '2px solid black', width: '16mm', height: '16mm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '7px', fontWeight: 'bold', lineHeight: 1 }}>MAX HP</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: 1.1 }}>{character.hp.max}</div>
                </div>
                {/* HP 竖向书签 */}
                <div style={{ border: '2px solid black', width: '10mm', flexGrow: 1, minHeight: '25mm', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '7px', fontWeight: 'bold', textAlign: 'center', padding: '1mm', borderBottom: '1px solid black', writingMode: 'vertical-rl', transform: 'rotate(180deg)', alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    HP
                  </div>
                </div>
              </div>

              {/* PORTRAIT 大框 */}
              <div style={{ border: '2px solid black', flexGrow: 1, minHeight: '38mm', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '7px', fontWeight: 'bold', letterSpacing: '1px', padding: '1mm 2mm', borderBottom: '1.5px solid black' }}>PORTRAIT</div>
                {/* 特征信息 */}
                <div style={{ padding: '2mm', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5mm 2mm', flexGrow: 1 }}>
                  {Object.entries(character.traits).filter(([k]) => k !== 'background').map(([k, v]) => (
                    <div key={k} style={{ borderBottom: '0.5px solid #ccc', paddingBottom: '0.5mm' }}>
                      <div style={{ fontSize: '6px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase', lineHeight: 1 }}>{TRAIT_LABELS[k]?.split(' ')[0] || k}</div>
                      <div style={{ fontSize: '8px', fontWeight: 'bold', lineHeight: 1.2 }}>{v || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ 物品栏 ════════════════════════════════════════════════════════ */}
        <div style={{ border: '2px solid black' }}>
          {/* 物品栏标题行 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '2px solid black' }}>
            <div style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '1px', padding: '1.5mm 2mm', borderRight: '1px solid black' }}>
              INVENTORY SLOTS &nbsp;<span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>物品栏位</span>
              &nbsp;—&nbsp;
              <span style={{ fontWeight: 'normal' }}>{character.inventory.reduce((s, i) => s + (i.slots || 0), 0)} / {maxSlots}</span>
            </div>
            <div style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '1px', padding: '1.5mm 2mm' }}>
              &nbsp;
            </div>
          </div>

          {/* 物品内容：左右两列 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {/* 左列 1~leftCount */}
            <div style={{ borderRight: '1.5px solid black' }}>
              {Array.from({ length: leftCount }).map((_, i) => {
                const item = character.inventory[i];
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center',
                    height: '9mm', padding: '0 3mm',
                    borderBottom: i < leftCount - 1 ? '1.5px dotted black' : 'none',
                  }}>
                    <span style={{ fontSize: '9px', fontStyle: 'italic', color: '#555', marginRight: '3mm', width: '5mm', flexShrink: 0 }}>{i + 1}</span>
                    {item ? (
                      <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                        <div style={{ display: 'flex', gap: '2mm', flexShrink: 0, marginLeft: '2mm', fontSize: '9px' }}>
                          {item.type === 'weapon' && item.damage && <span>{item.damage}</span>}
                          {item.type === 'armor' && item.defense && <span>+{item.defense}AP</span>}
                          {item.quality !== undefined && item.quality > 0 && <span>◈{item.quality}</span>}
                          {(item.slots || 1) > 1 && <span>[{item.slots}]</span>}
                        </div>
                      </div>
                    ) : <div style={{ flexGrow: 1 }} />}
                  </div>
                );
              })}
            </div>

            {/* 右列 leftCount+1 ~ displayRows */}
            <div>
              {Array.from({ length: rightCount }).map((_, i) => {
                const realIdx = i + leftCount;
                const item = character.inventory[realIdx];
                return (
                  <div key={realIdx} style={{
                    display: 'flex', alignItems: 'center',
                    height: '9mm', padding: '0 3mm',
                    borderBottom: i < rightCount - 1 ? '1.5px dotted black' : 'none',
                  }}>
                    <span style={{ fontSize: '9px', fontStyle: 'italic', color: '#555', marginRight: '3mm', width: '6mm', flexShrink: 0 }}>{realIdx + 1}</span>
                    {item ? (
                      <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                        <div style={{ display: 'flex', gap: '2mm', flexShrink: 0, marginLeft: '2mm', fontSize: '9px' }}>
                          {item.type === 'weapon' && item.damage && <span>{item.damage}</span>}
                          {item.type === 'armor' && item.defense && <span>+{item.defense}AP</span>}
                          {item.quality !== undefined && item.quality > 0 && <span>◈{item.quality}</span>}
                          {(item.slots || 1) > 1 && <span>[{item.slots}]</span>}
                        </div>
                      </div>
                    ) : <div style={{ flexGrow: 1 }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 底部版权 ─────────────────────────────────────────────────── */}
        <div style={{ marginTop: '4mm', textAlign: 'center', fontSize: '7px', color: '#888', fontStyle: 'italic' }}>
          <span>Knave by Ben Milton · Knave Character Builder · ID: {displayId}</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;