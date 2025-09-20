"use client";

import { X } from "lucide-react";

type DeleteTarget = {
  type: "pillar" | "theme" | "subtheme";
  name: string;
  id: string;
  childrenCount?: number;
};

interface DeleteConfirmProps {
  open: boolean;
  target: DeleteTarget | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirm({
  open,
  target,
  onCancel,
  onConfirm,
}: DeleteConfirmProps) {
  if (!open || !target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onCancel}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-3 text-lg font-semibold text-red-600">
          Confirm Delete
        </h2>

        <p className="text-sm text-gray-700">
          Are you sure you want to delete this{" "}
          <strong className="capitalize">{target.type}</strong>:{" "}
          <em>{target.name}</em>?
        </p>

        {!!target.childrenCount && target.childrenCount > 0 && (
          <p className="mt-3 text-sm text-red-500">
            This {target.type} has {target.childrenCount} child item(s).
            Deleting it will also delete them.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
