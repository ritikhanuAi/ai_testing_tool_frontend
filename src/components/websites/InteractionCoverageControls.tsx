"use client";

import React from "react";
import { Switch } from "@/components/common/Input";
import {
  INTERACTION_CATEGORIES,
  InteractionCategory,
  InteractionCoverageMode,
} from "@/lib/interaction-coverage";

interface InteractionCoverageControlsProps {
  enabled: boolean;
  onEnabledChange: (value: boolean) => void;
  mode: InteractionCoverageMode;
  onModeChange: (value: InteractionCoverageMode) => void;
  categories: InteractionCategory[];
  onCategoriesChange: (value: InteractionCategory[]) => void;
  requiredCombinationsText: string;
  onRequiredCombinationsTextChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function InteractionCoverageControls({
  enabled,
  onEnabledChange,
  mode,
  onModeChange,
  categories,
  onCategoriesChange,
  requiredCombinationsText,
  onRequiredCombinationsTextChange,
  error,
  disabled = false,
}: InteractionCoverageControlsProps) {
  const toggleCategory = (category: InteractionCategory) => {
    onCategoriesChange(
      categories.includes(category)
        ? categories.filter((item) => item !== category)
        : [...categories, category],
    );
  };

  return (
    <div className="space-y-3 rounded-lg border border-[#E6E6E6] bg-white p-3">
      <Switch
        label="Use deterministic interaction coverage"
        description="Turn off to use the bounded AI exploration journey instead."
        checked={enabled}
        onChange={onEnabledChange}
        disabled={disabled}
      />
      {enabled && (
        <div className="space-y-3 border-t border-[#E6E6E6] pt-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#594139]">Coverage strategy</label>
            <select
              value={mode}
              onChange={(event) => onModeChange(event.target.value as InteractionCoverageMode)}
              disabled={disabled}
              className="h-8 w-full rounded-lg border border-[#E6E6E6] bg-white px-2 text-xs text-[#212121] focus:border-[#FF6C37] focus:outline-none"
            >
              <option value="exhaustive">Exhaustive: every selected value combination</option>
              <option value="pairwise">Pairwise: every selected value pair</option>
            </select>
            <p className="mt-1 text-[10px] text-[#8C8C8C]">
              Pairwise greatly reduces cases while covering every pair of discovered control values. It does not cover every three-way or higher interaction.
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-[11px] font-medium text-[#594139]">Control categories to include</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {INTERACTION_CATEGORIES.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-1.5 text-[11px] text-[#594139]">
                  <input
                    type="checkbox"
                    checked={categories.includes(value)}
                    onChange={() => toggleCategory(value)}
                    disabled={disabled}
                    className="accent-[#FF6C37]"
                  />
                  {label}
                </label>
              ))}
            </div>
            <p className="mt-1 text-[10px] text-[#8C8C8C]">Choose which discovered controls are part of this interaction matrix.</p>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-[#594139]">Combinations to always include (optional)</label>
            <textarea
              value={requiredCombinationsText}
              onChange={(event) => onRequiredCombinationsTextChange(event.target.value)}
              disabled={disabled}
              rows={3}
              placeholder={'{"Status":"Closed","Search":"sample"}'}
              className="w-full rounded-lg border border-[#E6E6E6] bg-white px-3 py-2 font-mono text-xs text-[#212121] focus:border-[#FF6C37] focus:outline-none"
              aria-label="Required interaction combinations, one JSON object per line"
            />
            <p className="mt-1 text-[10px] text-[#8C8C8C]">
              One JSON object per line. Use discovered control labels and desired values; omitted controls use their default value.
            </p>
            {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
