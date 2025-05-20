'use client';

import {useTranslations} from 'next-intl';
import { useRef, useState } from 'react';
import TableConverter from '@/components/TableConverter';
import TableExporter from '@/components/TableExporter';
import TablePreview from '@/components/TablePreview';

 
interface TableData {
    headers: string[];
    rows: string[][];
  }

export default function Home() {
  const t = useTranslations('Home');
  const previewRef = useRef<HTMLDivElement>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [theme, setTheme] = useState('default');
  const [width, setWidth] = useState(800);
  const [highlightHeaderRow, setHighlightHeaderRow] = useState(false);
  const [highlightHeaderColumn, setHighlightHeaderColumn] = useState(false);

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Controls */}
        <div className="md:col-span-1 space-y-6 bg-white p-6 rounded-lg shadow">
          <TableConverter onTableDataChange={setTableData} />
          <hr className="my-6" />
          <TableExporter 
            tableRef={previewRef as React.RefObject<HTMLDivElement>}
            theme={theme}
            onThemeChange={setTheme}
            width={width}
            onWidthChange={setWidth}
            highlightHeaderRow={highlightHeaderRow}
            onHighlightHeaderRow={setHighlightHeaderRow}
            highlightHeaderColumn={highlightHeaderColumn}
            onHighlightHeaderColumn={setHighlightHeaderColumn}
          />
        </div>

        {/* Right Column: Preview */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">{t("preview")}</h2>
          <div ref={previewRef} className="overflow-auto border border-gray-200 rounded">
            <TablePreview tableData={tableData} theme={theme} width={width} highlightHeaderColumn={highlightHeaderColumn} highlightHeaderRow={highlightHeaderRow} />
          </div>
        </div>
      </div>
    </main>
  );
}