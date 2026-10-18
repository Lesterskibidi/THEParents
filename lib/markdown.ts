export type Heading = { level: 2 | 3; text: string; id: string };

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFKC')
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

/** Returns a function that hands out unique ids, adding -2, -3... for repeated headings. */
export function makeIdGenerator() {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text);
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };
}

const stripInline = (s: string) =>
  s.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`~]/g, '').trim();

/** Table of contents from Markdown headings (# to ###), ignoring fenced code blocks. */
export function extractHeadings(markdown: string): Heading[] {
  const next = makeIdGenerator();
  const out: Heading[] = [];
  let inFence = false;
  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = stripInline(m[2]);
    out.push({ level: m[1].length === 3 ? 3 : 2, text, id: next(text) });
  }
  return out;
}
