'use client';

import { useState } from 'react';
import { toPng } from 'html-to-image';
import { themes } from '@/themes/themes';
import { useTranslations } from 'next-intl';

interface TableExporterProps {
  tableRef: React.RefObject<HTMLDivElement>;
  theme: string;
  onThemeChange: (theme: string) => void;
  width: number;
  onWidthChange: (width: number) => void;
  highlightHeaderRow?: boolean;
  onHighlightHeaderRow: (highlightHeaderRow: boolean) => void;
  highlightHeaderColumn?: boolean;
  onHighlightHeaderColumn: (highlightHeaderColumn: boolean) => void;
}

export default function TableExporter({ tableRef, theme, onThemeChange, width, onWidthChange, onHighlightHeaderRow, highlightHeaderRow, onHighlightHeaderColumn, highlightHeaderColumn }: TableExporterProps) {
  const [isExporting, setIsExporting] = useState(false);

  
  const handleExport = async () => {
    if (!tableRef.current || isExporting) return;

    setIsExporting(true);
    try {
      console.log('开始导出图片流程');
      console.log('表格容器元素:', tableRef.current);
      const scale = window.devicePixelRatio;
      console.log('设备像素比:', scale);
      
      // 找到表格元素
      const tableElement = tableRef.current.querySelector('table');
      if (!tableElement) {
        console.error('未找到表格元素');
        return;
      }
      console.log('找到表格元素:', tableElement);
      console.log('表格内容:', tableElement.innerHTML);

      // 创建临时容器以优化导出
      const container = document.createElement('div');
      container.style.width = `${width}px`;
      container.style.height = 'auto';
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.backgroundColor = '#ffffff';
      console.log('创建临时容器:', container);
      document.body.appendChild(container);

      // 克隆表格元素及其所有子节点
      const clone = tableElement.cloneNode(true) as HTMLElement;
      // 复制所有计算后的样式
      const computedStyles = window.getComputedStyle(tableElement);
      Array.from(computedStyles).forEach(prop => {
        const value = computedStyles.getPropertyValue(prop);
        if (value) {
          clone.style.setProperty(prop, value);
        }
      });

      // 递归复制所有子元素的计算样式
      const copyComputedStyles = (source: Element, target: Element) => {
        const sourceStyles = window.getComputedStyle(source);
        const targetElement = target as HTMLElement;
        Array.from(sourceStyles).forEach(prop => {
          const value = sourceStyles.getPropertyValue(prop);
          if (value) {
            targetElement.style.setProperty(prop, value);
          }
        });
      };

      // 对所有单元格应用计算样式
      const sourceCells = tableElement.querySelectorAll('th, td');
      const targetCells = clone.querySelectorAll('th, td');
      sourceCells.forEach((cell, index) => {
        if (targetCells[index]) {
          copyComputedStyles(cell, targetCells[index]);
        }
      });
      
      // 应用主题样式
      const selectedTheme = themes[theme as keyof typeof themes];
      const rows = clone.querySelectorAll('tr');
      rows.forEach((row) => {
        const cells = row.querySelectorAll('th, td');
        cells.forEach((cell, cellIndex) => {
          const cellElement = cell as HTMLElement;
          cellElement.style.borderColor = selectedTheme.borderColor;
          cellElement.style.color = selectedTheme.textColor;

          // 设置背景色
          if (cell.tagName === 'TH' && highlightHeaderRow) {
            cellElement.style.backgroundColor = selectedTheme.headerRowBg;
          } else if (cellIndex === 0 && highlightHeaderColumn) {
            cellElement.style.backgroundColor = selectedTheme.headerColumnBg;
          } else {
            cellElement.style.backgroundColor = selectedTheme.rowBg;
          }
        });
      });
      clone.style.width = `${width}px`;
      clone.style.borderCollapse = 'collapse';
      clone.style.visibility = 'visible';
      clone.style.opacity = '1';
      clone.style.position = 'static';
      clone.style.display = 'table';
      clone.style.overflow = 'visible';
      clone.style.border = `1px solid ${selectedTheme.borderColor}`;
      console.log('克隆后的表格元素:', clone);
      console.log('克隆表格内容:', clone.innerHTML);
      console.log('克隆表格样式:', clone.style);
      container.appendChild(clone);

      // 等待内容加载
      console.log('等待500ms让内容加载...');
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('开始使用html-to-image渲染');
      const dataUrl = await toPng(clone, {
        backgroundColor: '#ffffff',
        pixelRatio: scale
      });
      console.log('html-to-image渲染完成');

      // 清理临时容器
      document.body.removeChild(container);

      // 创建下载链接
      const link = document.createElement('a');
      link.download = 'table-export.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('导出图片失败:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const t = useTranslations('tableExporter');
  const tt = useTranslations('themes');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('title')}</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('themeLabel')}
          </label>
          <select
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(themes).map(([key, theme]) => (
              <option key={key} value={key}>
                {tt(theme.name)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('widthLabel')}
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => {
              const newWidth = Number(e.target.value);
              onWidthChange(newWidth);
            }}
            className="w-24 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="100"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="highlightHeaderRow"
              checked={highlightHeaderRow}
              onChange={(e) => onHighlightHeaderRow(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="highlightHeaderRow">{t('headerRowLabel')}</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="highlightHeaderColumn"
              checked={highlightHeaderColumn}
              onChange={(e) => onHighlightHeaderColumn(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="highlightHeaderColumn">{t('headerColumnLabel')}</label>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`px-4 py-1 rounded text-white ${isExporting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}
          >
            {isExporting ? t('exportingButton') : t('exportButton')}
          </button>
        </div>
      </div>
    </div>
  );
}