import { dump, load } from "js-yaml";

/** File types a human can upload with test cases. JSON is read by the YAML parser too. */
export const TEST_CASE_FILE_ACCEPT = ".yaml,.yml,.json";
const ALLOWED_EXTENSIONS = [".yaml", ".yml", ".json"];
const MAX_FILE_BYTES = 1_000_000; // 1 MB is far more than any realistic test pack

export interface ParsedTestCases {
  cases: unknown[];
  packId?: string;
  title?: string;
  version?: string;
}

/**
 * Read test cases from YAML or JSON text. Accepts the three shapes the backend accepts:
 * a full pack (`pack_id`, `title`, `cases`), an object with a `cases` list, or a bare list.
 * Throws an Error with a plain-language message when the text can't be used.
 */
export function parseTestCasesText(text: string): ParsedTestCases {
  let data: unknown;
  try {
    data = load(text);
  } catch (error) {
    const reason = error instanceof Error ? error.message.split("\n")[0] : "unknown error";
    throw new Error(`The file is not valid YAML or JSON: ${reason}`);
  }

  if (Array.isArray(data)) {
    if (data.length === 0) throw new Error("The file has an empty list. Add at least one test case.");
    return { cases: data };
  }

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.cases)) {
      if (obj.cases.length === 0) throw new Error("The 'cases' list is empty. Add at least one test case.");
      return {
        cases: obj.cases,
        packId: typeof obj.pack_id === "string" ? obj.pack_id : undefined,
        title: typeof obj.title === "string" ? obj.title : undefined,
        version: typeof obj.version === "string" ? obj.version : undefined,
      };
    }
    if ("test_cases" in obj) {
      throw new Error("Use 'cases:' instead of 'test_cases:' for the list of test cases.");
    }
  }

  throw new Error("No test cases found. The file needs a 'cases:' list (or be a list of test cases).");
}

function slugify(text: string): string {
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || "test-pack";
}

/** Turn parsed test cases into a full test pack YAML (the format the Test Pack editor saves). */
export function toTestPackYaml(parsed: ParsedTestCases, fallbackTitle: string): string {
  const title = parsed.title || fallbackTitle;
  return dump(
    {
      pack_id: parsed.packId || slugify(title),
      title,
      version: parsed.version || "1.0.0",
      cases: parsed.cases,
    },
    { lineWidth: -1, noRefs: true }
  );
}

/** Read an uploaded file as text after checking its type and size. */
export async function readTestCaseFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (!ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    throw new Error("Please choose a .yaml, .yml or .json file.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("The file is too large (maximum 1 MB).");
  }
  return file.text();
}

/** File name without its extension, used as a default pack title. */
export function fileTitle(fileName: string): string {
  return fileName.replace(/\.(ya?ml|json)$/i, "").replace(/[-_]+/g, " ").trim() || "Uploaded Test Pack";
}
