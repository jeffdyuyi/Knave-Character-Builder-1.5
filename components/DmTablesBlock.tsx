import React, { useState } from 'react';
import { Dices, Plus, Trash2, Settings, List, BookOpen, AlertTriangle, Image, FileText } from 'lucide-react';
import DmTableBrowser from './dm/DmTableBrowser';
import { HistoryEntry, RollRequest } from './dm/dmTypes';
import { ALL_TABLES, TABLES_GROUPS } from '../data/dmTables.registry';
import { exportDmHistoryAsImage, exportDmHistoryAsMarkdown } from '../utils/dmExport';
import { rollDmRequests } from '../utils/dmRoll';

// ─── 随机表注册表（带分组） ───────────────────────────────────────────────────



// ─── 主组件 ───────────────────────────────────────────────────────────────────

const DmTablesBlock: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'roller' | 'browser' | 'hazards'>('roller');
    const [requests, setRequests] = useState<RollRequest[]>([
        { id: crypto.randomUUID(), tableId: 'npc_ident', count: 1 }
    ]);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    const handleAddRequest = () => {
        setRequests(prev => [...prev, { id: crypto.randomUUID(), tableId: ALL_TABLES[0].id, count: 1 }]);
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
        const newEntry = rollDmRequests(requests, ALL_TABLES);
        setHistory(prev => [newEntry, ...prev]);
    };

    const updateMemo = (id: string, memo: string) => {
        setHistory(prev => prev.map(e => e.id === id ? { ...e, memo } : e));
    };

    const removeHistoryEntry = (id: string) => {
        setHistory(prev => prev.filter(e => e.id !== id));
    };

    const clearHistory = () => {
        setHistory([]);
    };


    // Build grouped option list for the select
    const groupedOptions = TABLES_GROUPS.map(g => (
        <optgroup key={g.groupId} label={g.groupName}>
            {g.tables.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
            ))}
        </optgroup>
    ));

    return (
        <div className="bg-white rounded-sm shadow-md border-2 border-stone-800 flex flex-col min-h-[500px]">
            {/* Header */}
            <div className="bg-stone-900 text-white px-4 py-3 border-b-2 border-amber-600 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold font-serif tracking-wider">主持人工具</h2>
                    <span className="text-stone-400 text-sm font-serif italic">DM Tools - 随机表生成器</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b-2 border-stone-800 bg-stone-100 sticky top-[74px] z-10">
                <button
                    onClick={() => setActiveTab('roller')}
                    className={`flex-1 py-3 px-4 font-bold font-serif text-sm sm:text-base flex items-center justify-center gap-2 transition-colors
                        ${activeTab === 'roller' ? 'bg-white text-stone-900 border-b-2 border-white -mb-[2px]' : 'text-stone-500 hover:bg-stone-200'}`}
                >
                    <Settings size={18} /> 摇骰生成器
                </button>
                <button
                    onClick={() => setActiveTab('browser')}
                    className={`flex-1 py-3 px-4 font-bold font-serif text-sm sm:text-base flex items-center justify-center gap-2 transition-colors
                        ${activeTab === 'browser' ? 'bg-white text-stone-900 border-b-2 border-white -mb-[2px]' : 'text-stone-500 hover:bg-stone-200'}`}
                >
                    <BookOpen size={18} /> 浏览随机表
                </button>
                <button
                    onClick={() => setActiveTab('hazards')}
                    className={`flex-1 py-3 px-4 font-bold font-serif text-sm sm:text-base flex items-center justify-center gap-2 transition-colors
                        ${activeTab === 'hazards' ? 'bg-white text-stone-900 border-b-2 border-white -mb-[2px]' : 'text-stone-500 hover:bg-stone-200'}`}
                >
                    <AlertTriangle size={18} /> 危险参考
                </button>
            </div>

            <div className="p-0 flex flex-col flex-grow">
                {activeTab === 'roller' ? (
                    /* ── 左右双列布局 ── */
                    <div className="flex flex-row items-stretch flex-grow min-h-[520px]">

                        {/* ── 左列：配置区 ── */}
                        <div className="w-5/12 shrink-0 flex flex-col border-r-2 border-stone-200 bg-stone-50">
                            {/* 列标题 */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-stone-100">
                                <h3 className="font-bold font-serif flex items-center gap-2 text-stone-800">
                                    <Settings size={16} className="text-amber-700" />
                                    配置生成项
                                </h3>
                                <button
                                    onClick={handleAddRequest}
                                    className="flex items-center gap-1 text-xs bg-stone-200 hover:bg-stone-300 text-stone-700 px-2.5 py-1 font-bold rounded transition-colors"
                                >
                                    <Plus size={14} /> 添加表格
                                </button>
                            </div>

                            {/* 表格列表（可滚动） */}
                            <div className="flex-grow overflow-y-auto px-4 py-3 space-y-2">
                                {requests.map((req, index) => (
                                    <div key={req.id} className="bg-white border border-stone-200 rounded p-2.5 flex flex-col gap-2 shadow-sm">
                                        {/* 行号 + 删除 */}
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-stone-300 text-xs font-bold">#{index + 1}</span>
                                            <button
                                                onClick={() => handleRemoveRequest(req.id)}
                                                className="text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors p-0.5 rounded"
                                                title="移除此项"
                                                disabled={requests.length <= 1}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        {/* 下拉选表 */}
                                        <select
                                            className="w-full border border-stone-200 rounded px-2 py-1.5 text-xs focus:border-stone-600 focus:outline-none font-serif font-bold text-stone-700 bg-stone-50"
                                            value={req.tableId}
                                            onChange={(e) => handleChangeTable(req.id, e.target.value)}
                                        >
                                            {groupedOptions}
                                        </select>
                                        {/* 数量 */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">数量:</span>
                                            <input
                                                type="number"
                                                min="1" max="50"
                                                value={req.count}
                                                onChange={(e) => handleChangeCount(req.id, parseInt(e.target.value) || 1)}
                                                className="w-14 border border-stone-200 text-center rounded py-0.5 text-sm focus:border-stone-600 focus:outline-none font-bold text-stone-800"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 提示文字 + 摇骰按钮（固定在底部） */}
                            <div className="px-4 pb-4 pt-2 border-t border-stone-200 flex flex-col gap-2 shrink-0">
                                <p className="text-stone-400 text-[10px] italic leading-relaxed">
                                    自由组合随机表，一次性生成 NPC、战利品、地点等所需内容。
                                </p>
                                <button
                                    onClick={handleRollAll}
                                    className="w-full bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-bold py-2.5 rounded shadow hover:shadow-md transition-all flex justify-center items-center gap-2"
                                >
                                    <Dices size={20} /> 摇骰生成
                                </button>
                            </div>
                        </div>

                        {/* ── 右列：结果区 ── */}
                        <div className="flex-1 flex flex-col bg-stone-100">
                            {/* 列标题 */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-stone-50 shrink-0 shadow-sm z-10">
                                <h3 className="font-bold font-serif flex items-center gap-2 text-stone-800">
                                    <List size={16} className="text-amber-700" />
                                    生成记录 & 组合备注
                                </h3>
                                {history.length > 0 && (
                                    <button
                                        onClick={clearHistory}
                                        className="text-xs text-stone-400 hover:text-stone-600 transition-colors font-bold"
                                    >
                                        清空全部
                                    </button>
                                )}
                            </div>

                            {/* 结果内容（可滚动） */}
                            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                                {history.length > 0 ? (
                                    history.map((entry) => (
                                        <div key={entry.id} className="border border-stone-200 rounded overflow-hidden shadow-sm bg-white flex flex-col pt-2 pb-0">
                                            {/* 操作栏 */}
                                            <div className="px-3 flex justify-between items-center mb-2">
                                                <span className="text-xs text-stone-400 font-mono">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                                                <div className="flex gap-2.5">
                                                    <button onClick={() => exportDmHistoryAsImage(`export-${entry.id}`, `记录卡片-${entry.id.slice(0, 6)}`)} className="text-stone-400 hover:text-sky-600 transition-colors" title="导出为 PNG 小卡片">
                                                        <Image size={15} />
                                                    </button>
                                                    <button onClick={() => exportDmHistoryAsMarkdown(entry)} className="text-stone-400 hover:text-stone-800 transition-colors" title="导出为 Markdown 文本">
                                                        <FileText size={15} />
                                                    </button>
                                                    <button onClick={() => removeHistoryEntry(entry.id)} className="text-stone-400 hover:text-red-500 transition-colors" title="删除当前记录">
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* 可导出部分 */}
                                            <div id={`export-${entry.id}`} className="bg-white px-3 pb-3 flex flex-col gap-3">
                                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                                    {entry.results.map((res, rIdx) => (
                                                        <div key={rIdx} className="border border-stone-200 rounded overflow-hidden shadow-sm bg-white flex flex-col">
                                                            <div className="bg-stone-50 px-3 py-1.5 font-bold font-serif text-stone-700 text-xs border-b border-stone-200">
                                                                {res.tableName}
                                                            </div>
                                                            <ul className="divide-y divide-stone-100 text-sm flex-grow">
                                                                {res.rolled.map((item, iIdx) => (
                                                                    <li key={iIdx} className="px-3 py-1.5 flex items-start gap-2">
                                                                        <span className="text-stone-300 font-mono text-[10px] font-bold w-4 shrink-0 pt-0.5">{iIdx + 1}.</span>
                                                                        <span className="text-stone-800 font-serif leading-snug">{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* 备注区 */}
                                                <div className="flex flex-col gap-1 mt-1 border border-amber-200 bg-amber-50 rounded p-3">
                                                    <label className="text-xs font-bold text-amber-900 font-serif flex items-center gap-1 mb-1">
                                                        📝 组合备注与灵感
                                                    </label>
                                                    <textarea
                                                        value={entry.memo}
                                                        onChange={e => updateMemo(entry.id, e.target.value)}
                                                        placeholder="给以上随机生成的结果添加联系，组合成完整的设定..."
                                                        className="w-full bg-transparent border-0 text-sm text-stone-800 placeholder-stone-400 focus:outline-none resize-y min-h-[60px] p-0 font-serif leading-relaxed"
                                                        rows={Math.max(2, entry.memo.split('\n').length)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    /* 空状态 */
                                    <div className="h-full flex flex-col items-center justify-center text-stone-300 gap-3 select-none">
                                        <Dices size={48} strokeWidth={1} />
                                        <p className="font-serif text-sm">在左侧选择随机表，点击「摇骰生成」</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'browser' ? (
                    <div className="p-6">
                        <DmTableBrowser tableGroups={TABLES_GROUPS} allTables={ALL_TABLES} />
                    </div>
                ) : (
                    /* ── 危险参考 ── */
                    <div className="p-6">
                        <p className="text-sm text-stone-500 italic mb-5">以下规则适用于在探险中遭遇的各类自然与环境危险。</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                            {/* 火焰 */}
                            <div className="bg-red-50 border border-red-200 rounded p-4">
                                <h4 className="font-bold text-base mb-2 text-red-900 flex items-center gap-2">
                                    <AlertTriangle size={15} className="text-red-600" /> 火焰 (Fire)
                                </h4>
                                <ul className="text-sm space-y-1.5 text-stone-700">
                                    <li><span className="font-bold">火焰：</span>每轮 <span className="font-bold text-red-700">1d6</span> 点直接伤害。</li>
                                    <li><span className="font-bold">着火：</span>每轮 <span className="font-bold text-red-700">2d6</span> 点直接伤害。</li>
                                    <li><span className="font-bold">浸入熔岩：</span><span className="font-bold text-red-900">立即死亡</span>。</li>
                                </ul>
                            </div>

                            {/* 溺水 */}
                            <div className="bg-blue-50 border border-blue-200 rounded p-4">
                                <h4 className="font-bold text-base mb-2 text-blue-900 flex items-center gap-2">
                                    <AlertTriangle size={15} className="text-blue-600" /> 溺水 (Drowning)
                                </h4>
                                <p className="text-sm text-stone-700 leading-relaxed">
                                    玩家角色可以屏住呼吸 <span className="font-bold">30 秒</span>，体质（CON）每点额外增加 <span className="font-bold">30 秒</span>。此后，他们会<span className="font-bold">昏迷</span>，并且每轮都必须通过一次<span className="font-bold">体质检定</span>，否则<span className="font-bold text-red-700">死亡</span>。
                                </p>
                            </div>

                            {/* 冰冻 */}
                            <div className="bg-sky-50 border border-sky-200 rounded p-4">
                                <h4 className="font-bold text-base mb-2 text-sky-900 flex items-center gap-2">
                                    <AlertTriangle size={15} className="text-sky-600" /> 冰冻 (Freezing)
                                </h4>
                                <p className="text-sm text-stone-700 leading-relaxed">
                                    每 <span className="font-bold">10 分钟回合</span>受到 <span className="font-bold text-sky-700">1 点</span>直接伤害，除非玩家角色通过一次<span className="font-bold">体质检定</span>。
                                </p>
                            </div>

                            {/* 闪电 */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                                <h4 className="font-bold text-base mb-2 text-yellow-900 flex items-center gap-2">
                                    <AlertTriangle size={15} className="text-yellow-600" /> 闪电 (Lightning)
                                </h4>
                                <p className="text-sm text-stone-700 leading-relaxed">
                                    <span className="font-bold text-yellow-700">3d6</span> 点直接伤害。
                                </p>
                            </div>

                            {/* 坠落 */}
                            <div className="bg-stone-50 border border-stone-300 rounded p-4">
                                <h4 className="font-bold text-base mb-2 text-stone-900 flex items-center gap-2">
                                    <AlertTriangle size={15} className="text-stone-600" /> 坠落 (Falling)
                                </h4>
                                <p className="text-sm text-stone-700 leading-relaxed">
                                    每坠落 <span className="font-bold">10 英尺</span>受到 <span className="font-bold text-stone-700">1d6</span> 点直接伤害。如果至少有<span className="font-bold">三个骰子掷出 6</span>，则玩家角色<span className="font-bold text-red-700">立即死亡</span>。
                                </p>
                            </div>

                            {/* 干渴 */}
                            <div className="bg-amber-50 border border-amber-200 rounded p-4">
                                <h4 className="font-bold text-base mb-2 text-amber-900 flex items-center gap-2">
                                    <AlertTriangle size={15} className="text-amber-600" /> 干渴 (Thirst)
                                </h4>
                                <p className="text-sm text-stone-700 leading-relaxed">
                                    每天没有饮水，所有检定都会受到 <span className="font-bold text-red-700">-5 的罚值</span>。三天后，每天必须通过一次<span className="font-bold">体质检定</span>，否则<span className="font-bold text-red-700">死亡</span>。除非身处非常干旱的环境，否则假定玩家角色在旅行时能找到饮用水。
                                </p>
                            </div>

                            {/* 睡眠剥夺 */}
                            <div className="bg-indigo-50 border border-indigo-200 rounded p-4">
                                <h4 className="font-bold text-base mb-2 text-indigo-900 flex items-center gap-2">
                                    <AlertTriangle size={15} className="text-indigo-600" /> 睡眠剥夺 (Sleep Deprivation)
                                </h4>
                                <p className="text-sm text-stone-700 leading-relaxed">
                                    每缺乏一天睡眠，所有检定都会受到 <span className="font-bold text-red-700">-5 的罚值</span>。两天后，每个<span className="font-bold">值夜班次</span>都要进行一次<span className="font-bold">感知检定</span>，否则会<span className="font-bold">昏睡三个值夜班次</span>。
                                </p>
                            </div>

                            {/* 醉酒 */}
                            <div className="bg-rose-50 border border-rose-200 rounded p-4">
                                <h4 className="font-bold text-base mb-2 text-rose-900 flex items-center gap-2">
                                    <AlertTriangle size={15} className="text-rose-600" /> 醉酒 (Intoxication)
                                </h4>
                                <p className="text-sm text-stone-700 leading-relaxed">
                                    玩家角色每饮酒一小时，便进行一次<span className="font-bold">体质检定</span>。如果失败，他们会醉酒，并且所有检定在第二天之前都会受到 <span className="font-bold text-red-700">-5 的罚值</span>。如果一个生物连续两小时未能通过体质检定，他们会<span className="font-bold">昏睡两个值夜班次（8 小时）</span>。
                                </p>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DmTablesBlock;
