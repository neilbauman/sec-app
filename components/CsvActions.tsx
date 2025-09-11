import { Upload, Download } from "lucide-react";

export default function CsvActions() {
  return (
    <div className="flex space-x-2">
      <button className="flex items-center px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
        <Upload size={16} className="mr-1" /> Upload CSV
      </button>
      <button className="flex items-center px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
        <Download size={16} className="mr-1" /> Download CSV
      </button>
    </div>
  );
}
