import React from 'react';
import { Stat, StatName } from '../types';
import { RefreshCcw, ArrowLeftRight } from 'lucide-react';

interface StatBlockProps {
  stats: Record<StatName, Stat>;
  onRerollAll: () => void;
  onAdjustStat: (statName: StatName, amount: number) => void;
}

const StatBlock: React.FC<StatBlockProps> = ({ stats, onRerollAll, onAdjustStat }) => {
  return (
    <div className="bg-white p-4 rounded-sm shadow-md border-2 border-stone-800">
      <div className="flex justify-between items-center mb-4 border-b pb-2 border-stone-300">
        <h2 className="text-2xl font-bold font-serif">属性 (Attributes)</h2>
        <div className="flex gap-2">
          <button
            onClick={onRerollAll}
            className="flex items-center gap-1 px-3 py-1 bg-stone-800 text-white rounded text-sm hover:bg-stone-700 transition-colors"
          >
            <RefreshCcw size={16} />
            重投所有 (3d6)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div className="grid grid-cols-5 text-sm font-bold text-stone-500 border-b border-stone-200 pb-1">
          <div className="col-span-3">属性名</div>
          <div className="text-center col-span-2">数值 (0-10)</div>
        </div>
        {(Object.values(stats) as Stat[]).map((stat) => (
          <div
            key={stat.name}
            className="grid grid-cols-5 items-center py-2 border-b border-stone-100 last:border-0"
          >
            <div className="col-span-3 font-serif text-lg font-bold text-stone-900">{stat.name}</div>
            <div className="flex items-center justify-center gap-3 col-span-2">
              <button
                onClick={() => onAdjustStat(stat.name, -1)}
                disabled={stat.value <= 0}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <div className="text-center font-bold text-xl text-amber-700 w-8">{stat.value}</div>
              <button
                onClick={() => onAdjustStat(stat.name, 1)}
                disabled={stat.value >= 10}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-stone-500 space-y-1">
        <p><strong>规则:</strong> 新角色分配3点属性，或投掷3d6，分配1点给每颗骰子对应的属性 (1=力量, 2=敏捷, 3=体质, 4=智力, 5=感知, 6=魅力)。你可以自由调整数值，初始通常一共3点。</p>
        <p>检定: 1d20 + 属性值 + 优势/劣势(±5) &ge; 11 + 困难度。</p>
      </div>
    </div>
  );
};

export default StatBlock;