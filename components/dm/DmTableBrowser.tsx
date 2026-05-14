import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Dices, Search } from 'lucide-react';
import { TableEntry, TableGroup } from './dmTypes';
import { rollDmTableItem } from '../../utils/dmRoll';
import { DmDice } from '../../data/dmTables.registry';

interface DmTableBrowserProps {
    tableGroups: TableGroup[];
    allTables: Array<TableEntry & { dice?: DmDice }>;
}

const DmTableBrowser: React.FC<DmTableBrowserProps> = ({ tableGroups, allTables }) => {
    const [search, setSearch] = useState('');
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['char_creation']));
    const [rollResult, setRollResult] = useState<{ tableId: string; result: string } | null>(null);

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            next.has(groupId) ? next.delete(groupId) : next.add(groupId);
            return next;
        });
    };

    const filteredGroups = useMemo(() => {
        if (!search.trim()) return tableGroups;
        const q = search.toLowerCase();
        return tableGroups.map(g => ({
            ...g,
            tables: g.tables.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.items.some(item => item.toLowerCase().includes(q))
            ),
        })).filter(g => g.tables.length > 0);
    }, [search, tableGroups]);

    const displayedGroups = useMemo(() => {
        if (search.trim()) {
            return filteredGroups.map(g => ({ ...g, expanded: true }));
        }
        return filteredGroups.map(g => ({ ...g, expanded: expandedGroups.has(g.groupId) }));
    }, [filteredGroups, search, expandedGroups]);

    const handleRoll = (table: TableEntry) => {
        const dice = allTables.find(t => t.id === table.id)?.dice;
        const result = rollDmTableItem(table, dice);
        setRollResult({ tableId: table.id, result });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input
                    type="text"
                    placeholder="搜索随机表或内容..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-600 font-serif text-sm"
                />
            </div>

            {rollResult && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded font-serif text-amber-900 text-sm shadow-sm flex justify-between items-start">
                    <span><strong>[{allTables.find(t => t.id === rollResult.tableId)?.name}]</strong> → {rollResult.result}</span>
                    <button onClick={() => setRollResult(null)} className="text-amber-400 hover:text-amber-700 ml-3 shrink-0 text-xs">关闭</button>
                </div>
            )}

            {displayedGroups.map(g => (
                <div key={g.groupId} className="border border-stone-200 rounded overflow-hidden">
                    <button
                        onClick={() => toggleGroup(g.groupId)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-stone-100 hover:bg-stone-200 transition-colors font-bold font-serif text-stone-800 text-left"
                    >
                        <span className="flex items-center gap-2">
                            {g.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            {g.groupName}
                            <span className="text-xs font-normal text-stone-500 font-sans">({g.tables.length} 张表)</span>
                        </span>
                    </button>

                    {g.expanded && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
                            {g.tables.map(table => (
                                <div key={table.id} className="border border-stone-200 rounded overflow-hidden flex flex-col bg-stone-50">
                                    <div className="bg-stone-200 px-3 py-2 flex justify-between items-center border-b border-stone-300">
                                        <span className="font-bold text-xs text-stone-700 leading-tight">{table.name}</span>
                                        <button
                                            onClick={() => handleRoll(table)}
                                            className="shrink-0 ml-2 text-amber-700 hover:text-amber-900 hover:bg-amber-200/50 p-1 rounded transition-colors"
                                            title="随机摇骰"
                                        >
                                            <Dices size={14} />
                                        </button>
                                    </div>
                                    <div className="overflow-y-auto max-h-36 p-0">
                                        {table.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex items-baseline px-2 py-1 border-b border-stone-100 last:border-0 text-xs hover:bg-stone-100 ${rollResult?.tableId === table.id && rollResult.result === item ? 'bg-amber-50 font-bold' : ''}`}
                                            >
                                                <span className="w-5 font-mono text-stone-300 text-[10px] shrink-0">{idx + 1}.</span>
                                                <span className="text-stone-700 font-serif leading-tight">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DmTableBrowser;
