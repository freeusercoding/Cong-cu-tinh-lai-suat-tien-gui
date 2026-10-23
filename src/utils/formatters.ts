/**
 * Format number into Vietnamese Currency (VND)
 */
export function formatVND(value: number, includeUnit: boolean = true): string {
  if (isNaN(value)) return '0' + (includeUnit ? ' VND' : '');
  const rounded = Math.round(value);
  const formatted = rounded.toLocaleString('vi-VN');
  return includeUnit ? `${formatted} VND` : formatted;
}

/**
 * Short human readable representation in Vietnamese
 * e.g. 1.500.000.000 -> 1,5 tỷ, 50.000.000 -> 50 triệu
 */
export function formatVNDShort(value: number): string {
  if (value >= 1_000_000_000) {
    const billion = value / 1_000_000_000;
    return `${billion % 1 === 0 ? billion : billion.toFixed(2)} tỷ`;
  }
  if (value >= 1_000_000) {
    const million = value / 1_000_000;
    return `${million % 1 === 0 ? million : million.toFixed(1)} triệu`;
  }
  if (value >= 1_000) {
    const thousand = value / 1_000;
    return `${thousand % 1 === 0 ? thousand : thousand.toFixed(0)} nghìn`;
  }
  return `${value.toLocaleString('vi-VN')} đ`;
}

/**
 * Format percentage rate e.g. 5.5% / năm
 */
export function formatPercent(value: number, decimals: number = 2): string {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format Date to dd/mm/yyyy
 */
export function formatDateVN(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format Date to ISO string YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse input string containing digits and dots/commas into a clean number
 */
export function parseNumberInput(value: string): number {
  if (!value) return 0;
  // Remove all non-digits
  const clean = value.replace(/[^0-9]/g, '');
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Convert number to Vietnamese text (Đọc số tiền bằng chữ)
 * Standard in banking contracts and deposit certificates
 */
export function numberToVietnameseWords(amount: number): string {
  if (amount === 0) return 'Không đồng';
  if (amount < 0) return 'Số tiền âm';

  const defaultNumbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];

  function readThreeDigits(n: number, showZeroHundred: boolean): string {
    const hundred = Math.floor(n / 100);
    const ten = Math.floor((n % 100) / 10);
    const unit = n % 10;
    let res = '';

    if (hundred > 0 || showZeroHundred) {
      res += `${defaultNumbers[hundred]} trăm `;
    }

    if (ten > 1) {
      res += `${defaultNumbers[ten]} mươi `;
      if (unit === 1) res += 'mốt ';
      else if (unit === 5) res += 'lăm ';
      else if (unit > 0) res += `${defaultNumbers[unit]} `;
    } else if (ten === 1) {
      res += 'mười ';
      if (unit === 5) res += 'lăm ';
      else if (unit > 0) res += `${defaultNumbers[unit]} `;
    } else if (unit > 0) {
      if (hundred > 0 || showZeroHundred) res += 'lẻ ';
      res += `${defaultNumbers[unit]} `;
    }

    return res.trim();
  }

  let num = Math.floor(amount);
  const groups: number[] = [];
  while (num > 0) {
    groups.push(num % 1000);
    num = Math.floor(num / 1000);
  }

  let textResult = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const grp = groups[i];
    if (grp > 0) {
      const showZero = i < groups.length - 1;
      const readGrp = readThreeDigits(grp, showZero);
      textResult += `${readGrp} ${units[i]} `;
    }
  }

  textResult = textResult.trim() + ' đồng';
  // Capitalize first letter
  return textResult.charAt(0).toUpperCase() + textResult.slice(1);
}
