import React from 'react';
import { Traits } from '../types';
import { Shuffle } from 'lucide-react';

interface TraitBlockProps {
  traits: Traits;
  onRandomize: () => void;
}

const TraitBlock: React.FC<TraitBlockProps> = ({ traits, onRandomize }) => {
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
        <TraitItem label="体格 Physique" value={traits.physique} />
        <TraitItem label="面容 Face" value={traits.face} />
        <TraitItem label="皮肤 Skin" value={traits.skin} />
        <TraitItem label="毛发 Hair" value={traits.hair} />
        <TraitItem label="衣物 Clothing" value={traits.clothing} />
        <TraitItem label="言谈 Speech" value={traits.speech} />
        <TraitItem label="美德 Virtue" value={traits.virtue} />
        <TraitItem label="恶癖 Vice" value={traits.vice} />
        <TraitItem label="背景 Background" value={traits.background} />
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
