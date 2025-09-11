import React from "react";
import { render, screen } from "@testing-library/react";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { Pillar } from "@/types/framework";

// Mock data for test
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

describe("PrimaryFrameworkCards", () => {
  it("renders pillars, themes, and subthemes correctly", () => {
    render(<PrimaryFrameworkCards pillars={mockPillars} />);

    // Check pillar
    expect(screen.getByText("Pillar")).toBeInTheDocument();
    expect(screen.getByText("P1")).toBeInTheDocument();
    expect(screen.getByText("Housing")).toBeInTheDocument();

    // Check theme
    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("T1.1")).toBeInTheDocument();
    expect(screen.getByText("Physical safety")).toBeInTheDocument();

    // Check subtheme
    expect(screen.getByText("Subtheme")).toBeInTheDocument();
    expect(screen.getByText("ST1.1")).toBeInTheDocument();
    expect(screen.getByText("Fire safety")).toBeInTheDocument();
  });
});
