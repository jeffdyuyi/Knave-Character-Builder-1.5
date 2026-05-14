import { DmDice, DmTableEntry } from '../data/dmTables.registry';
import { HistoryEntry, RollRequest, RollResult, TableEntry } from '../components/dm/dmTypes';
import { secureRandom } from '../utils';

export interface DmSingleRoll {
    result: string;
    roll?: number;
}

const rollDie = (sides: number) => Math.floor(secureRandom() * sides) + 1;

const parseLeadingRoll = (item: string): number | null => {
    const match = item.match(/^\s*(\d+)/);
    return match ? Number(match[1]) : null;
};

const rollByIndex = (table: TableEntry, sides: number): DmSingleRoll => {
    const roll = rollDie(sides);
    const result = table.items[roll - 1] ?? table.items[Math.floor(secureRandom() * table.items.length)];
    return { result, roll };
};

const roll2d6 = (table: TableEntry): DmSingleRoll => {
    const roll = rollDie(6) + rollDie(6);
    const result = table.items.find(item => parseLeadingRoll(item) === roll)
        ?? table.items[Math.floor(secureRandom() * table.items.length)];
    return { result, roll };
};

export const rollDmTable = (table: TableEntry, dice: DmDice = 'pick'): DmSingleRoll => {
    switch (dice) {
        case 'd6':
            return rollByIndex(table, 6);
        case '2d6':
            return roll2d6(table);
        case 'd12':
            return rollByIndex(table, 12);
        case 'd20':
            return rollByIndex(table, 20);
        case 'd100':
            return rollByIndex(table, 100);
        case 'pick':
        default:
            return {
                result: table.items[Math.floor(secureRandom() * table.items.length)],
            };
    }
};

export const rollDmTableItem = (table: TableEntry, dice: DmDice = 'pick'): string => {
    return rollDmTable(table, dice).result;
};

export const rollDmTableMany = (table: TableEntry, count: number, dice: DmDice = 'pick'): DmSingleRoll[] => {
    const rolls: DmSingleRoll[] = [];
    for (let i = 0; i < count; i++) {
        rolls.push(rollDmTable(table, dice));
    }
    return rolls;
};

export const rollDmRequests = (
    requests: RollRequest[],
    tables: DmTableEntry[]
): HistoryEntry => {
    const results: RollResult[] = [];

    requests.forEach(req => {
        const table = tables.find(t => t.id === req.tableId);
        if (table) {
            const rolls = rollDmTableMany(table, req.count, table.dice);
            results.push({
                tableId: table.id,
                tableName: table.name,
                dice: table.dice,
                rolls: rolls.map(roll => roll.roll).filter((roll): roll is number => roll !== undefined),
                rolled: rolls.map(roll => roll.result),
            });
        }
    });

    return {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        results,
        memo: '',
    };
};
