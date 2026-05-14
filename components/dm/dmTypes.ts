export interface TableEntry {
    id: string;
    name: string;
    items: string[];
}

export interface TableGroup {
    groupId: string;
    groupName: string;
    tables: TableEntry[];
}

export interface RollRequest {
    id: string;
    tableId: string;
    count: number;
}

export interface RollResult {
    tableId?: string;
    tableName: string;
    dice?: string;
    rolls?: number[];
    rolled: string[];
}

export interface HistoryEntry {
    id: string;
    timestamp: number;
    results: RollResult[];
    memo: string;
}
