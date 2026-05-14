import { toPng } from 'html-to-image';
import { HistoryEntry } from '../components/dm/dmTypes';

export const exportDmHistoryAsImage = async (elementId: string, title: string) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    try {
        const dataUrl = await toPng(el, { backgroundColor: '#ffffff', pixelRatio: 2 });
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${title}.png`;
        a.click();
    } catch (err) {
        console.error('Export PNG failed', err);
    }
};

export const exportDmHistoryAsMarkdown = (entry: HistoryEntry) => {
    let md = `# 随机生成记录 (${new Date(entry.timestamp).toLocaleString()})\n\n`;
    entry.results.forEach(res => {
        md += `## ${res.tableName}\n`;
        res.rolled.forEach((item, idx) => md += `${idx + 1}. ${item}\n`);
        md += `\n`;
    });
    if (entry.memo.trim()) {
        md += `## 备注与组合\n\n${entry.memo}\n`;
    }
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `生成记录-${entry.id.slice(0, 6)}.md`;
    a.click();
    URL.revokeObjectURL(url);
};
