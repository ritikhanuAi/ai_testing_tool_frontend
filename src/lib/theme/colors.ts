/**
 * TestPilot Minimal Engineering Studio - Design Tokens & Color Scheme
 * Reference: stitch_testpilot_ai_testing_dashboard/testpilot_minimal_engineering_studio/DESIGN.md
 */

export const TESTPILOT_COLORS = {
  // Application Canvas & Surfaces
  canvas: "#FBF9F8",
  surface: "#FFFFFF",
  surfaceLow: "#F5F3F3",
  surfaceContainer: "#EFEDED",
  surfaceHigh: "#E9E8E7",
  surfaceHighest: "#E4E2E2",

  // Borders & Structural Boundaries
  border: "#E6E6E6",
  borderVariant: "#E1BFB5",
  borderHover: "#D4D4D4",

  // Primary Brand & Accent
  primary: "#AC3500",
  primaryAccent: "#FF6C37",
  primaryHover: "#E8590C",
  primaryActiveTint: "#FFF1EB",

  // Monochromatic Typography
  textPrimary: "#212121",
  textSecondary: "#6B6B6B",
  textMuted: "#8C8C8C",

  // Feedback & Status Badges
  status: {
    pass: {
      text: "#12B76A",
      bg: "#ECFDF3",
      border: "rgba(18, 183, 106, 0.2)",
    },
    fail: {
      text: "#F04438",
      bg: "#FEF3F2",
      border: "rgba(240, 68, 56, 0.2)",
    },
    warning: {
      text: "#F79009",
      bg: "#FFFAEB",
      border: "rgba(247, 144, 9, 0.2)",
    },
    running: {
      text: "#0BA5EC",
      bg: "#F0F9FF",
      border: "rgba(11, 165, 236, 0.2)",
    },
  },
} as const;

export type TestPilotColors = typeof TESTPILOT_COLORS;
