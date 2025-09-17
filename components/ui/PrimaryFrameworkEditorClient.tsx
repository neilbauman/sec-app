"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FrameworkItem } from "@/types";

export default function PrimaryFrameworkEditorClient() {
  const [items, setItems] = useState<FrameworkItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/frameworks/primary");
      const data = await res.json();
      setItems(data);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Bulk actions placeholder */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Bulk Actions</h2>
      </div>

      {/* Framework table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[15%]">Type / Ref Code</TableHead>
              <TableHead className="w-[55%]">Name / Description</TableHead>
              <TableHead className="w-[15%] text-center">Sort Order</TableHead>
              <TableHead className="w-[15%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {item.type}
                  </span>{" "}
                  {item.ref_code}
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </TableCell>
                <TableCell className="text-center">{item.sort_order}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="icon" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
