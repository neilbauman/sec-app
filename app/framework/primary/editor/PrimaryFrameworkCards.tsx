"use client";

import React from "react";
import { Pillar, Theme, Subtheme } from "@/types/framework";
import { cn } from "@/lib/utils";
import { Edit2, Trash2, ArrowUp, ArrowDown } from "lucide-react";

type Props = {
  pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
};

export default function PrimaryFrameworkCards({ pillars }: Props) {
  return (
    <div className="overflow-hidden border rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Type / Code
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
              Name / Description
            </th>
            <th className="px-4 py-2 text-sm font-medium text-gray-500 text-center">
              Sort Order
            </th>
            <th className="px-4 py-2 text-sm font-medium text-gray-500 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {pillars.map((pillar) => (
            <React.Fragment key={pillar.id}>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 text-sm font-medium">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-semibold",
                      "bg-blue-100 text-blue-800"
                    )}
                  >
                    Pillar
                  </span>{" "}
                  <span className="text-gray-500">{pillar.code}</span>
                </td>
                <td className="px-4 py-2">
                  <div className="font-medium">{pillar.name}</div>
                  <div className="text-xs text-gray-500">
                    {pillar.description}
                  </div>
                </td>
                <td className="px-4 py-2 text-center">{pillar.sort_order}</td>
                <td className="px-4 py-2 flex justify-end space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit2 size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ArrowUp size={16} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ArrowDown size={16} />
                  </button>
                </td>
              </tr>

              {pillar.themes.map((theme) => (
                <React.Fragment key={theme.id}>
                  <tr>
                    <td className="px-4 py-2 pl-10 text-sm font-medium">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold",
                          "bg-green-100 text-green-800"
                        )}
                      >
                        Theme
                      </span>{" "}
                      <span className="text-gray-500">{theme.code}</span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium">{theme.name}</div>
                      <div className="text-xs text-gray-500">
                        {theme.description}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {theme.sort_order}
                    </td>
                    <td className="px-4 py-2 flex justify-end space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit2 size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ArrowUp size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ArrowDown size={16} />
                      </button>
                    </td>
                  </tr>

                  {theme.subthemes.map((subtheme) => (
                    <tr key={subtheme.id}>
                      <td className="px-4 py-2 pl-20 text-sm font-medium">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-semibold",
                            "bg-red-100 text-red-800"
                          )}
                        >
                          Subtheme
                        </span>{" "}
                        <span className="text-gray-500">{subtheme.code}</span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="font-medium">{subtheme.name}</div>
                        <div className="text-xs text-gray-500">
                          {subtheme.description}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {subtheme.sort_order}
                      </td>
                      <td className="px-4 py-2 flex justify-end space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit2 size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ArrowUp size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ArrowDown size={16} />
