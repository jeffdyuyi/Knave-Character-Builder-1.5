import { TRAIT_TABLES, CAREERS, DUNGEONEERING_GEAR, GENERAL_GEAR_1, GENERAL_GEAR_2, SPELLS_DATA, NPC_IDENTITIES, TRAVEL_HAZARDS, WEATHER_CONDITIONS_2D6, TRAVEL_EVENTS, ENVIRONMENT_SIGNS, ENVIRONMENT_LOCATIONS, ENVIRONMENT_STRUCTURES, LOCATION_TRAITS, EXPLORATION_EVENTS, DUNGEON_ROOMS, ROOM_DETAILS, ROOM_THEMES, DUNGEON_TYPES, TRAP_EFFECTS, HAZARDS, ACTIVITIES, NPC_REACTIONS_2D6, MECHANISMS, SPELL_FORMULAS, WIZARD_NAMES, SPELL_QUALITIES, SPELL_EFFECTS, SPELL_ELEMENTS, SPELL_FORMS, MAGIC_SCHOOLS, DOMAINS, POTIONS, SYMBOLS, TEXTURES, TASTES, COLORS, INGREDIENTS, TOOLS, MISCELLANEOUS, BOOKS, CLOTHING, FABRICS, DECORATIONS, TREASURES, MATERIALS, ITEM_TRAITS, WEAPONS, CITY_THEMES, CITY_EVENTS, STREET_DETAILS, BUILDINGS, INN_NAMES_1, INN_NAMES_2, FOOD_TRAITS, FOODS, FACTIONS, FACTION_TRAITS, MISSIONS, REWARDS, ARCHETYPES, PERSONALITIES, NPC_DETAILS, GOALS, ADVANTAGES, DISADVANTAGES, RELATIONSHIPS, MANNERISMS, MONSTERS, ANIMALS, MONSTER_TRAITS, MONSTER_FEATURES, MONSTER_ABILITIES, MONSTER_TACTICS, MONSTER_WEAKNESSES, MALE_NAMES, FEMALE_NAMES, SURNAMES_1, SURNAMES_2, CAROUSING_MISHAPS } from './index';

export type DmDice = 'd6' | '2d6' | 'd12' | 'd20' | 'd100' | 'pick';

export interface DmTableSourceEntry {
    id: string;
    name: string;
    items: string[];
    tags?: string[];
    description?: string;
}

export interface DmTableGroup {
    groupId: string;
    groupName: string;
    tables: DmTableSourceEntry[];
}

export interface DmTableEntry extends DmTableSourceEntry {
    groupId: string;
    groupName: string;
    dice: DmDice;
}

const inferDiceFromName = (name: string): DmDice => {
    if (name.includes('2d6')) return '2d6';
    if (name.includes('d100')) return 'd100';
    if (name.includes('d20')) return 'd20';
    if (name.includes('d12')) return 'd12';
    if (name.includes('d6')) return 'd6';
    return 'pick';
};

export const TABLES_GROUPS: DmTableGroup[] = [
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


export const ALL_TABLES: DmTableEntry[] = TABLES_GROUPS.flatMap(group =>
    group.tables.map(table => ({
        ...table,
        groupId: group.groupId,
        groupName: group.groupName,
        dice: inferDiceFromName(table.name),
    }))
);

export const getAllDmTables = () => ALL_TABLES;

export const getDmTablesByGroup = (groupId: string) =>
    TABLES_GROUPS.find(group => group.groupId === groupId)?.tables ?? [];

export const findDmTableById = (tableId: string) =>
    ALL_TABLES.find(table => table.id === tableId);

export const searchDmTables = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_TABLES;
    return ALL_TABLES.filter(table =>
        table.name.toLowerCase().includes(q) ||
        table.groupName.toLowerCase().includes(q) ||
        table.tags?.some(tag => tag.toLowerCase().includes(q)) ||
        table.items.some(item => item.toLowerCase().includes(q))
    );
};
