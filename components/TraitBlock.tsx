import React from 'react';
import { Traits } from '../types';
import { Shuffle } from 'lucide-react';
import { CAREERS } from '../constants';

interface TraitBlockProps {
  traits: Traits;
  onRandomize: () => void;
  onBackgroundChange: (backgroundName: string) => void;
}

const TraitBlock: React.FC<TraitBlockProps> = ({ traits, onRandomize, onBackgroundChange }) => {
  return (
    <div className="bg-white p-4 rounded-sm shadow-md border-2 border-stone-800 h-full">
      <div className="flex justify-between items-center mb-4 border-b pb-2 border-stone-300">
        <h2 className="text-2xl font-bold font-serif">特征 (Traits)</h2>
        <button
          onClick={onRandomize}
          className="flex items-center gap-1 px-3 py-1 bg-stone-200 text-stone-800 rounded text-sm hover:bg-stone-300 transition-colors"
        >
          <Shuffle size={16} />
          随机生成
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        <div className="col-span-1 sm:col-span-2 flex flex-col border-b border-stone-100 pb-2 mb-2 bg-stone-50 p-2 rounded">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">背景 Background</span>
            <button
              onClick={() => {
                const randomCareer = CAREERS[Math.floor(Math.random() * CAREERS.length)].name;
                onBackgroundChange(randomCareer);
              }}
              className="text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
            >
              <Shuffle size={12} /> 随机背景
            </button>
          </div>
          <select
            value={traits.background || ''}
            onChange={(e) => onBackgroundChange(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded px-2 py-1 focus:outline-none focus:border-stone-800 font-serif text-lg text-stone-800 font-bold"
          >
            <option value="">-- 选择或随机背景 --</option>
            {CAREERS.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
          <div className="text-[10px] text-stone-400 mt-1 italic">
            *选择或随机背景后，将自动把相关起始物品添加至物品栏。
          </div>
        </div>

        <TraitItem label="体格 Physique" value={traits.physique} />
        <TraitItem label="面容 Face" value={traits.face} />
        <TraitItem label="皮肤 Skin" value={traits.skin} />
        <TraitItem label="毛发 Hair" value={traits.hair} />
        <TraitItem label="衣物 Clothing" value={traits.clothing} />
        <TraitItem label="言谈 Speech" value={traits.speech} />
        <TraitItem label="美德 Virtue" value={traits.virtue} />
        <TraitItem label="恶癖 Vice" value={traits.vice} />
        <TraitItem label="厄运 Misfortune" value={traits.misfortune} />
        <TraitItem label="阵营 Alignment" value={traits.alignment} />
      </div>
    </div>
  );
};

const TraitItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col border-b border-stone-100 pb-1">
    <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{label}</span>
    <span className="font-serif text-lg text-stone-800">{value}</span>
  </div>
);

export default TraitBlock;
