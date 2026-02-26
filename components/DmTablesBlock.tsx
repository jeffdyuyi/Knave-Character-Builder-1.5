import React, { useState } from 'react';
import { TRAIT_TABLES, CAREERS, DUNGEONEERING_GEAR, GENERAL_GEAR_1, GENERAL_GEAR_2, SPELLS_DATA, NPC_IDENTITIES, TRAVEL_HAZARDS, WEATHER_CONDITIONS_2D6, TRAVEL_EVENTS } from '../constants';
import { Dices, Plus, Trash2, Settings, List } from 'lucide-react';

// Registry of all random tables
const TABLES_REGISTRY = [
    { id: 'npc_ident', name: 'NPC 社会身份 (d100)', items: NPC_IDENTITIES },
    { id: 'travel_hazards', name: '旅行危险 (d6)', items: TRAVEL_HAZARDS },
    { id: 'weather', name: '天气与气候变动 (2d6)', items: WEATHER_CONDITIONS_2D6 },
    { id: 'travel_events', name: '旅行环境变动异象 (d100)', items: TRAVEL_EVENTS },
    { id: 'careers', name: '职业/背景 (d100)', items: CAREERS.map(c => c.name) },
    { id: 'spells', name: '无等级法术 (d100)', items: SPELLS_DATA.map(s => s.name) },
    { id: 'dungeon_gear', name: '地城装备 (d20)', items: DUNGEONEERING_GEAR },
    { id: 'general_gear_1', name: '一般装备 I (d20)', items: GENERAL_GEAR_1 },
    { id: 'general_gear_2', name: '一般装备 II (d20)', items: GENERAL_GEAR_2 },
    ...Object.entries(TRAIT_TABLES).map(([k, v]) => ({ id: `trait_${k}`, name: `特征 - ${k.toUpperCase()} (d20)`, items: v })),
];

interface RollRequest {
    id: string;
    tableId: string;
    count: number;
}

interface RollResult {
    tableName: string;
    rolled: string[];
}

const DmTablesBlock: React.FC = () => {
    const [requests, setRequests] = useState<RollRequest[]>([
        { id: crypto.randomUUID(), tableId: 'npc_ident', count: 1 }
    ]);
    const [results, setResults] = useState<RollResult[] | null>(null);

    const handleAddRequest = () => {
        setRequests(prev => [...prev, { id: crypto.randomUUID(), tableId: TABLES_REGISTRY[0].id, count: 1 }]);
    };

    const handleRemoveRequest = (id: string) => {
        setRequests(prev => prev.filter(r => r.id !== id));
    };

    const handleChangeTable = (id: string, tableId: string) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, tableId } : r));
    };

    const handleChangeCount = (id: string, count: number) => {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, count: Math.max(1, count) } : r));
    };

    const handleRollAll = () => {
        const newResults: RollResult[] = [];
        requests.forEach(req => {
            const table = TABLES_REGISTRY.find(t => t.id === req.tableId);
            if (table) {
                const rolledItems = [];
                for (let i = 0; i < req.count; i++) {
                    rolledItems.push(table.items[Math.floor(Math.random() * table.items.length)]);
                }
                newResults.push({ tableName: table.name, rolled: rolledItems });
            }
        });
        setResults(newResults);
    };

    return (
        <div className="bg-white rounded-sm shadow-md border-2 border-stone-800 flex flex-col min-h-[500px]">
            <div className="bg-stone-900 text-white px-4 py-3 border-b-2 border-amber-600 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold font-serif tracking-wider">主持人工具</h2>
                    <span className="text-stone-400 text-sm font-serif italic">DM Tools - 动态随机表生成器</span>
                </div>
            </div>

            <div className="p-6 flex flex-col gap-6">
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-sm shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                        <h3 className="font-bold text-lg font-serif flex items-center gap-2">
                            <Settings size={20} className="text-amber-700" />
                            配置生成项 (Roll Config)
                        </h3>
                        <button
                            onClick={handleAddRequest}
                            className="flex items-center gap-1 text-sm bg-stone-200 hover:bg-stone-300 text-stone-800 px-3 py-1 font-bold rounded transition-colors"
                        >
                            <Plus size={16} /> 添加随机表
                        </button>
                    </div>

                    <div className="space-y-3">
                        {requests.map((req, index) => (
                            <div key={req.id} className="flex flex-col sm:flex-row gap-3 items-center bg-white p-3 border border-stone-200 rounded">
                                <span className="font-mono text-stone-400 font-bold shrink-0">{index + 1}.</span>
                                <select
                                    className="w-full sm:flex-grow border border-stone-300 rounded px-2 py-1.5 focus:border-stone-800 focus:outline-none font-serif font-bold text-stone-700"
                                    value={req.tableId}
                                    onChange={(e) => handleChangeTable(req.id, e.target.value)}
                                >
                                    {TABLES_REGISTRY.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>

                                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 pl-0 sm:pl-4 border-l-0 sm:border-l border-stone-200">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-stone-500 uppercase">数量:</span>
                                        <input
                                            type="number"
                                            min="1" max="50"
                                            value={req.count}
                                            onChange={(e) => handleChangeCount(req.id, parseInt(e.target.value) || 1)}
                                            className="w-16 border border-stone-300 text-center rounded py-1 focus:border-stone-800 focus:outline-none font-bold text-stone-800"
                                        />
                                    </div>

                                    <button
                                        onClick={() => handleRemoveRequest(req.id)}
                                        className="text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors p-1 rounded"
                                        title="移除此项"
                                        disabled={requests.length <= 1}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-2 flex pl-1">
                        <span className="text-stone-400 text-xs italic">
                            您可以自由组合不同随机表，并一次性投掷生成所需内容。如果需要创建大量杂兵NPC、或配置战利品堆，这也是非常方便的。
                        </span>
                    </div>

                    <div className="pt-4 border-t border-stone-200">
                        <button
                            onClick={handleRollAll}
                            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 rounded shadow hover:shadow-md transition-all flex justify-center items-center gap-2 text-lg"
                        >
                            <Dices size={24} /> 摇骰生成 (Roll Selected)
                        </button>
                    </div>
                </div>

                {results && (
                    <div className="border-t-2 border-stone-800 pt-6">
                        <h3 className="font-black text-2xl font-serif mb-4 flex items-center gap-2 text-stone-900 border-b pb-2">
                            <List size={24} /> 生成结果
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results.map((res, rIdx) => (
                                <div key={rIdx} className="border border-stone-300 rounded overflow-hidden shadow-sm bg-white flex flex-col h-fit">
                                    <div className="bg-stone-200 px-3 py-2 font-bold font-serif text-stone-800 border-b border-stone-300">
                                        {res.tableName}
                                    </div>
                                    <ul className="divide-y divide-stone-100 p-0 text-sm flex-grow">
                                        {res.rolled.map((item, iIdx) => (
                                            <li key={iIdx} className="px-3 py-2 hover:bg-amber-50 flex items-start gap-2">
                                                <span className="text-stone-400 font-mono text-[10px] font-bold w-4 shrink-0 pt-0.5">{iIdx + 1}.</span>
                                                <span className="text-stone-800 font-serif leading-tight">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DmTablesBlock;
