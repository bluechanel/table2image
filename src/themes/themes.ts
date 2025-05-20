export interface Theme {
  name: string;
  borderColor: string;
  rowBg: string;
  textColor: string;
  headerRowBg: string, // 表头行背景颜色
  headerColumnBg: string // 表头列背景颜色
}

export interface Themes {
  [key: string]: Theme;
}

export const themes: Themes = {
  default: {
    name: 'default',
    borderColor: '#e5e7eb',
    rowBg: '#ffffff',
    textColor: '#111827',
    headerRowBg: '#f3f4f6',
    headerColumnBg: '#f3f4f6'
  },
  blue: {
    name: 'blue',
    borderColor: '#93c5fd',
    rowBg: '#eff6ff',
    textColor: '#1e40af',
    headerRowBg: '#3b82f6',
    headerColumnBg: '#3b82f6'
  },
  turquoise: {
    name: 'turquoise',
    borderColor: '#67e8f9',
    rowBg: '#ecfeff',
    textColor: '#164e63',
    headerRowBg: '#06b6d4',
    headerColumnBg: '#06b6d4'
  },
  kleinBlue: {
    name: 'kleinBlue',
    borderColor: '#4B61D1',  // 柔和的边框蓝
    rowBg: '#002FA7',       // 极浅的背景蓝
    textColor: '#FFFFFF',   // 经典克莱因蓝色调
    headerRowBg: '#000080', // 国际克莱因蓝
    headerColumnBg: '#000080'
  },
  green: {
    name: 'green',
    borderColor: '#86efac',
    rowBg: '#f0fdf4',
    textColor: '#166534',
    headerRowBg: '#22c55e',
    headerColumnBg: '#22c55e'
  },
  red: {
    name: 'red',
    borderColor: '#fca5a5',
    rowBg: '#fef2f2',
    textColor: '#991b1b',
    headerRowBg: '#ef4444',
    headerColumnBg: '#ef4444'
  },
  pink: {
    name: 'pink',
    borderColor: '#f9a8d4',
    rowBg: '#fdf2f8',
    textColor: '#9d174d',
    headerRowBg: '#ec4899',
    headerColumnBg: '#ec4899'
  },
  yellow: {
    name: 'yellow',
    borderColor: '#fde047',
    rowBg: '#fefce8',
    textColor: '#854d0e',
    headerRowBg: '#eab308',
    headerColumnBg: '#eab308'
  },
  dark: {
    name: 'dark',
    borderColor: '#374151',
    rowBg: '#1f2937',
    textColor: '#f3f4f6',
    headerRowBg: '#111827',
    headerColumnBg: '#111827'
  }
};