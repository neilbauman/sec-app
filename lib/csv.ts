import Papa from 'papaparse';

export function parseCSV(text: string) {
  return Papa.parse(text, { header: true }).data as any[];
}

export function toCSV(data: any[]) {
  return Papa.unparse(data);
}
