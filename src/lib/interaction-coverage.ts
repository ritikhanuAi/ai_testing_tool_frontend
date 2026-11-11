import { InteractionCategory, InteractionCoverageMode } from "@/types/test-run";

export const INTERACTION_CATEGORIES: { value: InteractionCategory; label: string }[] = [
  { value: "dropdown", label: "Dropdowns" },
  { value: "search", label: "Search" },
  { value: "navigation", label: "Navigation" },
  { value: "button", label: "Buttons" },
  { value: "form", label: "Forms and other controls" },
];

export const DEFAULT_INTERACTION_CATEGORIES: InteractionCategory[] = INTERACTION_CATEGORIES.map(
  ({ value }) => value,
);

export function parseRequiredCombinations(input: string): {
  combinations?: Record<string, string>[];
  error?: string;
} {
  const lines = input.split("\n").map((line) => line.trim()).filter(Boolean);
  const combinations: Record<string, string>[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(lines[index]);
    } catch {
      return { error: `Required combination on line ${index + 1} must be valid JSON.` };
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { error: `Required combination on line ${index + 1} must be a JSON object.` };
    }

    const entries = Object.entries(parsed as Record<string, unknown>);
    if (entries.length === 0 || entries.some(([key, value]) => !key.trim() || typeof value !== "string" || !value.trim())) {
      return { error: `Required combination on line ${index + 1} needs control names and non-empty string values.` };
    }
    combinations.push(Object.fromEntries(entries.map(([key, value]) => [key.trim(), (value as string).trim()])));
  }

  return { combinations };
}

export type { InteractionCategory, InteractionCoverageMode };
