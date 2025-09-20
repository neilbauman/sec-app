"use client";

import { X } from "lucide-react";

type ModalType =
  | null
  | "add-pillar"
  | "add-theme"
  | "add-subtheme"
  | "edit-pillar"
  | "edit-theme"
  | "edit-subtheme";

interface AddEditModalProps {
  open: boolean;
  type: ModalType;
  target?: any;
  onCancel: () => void;
  onSubmit: (data: { name: string; description: string; sort_order: number }) => void;
}

export default function AddEditModal({
  open,
  type,
  target,
  onCancel,
  onSubmit,
}: AddEditModalProps) {
  if (!open || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onCancel}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-lg font-semibold capitalize">
          {type.replace("-", " ")}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement;
            const formData = new FormData(form);
            onSubmit({
              name: formData.get("name") as string,
              description: formData.get("description") as string,
              sort_order: Number(formData.get("sort_order")),
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              type="text"
              defaultValue={target?.name || ""}
              className="w-full rounded border px-2 py-1 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={target?.description || ""}
              className="w-full rounded border px-2 py-1 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sort Order
            </label>
            <input
              name="sort_order"
              type="number"
              defaultValue={target?.sort_order || ""}
              className="w-24 rounded border px-2 py-1 text-sm"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
