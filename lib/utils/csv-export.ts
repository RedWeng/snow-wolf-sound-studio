/**
 * CSV Export Utility
 * 
 * Helper functions for exporting data to CSV format
 */

export interface CSVExportOptions {
  filename: string;
  headers: string[];
  rows: (string | number)[][];
  addTimestamp?: boolean;
}

/**
 * Export data to CSV file
 * Handles UTF-8 encoding with BOM for Excel compatibility
 */
export function exportToCSV(options: CSVExportOptions): void {
  const { filename, headers, rows, addTimestamp = true } = options;

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes
        const cellStr = String(cell).replace(/"/g, '""');
        return `"${cellStr}"`;
      }).join(',')
    )
  ].join('\n');

  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Generate filename with optional timestamp
  const timestamp = addTimestamp ? `_${new Date().toISOString().split('T')[0]}` : '';
  const finalFilename = `${filename}${timestamp}.csv`;

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Format date for CSV export
 */
export function formatDateForCSV(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Escape special characters for CSV
 */
export function escapeCSVCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // If contains comma, quote, or newline, wrap in quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
