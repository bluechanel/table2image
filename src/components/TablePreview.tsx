'use client';

import { themes } from '@/themes/themes';

interface TablePreviewProps {
  tableData: {
    headers: string[];
    rows: string[][];
  } | null;
  theme: string;
  width?: number;
  highlightHeaderRow?: boolean;
  highlightHeaderColumn?: boolean;
}



export default function TablePreview({ tableData, theme, width, highlightHeaderRow = false, highlightHeaderColumn = false }: TablePreviewProps) {
  if (!tableData) return null;

  return (
    <div className="overflow-x-auto" style={{ width: width ? `${width}px` : 'auto' }}>
      <table className="min-w-full border-collapse" style={{ visibility: 'visible', opacity: 1, position: 'static', border: `1px solid ${themes[theme as keyof typeof themes]?.borderColor}` }}>
        <thead>
          <tr style={{ 
  backgroundColor: highlightHeaderRow ? 
    themes[theme as keyof typeof themes]?.headerRowBg : 
    themes[theme as keyof typeof themes]?.rowBg 
}}>
            {tableData.headers.map((header, index) => (
              <th key={index} className="border px-4 py-2" 
              style={{
                borderColor: themes[theme as keyof typeof themes]?.borderColor,
                color: themes[theme as keyof typeof themes]?.textColor
              }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex} style={highlightHeaderColumn && rowIndex === 0 ? { backgroundColor: themes[theme as keyof typeof themes]?.headerColumnBg } : {}}>
              {row.map((cell, cellIndex) => (
                <td 
                key={cellIndex} 
                className="px-4 py-2 border"
                style={{
                  borderColor: themes[theme as keyof typeof themes]?.borderColor,
                  color: themes[theme as keyof typeof themes]?.textColor,
                  backgroundColor: 
                    highlightHeaderColumn && cellIndex === 0 ?
                      themes[theme as keyof typeof themes]?.headerColumnBg :
                      themes[theme as keyof typeof themes]?.rowBg
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}