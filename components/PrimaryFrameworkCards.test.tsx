import React from "react";
import { render, screen } from "@testing-library/react";
import PrimaryFrameworkEditorClient from "@/app/admin/framework/primary/editor/PrimaryFrameworkEditorClient";
import { Pillar } from "@/types/framework";

// Mock a pillar with nested data
const mockPillars: Pillar[] = [
  {
    id: "pillar-1",
    code: "P1",
    name: "Housing",
    description: "Access to safe housing",
    sort_order: 1,
    themes: [
      {
        id: "theme-1",
        code: "T1.1",
        name: "Physical safety",
        description: "Safe from hazards",
        pillar_id: "pillar-1",
        sort_order: 1,
        subthemes: [
          {
            id: "subtheme-1",
            code: "ST1.1",
            name: "Fire safety",
            description: "Protection against fire",
            theme_id: "theme-1",
            sort_order: 1,
          },
        ],
      },
    ],
  },
];

describe("PrimaryFrameworkEditorClient", () => {
  it("renders error state", () => {
    render(<PrimaryFrameworkEditorClient pillars={[]} error="DB connection failed" />);
    expect(screen.getByText("Error loading framework data")).toBeInTheDocument();
    expect(screen.getByText("DB connection failed")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<PrimaryFrameworkEditorClient pillars={[]} />);
    expect(screen.getByText("No framework data found.")).toBeInTheDocument();
  });

  it("renders framework data with nested cards", () => {
    render(<PrimaryFrameworkEditorClient pillars={mockPillars} />);
    expect(screen.getByText("Pillar")).toBeInTheDocument();
    expect(screen.getByText("P1")).toBeInTheDocument();
    expect(screen.getByText("Housing")).toBeInTheDocument();

    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("T1.1")).toBeInTheDocument();
    expect(screen.getByText("Physical safety")).toBeInTheDocument();

    expect(screen.getByText("Subtheme")).toBeInTheDocument();
    expect(screen.getByText("ST1.1")).toBeInTheDocument();
    expect(screen.getByText("Fire safety")).toBeInTheDocument();
  });
});
