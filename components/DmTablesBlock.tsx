import React, { useState } from 'react';
import { TRAIT_TABLES, CAREERS, DUNGEONEERING_GEAR, GENERAL_GEAR_1, GENERAL_GEAR_2, SPELLS_DATA, NPC_IDENTITIES, TRAVEL_HAZARDS, WEATHER_CONDITIONS_2D6, TRAVEL_EVENTS, ENVIRONMENT_SIGNS, ENVIRONMENT_LOCATIONS, ENVIRONMENT_STRUCTURES, LOCATION_TRAITS, EXPLORATION_EVENTS, DUNGEON_ROOMS, ROOM_DETAILS, ROOM_THEMES, DUNGEON_TYPES, TRAP_EFFECTS, HAZARDS, ACTIVITIES, NPC_REACTIONS_2D6, MECHANISMS, SPELL_FORMULAS, WIZARD_NAMES, SPELL_QUALITIES, SPELL_EFFECTS, SPELL_ELEMENTS, SPELL_FORMS, MAGIC_SCHOOLS, DOMAINS, POTIONS, SYMBOLS, TEXTURES, TASTES, COLORS, INGREDIENTS, TOOLS, MISCELLANEOUS, BOOKS, CLOTHING, FABRICS, DECORATIONS, TREASURES, MATERIALS, ITEM_TRAITS, WEAPONS, CITY_THEMES, CITY_EVENTS, STREET_DETAILS, BUILDINGS, INN_NAMES_1, INN_NAMES_2, FOOD_TRAITS, FOODS } from '../data';
import { Dices, Plus, Trash2, Settings, List } from 'lucide-react';
import { secureRandom } from '../utils';

// Registry of all random tables
const TABLES_REGISTRY = [
    { id: 'npc_ident', name: 'NPC 社会身份 (d100)', items: NPC_IDENTITIES },
    { id: 'npc_reactions', name: 'NPC 反应与初始态度 (2d6)', items: NPC_REACTIONS_2D6 },
    { id: 'activities', name: '活动与行为状态 (d100)', items: ACTIVITIES },
    { id: 'spell_formulas', name: '法术命名公式 (d12)', items: SPELL_FORMULAS },
    { id: 'wizard_names', name: '巫师名讳 (d100)', items: WIZARD_NAMES },
    { id: 'spell_qualities', name: '法术品质/修饰词 (d100)', items: SPELL_QUALITIES },
    { id: 'potions', name: '炼金药水效果 (d100)', items: POTIONS },
    { id: 'tools', name: '工具/冒险实用品 (d100)', items: TOOLS },
    { id: 'miscellaneous', name: '杂项物品/风味小件 (d100)', items: MISCELLANEOUS },
    { id: 'treasures', name: '宝藏/高价值战利品 (d100)', items: TREASURES },
    { id: 'materials', name: '贵重材料/原石宝石 (d100)', items: MATERIALS },
    { id: 'item_traits', name: '物品特性/异常状态 (d100)', items: ITEM_TRAITS },
    { id: 'weapons', name: '冷兵器/远程武器 (d100)', items: WEAPONS },
    { id: 'city_themes', name: '城市主题/城镇特色 (d100)', items: CITY_THEMES },
    { id: 'city_events', name: '城市事件/大事件 (d100)', items: CITY_EVENTS },
    { id: 'street_details', name: '街道细节/街景风貌 (d100)', items: STREET_DETAILS },
    { id: 'buildings', name: '建筑物/设施商铺 (d100)', items: BUILDINGS },
    { id: 'inn_names_1', name: '旅店名称(前缀/形容词) (d100)', items: INN_NAMES_1 },
    { id: 'inn_names_2', name: '旅店名称(名词/生物) (d100)', items: INN_NAMES_2 },
    { id: 'food_traits', name: '食物特性/烹饪方法 (d100)', items: FOOD_TRAITS },
    { id: 'foods', name: '食物食材/具体菜肴 (d100)', items: FOODS },
    { id: 'books', name: '书籍文献/阅读主题 (d100)', items: BOOKS },
    { id: 'clothing', name: '衣物款式/护甲部件 (d100)', items: CLOTHING },
    { id: 'fabrics', name: '布料/物品材质 (d100)', items: FABRICS },
    { id: 'decorations', name: '修饰与风格外观 (d100)', items: DECORATIONS },
    { id: 'symbols', name: '符号/徽章与印记 (d100)', items: SYMBOLS },
    { id: 'textures', name: '质感与触感 (d100)', items: TEXTURES },
    { id: 'tastes', name: '味觉与味道 (d100)', items: TASTES },
    { id: 'colors', name: '颜色与色调 (d100)', items: COLORS },
    { id: 'ingredients', name: '仪式魔法/炼金原料 (d100)', items: INGREDIENTS },
    { id: 'spell_effects', name: '法术效果/动词 (d100)', items: SPELL_EFFECTS },
    { id: 'spell_elements', name: '法术元素/基础 (d100)', items: SPELL_ELEMENTS },
    { id: 'spell_forms', name: '法术形态/表现 (d100)', items: SPELL_FORMS },
    { id: 'magic_schools', name: '魔法学派/体系 (d100)', items: MAGIC_SCHOOLS },
    { id: 'domains', name: '神祇/魔法领域 (d100)', items: DOMAINS },
    { id: 'env_signs', name: '环境危险迹象/前兆 (d100)', items: ENVIRONMENT_SIGNS },
    { id: 'env_locations', name: '自然地貌与地点 (d100)', items: ENVIRONMENT_LOCATIONS },
    { id: 'env_structures', name: '人造构筑与废墟 (d100)', items: ENVIRONMENT_STRUCTURES },
    { id: 'dungeon_types', name: '地下城类别与性质 (d100)', items: DUNGEON_TYPES },
    { id: 'loc_traits', name: '地点特性与氛围 (d100)', items: LOCATION_TRAITS },
    { id: 'explore_events', name: '地下城探索变动 (d100)', items: EXPLORATION_EVENTS },
    { id: 'dungeon_rooms', name: '房间分区 (d100)', items: DUNGEON_ROOMS },
    { id: 'room_themes', name: '房间主题与氛围 (d100)', items: ROOM_THEMES },
    { id: 'room_details', name: '房间细节与物件 (d100)', items: ROOM_DETAILS },
    { id: 'mechanisms', name: '机械装置与部件 (d100)', items: MECHANISMS },
    { id: 'trap_effects', name: '陷阱效果 (d100)', items: TRAP_EFFECTS },
    { id: 'hazards', name: '环境与陷阱危险物 (d100)', items: HAZARDS },
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
                    rolledItems.push(table.items[Math.floor(secureRandom() * table.items.length)]);
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
