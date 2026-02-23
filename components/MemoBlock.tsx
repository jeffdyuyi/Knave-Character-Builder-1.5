import React from 'react';
import { StickyNote, Save } from 'lucide-react';

interface MemoBlockProps {
    memo: string;
    onChange: (value: string) => void;
}

const MemoBlock: React.FC<MemoBlockProps> = ({ memo, onChange }) => {
    return (
        <div className="bg-white p-6 rounded-sm shadow-md border-2 border-stone-800 h-full flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-4 border-b-2 border-stone-800 pb-2">
                <h2 className="text-3xl font-bold font-serif flex items-center gap-2">
                    <StickyNote size={28} className="text-amber-700" />
                    备忘录 (Memo)
                </h2>
                <div className="text-xs text-stone-500 font-serif italic flex items-center gap-1">
                    <Save size={12} />
                    内容将自动保存至本地
                </div>
            </div>

            <div className="flex-grow flex flex-col">
                <textarea
                    value={memo}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="在此记录你的冒险旅程、NPC姓名、任务目标或任何重要信息..."
                    className="flex-grow w-full p-4 font-serif text-lg text-stone-800 bg-stone-50 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 transition-all resize-none leading-relaxed shadow-inner"
                />
            </div>

            <div className="mt-4 text-[10px] text-stone-400 font-serif uppercase tracking-widest text-center">
                The ink of a scholar is more holy than the blood of a martyr
            </div>
        </div>
    );
};

export default MemoBlock;
