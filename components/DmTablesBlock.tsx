import React, { useState, useMemo } from 'react';
import { TRAIT_TABLES, CAREERS, DUNGEONEERING_GEAR, GENERAL_GEAR_1, GENERAL_GEAR_2, SPELLS_DATA, NPC_IDENTITIES, TRAVEL_HAZARDS, WEATHER_CONDITIONS_2D6, TRAVEL_EVENTS, ENVIRONMENT_SIGNS, ENVIRONMENT_LOCATIONS, ENVIRONMENT_STRUCTURES, LOCATION_TRAITS, EXPLORATION_EVENTS, DUNGEON_ROOMS, ROOM_DETAILS, ROOM_THEMES, DUNGEON_TYPES, TRAP_EFFECTS, HAZARDS, ACTIVITIES, NPC_REACTIONS_2D6, MECHANISMS, SPELL_FORMULAS, WIZARD_NAMES, SPELL_QUALITIES, SPELL_EFFECTS, SPELL_ELEMENTS, SPELL_FORMS, MAGIC_SCHOOLS, DOMAINS, POTIONS, SYMBOLS, TEXTURES, TASTES, COLORS, INGREDIENTS, TOOLS, MISCELLANEOUS, BOOKS, CLOTHING, FABRICS, DECORATIONS, TREASURES, MATERIALS, ITEM_TRAITS, WEAPONS, CITY_THEMES, CITY_EVENTS, STREET_DETAILS, BUILDINGS, INN_NAMES_1, INN_NAMES_2, FOOD_TRAITS, FOODS, FACTIONS, FACTION_TRAITS, MISSIONS, REWARDS, ARCHETYPES, PERSONALITIES, NPC_DETAILS, GOALS, ADVANTAGES, DISADVANTAGES, RELATIONSHIPS, MANNERISMS, MONSTERS, ANIMALS, MONSTER_TRAITS, MONSTER_FEATURES, MONSTER_ABILITIES, MONSTER_TACTICS, MONSTER_WEAKNESSES, MALE_NAMES, FEMALE_NAMES, SURNAMES_1, SURNAMES_2, CAROUSING_MISHAPS } from '../data';
import { Dices, Plus, Trash2, Settings, List, Search, BookOpen, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { secureRandom, pick } from '../utils';

// ─── 随机表注册表（带分组） ───────────────────────────────────────────────────

interface TableEntry {
    id: string;
    name: string;
    items: string[];
}

interface TableGroup {
    groupId: string;
    groupName: string;
    tables: TableEntry[];
}

const TABLES_GROUPS: TableGroup[] = [
    {
        groupId: 'char_creation',
        groupName: '建卡随机表',
        tables: [
            ...Object.entries(TRAIT_TABLES).map(([k, v]) => ({ id: `trait_${k}`, name: `特征 - ${k.toUpperCase()} (d20)`, items: v })),
            { id: 'careers', name: '职业/背景 (d100)', items: CAREERS.map(c => c.name) },
            { id: 'dungeon_gear', name: '地城装备 (d20)', items: DUNGEONEERING_GEAR },
            { id: 'general_gear_1', name: '一般装备 I (d20)', items: GENERAL_GEAR_1 },
            { id: 'general_gear_2', name: '一般装备 II (d20)', items: GENERAL_GEAR_2 },
            { id: 'spells', name: '无等级法术 (d100)', items: SPELLS_DATA.map(s => s.name) },
        ],
    },
    {
        groupId: 'npc',
        groupName: 'NPC 生成',
        tables: [
            { id: 'npc_ident', name: 'NPC 社会身份 (d100)', items: NPC_IDENTITIES },
            { id: 'archetypes', name: 'NPC 基础人设 (d100)', items: ARCHETYPES },
            { id: 'personalities', name: 'NPC 性格特征 (d100)', items: PERSONALITIES },
            { id: 'npc_details', name: 'NPC 细节与外观特征 (d100)', items: NPC_DETAILS },
            { id: 'goals', name: 'NPC 的目标/终极追求 (d100)', items: GOALS },
            { id: 'advantages', name: 'NPC 优势长处 (d100)', items: ADVANTAGES },
            { id: 'disadvantages', name: 'NPC 劣势短板 (d100)', items: DISADVANTAGES },
            { id: 'relationships', name: 'NPC 社会关系 (d100)', items: RELATIONSHIPS },
            { id: 'mannerisms', name: 'NPC 言谈举止 (d100)', items: MANNERISMS },
            { id: 'npc_reactions', name: 'NPC 反应与初始态度 (2d6)', items: NPC_REACTIONS_2D6 },
            { id: 'activities', name: '活动与行为状态 (d100)', items: ACTIVITIES },
            { id: 'male_names', name: '男性名字 (d100)', items: MALE_NAMES },
            { id: 'female_names', name: '女性名字 (d100)', items: FEMALE_NAMES },
            { id: 'surnames_1', name: '姓氏前半 (d100)', items: SURNAMES_1 },
            { id: 'surnames_2', name: '姓氏后半 (d100)', items: SURNAMES_2 },
        ],
    },
    {
        groupId: 'factions',
        groupName: '阵营与任务',
        tables: [
            { id: 'factions', name: '阵营/组织势力 (d100)', items: FACTIONS },
            { id: 'faction_traits', name: '阵营特性/行事风格 (d100)', items: FACTION_TRAITS },
            { id: 'missions', name: '剧本任务/委托 (d100)', items: MISSIONS },
            { id: 'rewards', name: '任务奖励/报酬 (d100)', items: REWARDS },
            { id: 'carousing_mishaps', name: '狂欢作乐意外事件 (d20)', items: CAROUSING_MISHAPS },
        ],
    },
    {
        groupId: 'monsters',
        groupName: '怪物与生物',
        tables: [
            { id: 'monsters', name: '怪物与敌对生物 (d100)', items: MONSTERS },
            { id: 'animals', name: '自然界动物 (d100)', items: ANIMALS },
            { id: 'monster_traits', name: '怪物器官/特殊部位 (d100)', items: MONSTER_TRAITS },
            { id: 'monster_features', name: '怪物生理特性/状态 (d100)', items: MONSTER_FEATURES },
            { id: 'monster_abilities', name: '怪物特异功能/能力 (d100)', items: MONSTER_ABILITIES },
            { id: 'monster_tactics', name: '怪物战斗战术 (d100)', items: MONSTER_TACTICS },
            { id: 'monster_weaknesses', name: '怪物的致命弱点 (d100)', items: MONSTER_WEAKNESSES },
        ],
    },
    {
        groupId: 'magic',
        groupName: '魔法与法术',
        tables: [
            { id: 'spell_formulas', name: '法术命名公式 (d12)', items: SPELL_FORMULAS },
            { id: 'wizard_names', name: '巫师名讳 (d100)', items: WIZARD_NAMES },
            { id: 'spell_qualities', name: '法术品质/修饰词 (d100)', items: SPELL_QUALITIES },
            { id: 'spell_effects', name: '法术效果/动词 (d100)', items: SPELL_EFFECTS },
            { id: 'spell_elements', name: '法术元素/基础 (d100)', items: SPELL_ELEMENTS },
            { id: 'spell_forms', name: '法术形态/表现 (d100)', items: SPELL_FORMS },
            { id: 'magic_schools', name: '魔法学派/体系 (d100)', items: MAGIC_SCHOOLS },
            { id: 'domains', name: '神祇/魔法领域 (d100)', items: DOMAINS },
            { id: 'potions', name: '炼金药水效果 (d100)', items: POTIONS },
            { id: 'ingredients', name: '仪式魔法/炼金原料 (d100)', items: INGREDIENTS },
        ],
    },
    {
        groupId: 'items',
        groupName: '物品与宝藏',
        tables: [
            { id: 'tools', name: '工具/冒险实用品 (d100)', items: TOOLS },
            { id: 'miscellaneous', name: '杂项物品/风味小件 (d100)', items: MISCELLANEOUS },
            { id: 'treasures', name: '宝藏/高价值战利品 (d100)', items: TREASURES },
            { id: 'materials', name: '贵重材料/原石宝石 (d100)', items: MATERIALS },
            { id: 'item_traits', name: '物品特性/异常状态 (d100)', items: ITEM_TRAITS },
            { id: 'weapons', name: '冷兵器/远程武器 (d100)', items: WEAPONS },
            { id: 'books', name: '书籍文献/阅读主题 (d100)', items: BOOKS },
            { id: 'clothing', name: '衣物款式/护甲部件 (d100)', items: CLOTHING },
            { id: 'fabrics', name: '布料/物品材质 (d100)', items: FABRICS },
            { id: 'decorations', name: '修饰与风格外观 (d100)', items: DECORATIONS },
        ],
    },
    {
        groupId: 'sensory',
        groupName: '感官与描述',
        tables: [
            { id: 'symbols', name: '符号/徽章与印记 (d100)', items: SYMBOLS },
            { id: 'textures', name: '质感与触感 (d100)', items: TEXTURES },
            { id: 'tastes', name: '味觉与味道 (d100)', items: TASTES },
            { id: 'colors', name: '颜色与色调 (d100)', items: COLORS },
        ],
    },
    {
        groupId: 'city',
        groupName: '城市与社区',
        tables: [
            { id: 'city_themes', name: '城市主题/城镇特色 (d100)', items: CITY_THEMES },
            { id: 'city_events', name: '城市事件/大事件 (d100)', items: CITY_EVENTS },
            { id: 'street_details', name: '街道细节/街景风貌 (d100)', items: STREET_DETAILS },
            { id: 'buildings', name: '建筑物/设施商铺 (d100)', items: BUILDINGS },
            { id: 'inn_names_1', name: '旅店名称(前缀/形容词) (d100)', items: INN_NAMES_1 },
            { id: 'inn_names_2', name: '旅店名称(名词/生物) (d100)', items: INN_NAMES_2 },
            { id: 'food_traits', name: '食物特性/烹饪方法 (d100)', items: FOOD_TRAITS },
            { id: 'foods', name: '食物食材/具体菜肴 (d100)', items: FOODS },
        ],
    },
    {
        groupId: 'world',
        groupName: '野外与旅途',
        tables: [
            { id: 'env_signs', name: '环境危险迹象/前兆 (d100)', items: ENVIRONMENT_SIGNS },
            { id: 'env_locations', name: '自然地貌与地点 (d100)', items: ENVIRONMENT_LOCATIONS },
            { id: 'env_structures', name: '人造构筑与废墟 (d100)', items: ENVIRONMENT_STRUCTURES },
            { id: 'loc_traits', name: '地点特性与氛围 (d100)', items: LOCATION_TRAITS },
            { id: 'travel_hazards', name: '旅行危险 (d6)', items: TRAVEL_HAZARDS },
            { id: 'weather', name: '天气与气候变动 (2d6)', items: WEATHER_CONDITIONS_2D6 },
            { id: 'travel_events', name: '旅行环境变动异象 (d100)', items: TRAVEL_EVENTS },
        ],
    },
    {
        groupId: 'dungeon',
        groupName: '地下城探索',
        tables: [
            { id: 'dungeon_types', name: '地下城类别与性质 (d100)', items: DUNGEON_TYPES },
            { id: 'explore_events', name: '地下城探索变动 (d100)', items: EXPLORATION_EVENTS },
            { id: 'dungeon_rooms', name: '房间分区 (d100)', items: DUNGEON_ROOMS },
            { id: 'room_themes', name: '房间主题与氛围 (d100)', items: ROOM_THEMES },
            { id: 'room_details', name: '房间细节与物件 (d100)', items: ROOM_DETAILS },
            { id: 'mechanisms', name: '机械装置与部件 (d100)', items: MECHANISMS },
            { id: 'trap_effects', name: '陷阱效果 (d100)', items: TRAP_EFFECTS },
            { id: 'hazards', name: '环境与陷阱危险物 (d100)', items: HAZARDS },
        ],
    },
];

// 扁平化所有表格，供摇骰器使用
const ALL_TABLES: TableEntry[] = TABLES_GROUPS.flatMap(g => g.tables);

// ─── 类型定义 ─────────────────────────────────────────────────────────────────

interface RollRequest {
    id: string;
    tableId: string;
    count: number;
}

interface RollResult {
    tableName: string;
    rolled: string[];
}

// ─── 子组件：随机表浏览器 ──────────────────────────────────────────────────────

const TableBrowser: React.FC = () => {
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
        if (!search.trim()) return TABLES_GROUPS;
        const q = search.toLowerCase();
        return TABLES_GROUPS.map(g => ({
            ...g,
            tables: g.tables.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.items.some(item => item.toLowerCase().includes(q))
            ),
        })).filter(g => g.tables.length > 0);
    }, [search]);

    // When searching, auto-expand all groups
    const displayedGroups = useMemo(() => {
        if (search.trim()) {
            return filteredGroups.map(g => ({ ...g, expanded: true }));
        }
        return filteredGroups.map(g => ({ ...g, expanded: expandedGroups.has(g.groupId) }));
    }, [filteredGroups, search, expandedGroups]);

    const handleRoll = (table: TableEntry) => {
        const result = pick(table.items);
        setRollResult({ tableId: table.id, result });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Search bar */}
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

            {/* Roll result banner */}
            {rollResult && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded font-serif text-amber-900 text-sm shadow-sm flex justify-between items-start">
                    <span>🎲 <strong>[{ALL_TABLES.find(t => t.id === rollResult.tableId)?.name}]</strong> → {rollResult.result}</span>
                    <button onClick={() => setRollResult(null)} className="text-amber-400 hover:text-amber-700 ml-3 shrink-0 text-xs">✕</button>
                </div>
            )}

            {/* Groups */}
            {displayedGroups.map(g => (
                <div key={g.groupId} className="border border-stone-200 rounded overflow-hidden">
                    {/* Group header */}
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

                    {/* Tables list */}
                    {g.expanded && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
                            {g.tables.map(table => (
                                <div key={table.id} className="border border-stone-200 rounded overflow-hidden flex flex-col bg-stone-50">
                                    {/* Table header */}
                                    <div className="bg-stone-200 px-3 py-2 flex justify-between items-center border-b border-stone-300">
                                        <span className="font-bold text-xs text-stone-700 leading-tight">{table.name}</span>
                                        <button
                                            onClick={() => handleRoll(table)}
                                            className="shrink-0 ml-2 text-amber-700 hover:text-amber-900 hover:bg-amber-200/50 p-1 rounded transition-colors"
                                            title="随机掷骰"
                                        >
                                            <Dices size={14} />
                                        </button>
                                    </div>
                                    {/* Table items (scrollable) */}
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

// ─── 主组件 ───────────────────────────────────────────────────────────────────

const DmTablesBlock: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'roller' | 'browser' | 'hazards'>('roller');
    const [requests, setRequests] = useState<RollRequest[]>([
        { id: crypto.randomUUID(), tableId: 'npc_ident', count: 1 }
    ]);
    const [results, setResults] = useState<RollResult[] | null>(null);

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
        const newResults: RollResult[] = [];
        requests.forEach(req => {
            const table = ALL_TABLES.find(t => t.id === req.tableId);
            if (table) {
                const rolledItems = [];
                for (let i = 0; i < req.count; i++) {
                    rolledItems.push(table.items[Math.floor(secureRandom() * table.items.length)]);
                }
                newResults.push({ tableName: table.name, rolled: rolledItems });
            }
        });
        setResults(newResults);
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
                        <div className="flex-1 flex flex-col bg-white">
                            {/* 列标题 */}
                            <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-stone-50 shrink-0">
                                <h3 className="font-bold font-serif flex items-center gap-2 text-stone-800">
                                    <List size={16} className="text-amber-700" />
                                    生成结果
                                </h3>
                                {results && (
                                    <button
                                        onClick={() => setResults(null)}
                                        className="text-xs text-stone-400 hover:text-stone-600 transition-colors font-bold"
                                    >
                                        清空
                                    </button>
                                )}
                            </div>

                            {/* 结果内容（可滚动） */}
                            <div className="flex-grow overflow-y-auto p-4">
                                {results ? (
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                        {results.map((res, rIdx) => (
                                            <div key={rIdx} className="border border-stone-200 rounded overflow-hidden shadow-sm bg-white flex flex-col">
                                                <div className="bg-stone-100 px-3 py-2 font-bold font-serif text-stone-700 text-xs border-b border-stone-200">
                                                    {res.tableName}
                                                </div>
                                                <ul className="divide-y divide-stone-100 text-sm flex-grow">
                                                    {res.rolled.map((item, iIdx) => (
                                                        <li key={iIdx} className="px-3 py-2 hover:bg-amber-50 flex items-start gap-2 transition-colors">
                                                            <span className="text-stone-300 font-mono text-[10px] font-bold w-4 shrink-0 pt-0.5">{iIdx + 1}.</span>
                                                            <span className="text-stone-800 font-serif leading-snug">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
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
                        <TableBrowser />
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
