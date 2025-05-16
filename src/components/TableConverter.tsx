'use client';

import { useState, useRef, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

interface TableData {
  headers: string[];
  rows: string[][];
}

interface TableConverterProps {
  onTableDataChange: (data: TableData | null) => void;
}

export default function TableConverter({ onTableDataChange }: TableConverterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasteContent, setPasteContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file || (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls'))) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

      if (jsonData.length > 0) {
        const newTableData = {
          headers: jsonData[0],
          rows: jsonData.slice(1)
        };
        onTableDataChange(newTableData);
      } else {
        onTableDataChange(null);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    handleFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

      if (jsonData.length > 0) {
        const newTableData = {
          headers: jsonData[0],
          rows: jsonData.slice(1)
        };
        onTableDataChange(newTableData);
      } else {
        onTableDataChange(null);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handlePaste = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    setPasteContent(content);

    // 解析Markdown表格
    const lines = content.trim().split('\n');
    if (lines.length >= 2) {
      const headers = lines[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
      const rows = lines.slice(2).map(line =>
        line.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
      );

      const newTableData = {
        headers,
        rows
      };
      onTableDataChange(newTableData);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">数据输入</h2>
      <div className="space-y-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            上传Excel文件
          </button>
          <p className="mt-2 text-sm text-gray-500">支持.xlsx和.xls格式，可拖拽文件到此处</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            或粘贴Markdown表格
          </label>
          <textarea
            value={pasteContent}
            onChange={handlePaste}
            className="w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="粘贴Markdown格式的表格内容..."
          />
        </div>

      </div>
    </div>
  );
}