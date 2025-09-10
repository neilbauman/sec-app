// components/PrimaryFrameworkCards.tsx
import type { Pillar, Theme, Subtheme } from "@/types/framework";
import { Download, FileUp, Pencil, Plus, Trash2 } from "lucide-react";

/** Small colored chip for hierarchy level */
function TagBadge({ level }: { level: "pillar" | "theme" | "subtheme" }) {
  const palette =
    level === "pillar"
      ? "bg-blue-50 text-blue-700 ring-blue-200"
      : level === "theme"
      ? "bg-green-50 text-green-700 ring-green-200"
      : "bg-red-50 text-red-700 ring-red-200";
  const label =
    level === "pillar" ? "Pillar" : level === "theme" ? "Theme" : "Subtheme";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${palette}`}
    >
      {label}
    </span>
  );
}

/** Minimal icon button with native title tooltip */
function IconBtn({
  title,
  onClick,
  children,
  disabled,
}: {
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={!onClick || disabled}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border text-gray-600 transition
        ${onClick && !disabled ? "bg-white hover:bg-gray-50 border-gray-200" : "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"}`}
    >
      {children}
    </button>
  );
}

type Actions = {
  // CSV
  onImportCSV?: () => void;
  onExportCSV?: () => void;

  // Pillars
  onAddPillar?: () => void;
  onEditPillar?: (pillar: Pillar) => void;
  onDeletePillar?: (pillar: Pillar) => void;
  onAddTheme?: (pillar: Pillar) => void;

  // Themes
  onEditTheme?: (theme: Theme) => void;
  onDeleteTheme?: (theme: Theme) => void;
  onAddSubtheme?: (theme: Theme) => void;

  // Subthemes
  onEditSubtheme?: (subtheme: Subtheme) => void;
  onDeleteSubtheme?: (subtheme: Subtheme) => void;
};

export default function PrimaryFrameworkCards({
  pillars,
  themes,
  subthemes,
  defaultOpen = false,
  actions = {},
}: {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  defaultOpen?: boolean;
  actions?: Actions;
}) {
  // Group helpers (sorted by sort_order then name for stability)
  const themesForPillar = (pillarId: string) =>
    themes
      .filter((t) => t.pillar_id === pillarId)
      .sort((a, b) =>
        a.sort_order === b.sort_order
          ? a.name.localeCompare(b.name)
          : a.sort_order - b.sort_order
      );

  const subthemesForTheme = (themeId: string) =>
    subthemes
      .filter((s) => s.theme_id === themeId)
      .sort((a, b) =>
        a.sort_order === b.sort_order
          ? a.name.localeCompare(b.name)
          : a.sort_order - b.sort_order
      );

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Card toolbar (CSV placeholders) */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="text-sm font-medium text-gray-700">Primary Framework</div>
        <div className="flex items-center gap-2">
          <IconBtn title="Import CSV" onClick={actions.onImportCSV}>
            <FileUp size={16} />
          </IconBtn>
          <IconBtn title="Export CSV" onClick={actions.onExportCSV}>
            <Download size={16} />
          </IconBtn>
        </div>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[1fr,96px,120px] items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold tracking-wide text-gray-600">
        <div>Name & Description</div>
        <div className="text-right pr-2">Sort</div>
        <div className="text-right">Actions</div>
      </div>

      <div className="divide-y divide-gray-100">
        {pillars
          .sort((a, b) =>
            a.sort_order === b.sort_order
              ? a.name.localeCompare(b.name)
              : a.sort_order - b.sort_order
          )
          .map((pillar) => (
            <PillarBlock
              key={pillar.id}
              pillar={pillar}
              childrenThemes={themesForPillar(pillar.id)}
              childrenSubthemes={subthemesForTheme}
              defaultOpen={defaultOpen}
              actions={actions}
            />
          ))}
      </div>
    </section>
  );
}

/** One pillar + nested themes/subthemes using native <details>/<summary> so caret stays tiny */
function PillarBlock({
  pillar,
  childrenThemes,
  childrenSubthemes,
  defaultOpen,
  actions,
}: {
  pillar: Pillar;
  childrenThemes: Theme[];
  childrenSubthemes: (themeId: string) => Subtheme[];
  defaultOpen: boolean;
  actions: Actions;
}) {
  return (
    <details open={defaultOpen} className="group">
      {/* Summary row — caret (native), tag right next to it, then name/description block.
          Description aligns with the left edge of the name (not under the tag). */}
      <summary className="grid cursor-pointer select-none grid-cols-[1fr,96px,120px] items-start gap-2 px-4 py-3">
        <div className="flex items-start gap-2">
          {/* native marker caret is automatic here */}
          <TagBadge level="pillar" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-gray-900">
              {pillar.name}
            </div>
            {pillar.description ? (
              <div className="mt-0.5 line-clamp-2 text-xs text-gray-600">
                {pillar.description}
              </div>
            ) : null}
          </div>
        </div>

        {/* Sort order (tabular) */}
        <div className="text-right font-mono text-sm text-gray-600 pr-2">
          {pillar.sort_order}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <IconBtn title="Add Theme" onClick={actions.onAddTheme?.bind(null, pillar)}>
            <Plus size={16} />
          </IconBtn>
          <IconBtn title="Edit Pillar" onClick={actions.onEditPillar?.bind(null, pillar)}>
            <Pencil size={16} />
          </IconBtn>
          <IconBtn
            title="Delete Pillar"
            onClick={actions.onDeletePillar?.bind(null, pillar)}
          >
            <Trash2 size={16} />
          </IconBtn>
        </div>
      </summary>

      {/* Themes */}
      {childrenThemes.length > 0 && (
        <div className="border-t border-gray-100 pl-6">
          {childrenThemes.map((theme) => (
            <ThemeBlock
              key={theme.id}
              theme={theme}
              subthemes={childrenSubthemes(theme.id)}
              actions={actions}
            />
          ))}
        </div>
      )}
    </details>
  );
}

function ThemeBlock({
  theme,
  subthemes,
  actions,
}: {
  theme: Theme;
  subthemes: Subtheme[];
  actions: Actions;
}) {
  return (
    <details className="group">
      <summary className="grid cursor-pointer select-none grid-cols-[1fr,96px,120px] items-start gap-2 px-4 py-3">
        <div className="flex items-start gap-2">
          <TagBadge level="theme" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-gray-900">
              {theme.name}
            </div>
            {theme.description ? (
              <div className="mt-0.5 line-clamp-2 text-xs text-gray-600">
                {theme.description}
              </div>
            ) : null}
          </div>
        </div>

        <div className="text-right font-mono text-sm text-gray-600 pr-2">
          {theme.sort_order}
        </div>

        <div className="flex items-center justify-end gap-2">
          <IconBtn title="Add Subtheme" onClick={actions.onAddSubtheme?.bind(null, theme)}>
            <Plus size={16} />
          </IconBtn>
          <IconBtn title="Edit Theme" onClick={actions.onEditTheme?.bind(null, theme)}>
            <Pencil size={16} />
          </IconBtn>
          <IconBtn title="Delete Theme" onClick={actions.onDeleteTheme?.bind(null, theme)}>
            <Trash2 size={16} />
          </IconBtn>
        </div>
      </summary>

      {/* Subthemes */}
      {subthemes.length > 0 && (
        <div className="border-t border-gray-100 pl-6">
          {subthemes.map((s) => (
            <SubthemeRow key={s.id} subtheme={s} actions={actions} />
          ))}
        </div>
      )}
    </details>
  );
}

function SubthemeRow({ subtheme, actions }: { subtheme: Subtheme; actions: Actions }) {
  return (
    <div className="grid grid-cols-[1fr,96px,120px] items-start gap-2 px-4 py-3">
      <div className="flex items-start gap-2">
        <TagBadge level="subtheme" />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-gray-900">
            {subtheme.name}
          </div>
          {subtheme.description ? (
            <div className="mt-0.5 line-clamp-2 text-xs text-gray-600">
              {subtheme.description}
            </div>
          ) : null}
        </div>
      </div>

      <div className="text-right font-mono text-sm text-gray-600 pr-2">
        {subtheme.sort_order}
      </div>

      <div className="flex items-center justify-end gap-2">
        <IconBtn
          title="Edit Subtheme"
          onClick={actions.onEditSubtheme?.bind(null, subtheme)}
        >
          <Pencil size={16} />
        </IconBtn>
        <IconBtn
          title="Delete Subtheme"
          onClick={actions.onDeleteSubtheme?.bind(null, subtheme)}
        >
          <Trash2 size={16} />
        </IconBtn>
      </div>
    </div>
  );
}
