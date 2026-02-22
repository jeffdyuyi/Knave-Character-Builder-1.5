import React from 'react';
import { Stat, StatName } from '../types';
import { RefreshCcw, ArrowLeftRight } from 'lucide-react';

interface StatBlockProps {
  stats: Record<StatName, Stat>;
  onRerollAll: () => void;
  onSwap: (stat1: StatName, stat2: StatName) => void;
}

const StatBlock: React.FC<StatBlockProps> = ({ stats, onRerollAll, onSwap }) => {
  const [swapMode, setSwapMode] = React.useState(false);
  const [selectedStat, setSelectedStat] = React.useState<StatName | null>(null);

  const handleStatClick = (statName: StatName) => {
    if (!swapMode) return;
    
    if (selectedStat === null) {
      setSelectedStat(statName);
    } else if (selectedStat === statName) {
      setSelectedStat(null); // Deselect
    } else {
      onSwap(selectedStat, statName);
      setSelectedStat(null);
      setSwapMode(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-sm shadow-md border-2 border-stone-800">
      <div className="flex justify-between items-center mb-4 border-b pb-2 border-stone-300">
        <h2 className="text-2xl font-bold font-serif">属性 (Stats)</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => { setSwapMode(!swapMode); setSelectedStat(null); }}
            className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${swapMode ? 'bg-amber-200 text-amber-900 border border-amber-500' : 'bg-stone-200 hover:bg-stone-300 text-stone-800'}`}
          >
            <ArrowLeftRight size={16} />
            {swapMode ? '取消交换' : '交换属性'}
          </button>
          <button 
            onClick={onRerollAll}
            className="flex items-center gap-1 px-3 py-1 bg-stone-800 text-white rounded text-sm hover:bg-stone-700 transition-colors"
          >
            <RefreshCcw size={16} />
            重投所有
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div className="grid grid-cols-5 text-sm font-bold text-stone-500 border-b border-stone-200 pb-1">
          <div className="col-span-2">属性名</div>
          <div className="text-center">骰点</div>
          <div className="text-center">奖励</div>
          <div className="text-center">防御</div>
        </div>
        {(Object.values(stats) as Stat[]).map((stat) => (
          <div 
            key={stat.name} 
            onClick={() => handleStatClick(stat.name)}
            className={`grid grid-cols-5 items-center py-2 border-b border-stone-100 last:border-0 cursor-pointer transition-colors 
              ${swapMode ? 'hover:bg-amber-50' : ''} 
              ${selectedStat === stat.name ? 'bg-amber-100 ring-2 ring-amber-400' : ''}`}
          >
            <div className="col-span-2 font-serif text-lg font-bold text-stone-900">{stat.name}</div>
            <div className="text-center text-xs text-stone-400 font-mono">
              [{stat.dice.join(', ')}]
            </div>
            <div className="text-center font-bold text-lg text-amber-700">+{stat.bonus}</div>
            <div className="text-center font-bold text-lg text-stone-700">{stat.defense}</div>
          </div>
        ))}
      </div>
      
      {swapMode && (
        <div className="mt-2 text-xs text-amber-700 italic text-center">
          {selectedStat ? `点击另一个属性以交换 ${selectedStat}` : "点击一个属性以开始交换"}
        </div>
      )}

      <div className="mt-4 text-xs text-stone-500">
        <p><strong>规则:</strong> 投3d6，最低骰值为奖励值。防御 = 奖励 + 10。</p>
        <p>你可以选择交换任意两项属性的数值。</p>
      </div>
    </div>
  );
};

export default StatBlock;