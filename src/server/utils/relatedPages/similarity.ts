const MIN_TERM_LENGTH = 3;
const MIN_DOCUMENT_FREQUENCY = 2;
const MAX_DOCUMENT_FREQUENCY_RATIO = 0.5;

const STOPWORDS = new Set(
  `a about after against all also an and any are as at be been both but by can
   for from had has have how in into is it its more most no not of on one only
   or other out over own same she so some such than that the their them then
   there these they this those through to too under until up use used very was
   were what when where which while who why will with would you your`.split(
    /\s+/,
  ),
);

export interface TermVector {
  terms: Map<string, number>;
  norm: number;
}

function toPlainText(markdown: string): string {
  return markdown
    .replace(
      /\[\[(\/[^\s\]]+)(?:\s+([^\]\n]+))?\]\]/g,
      (_match, path, label) => (label ? String(label) : String(path)),
    )
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function countTerms(text: string): Map<string, number> {
  const counts = new Map<string, number>();

  for (const term of toPlainText(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)) {
    if (term.length < MIN_TERM_LENGTH || STOPWORDS.has(term)) continue;
    counts.set(term, (counts.get(term) ?? 0) + 1);
  }

  return counts;
}

export function buildVectors(documents: string[]): TermVector[] {
  const counts = documents.map(countTerms);
  const documentFrequency = new Map<string, number>();

  for (const document of counts) {
    for (const term of document.keys()) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }

  const maxDocumentFrequency = Math.max(
    MIN_DOCUMENT_FREQUENCY,
    counts.length * MAX_DOCUMENT_FREQUENCY_RATIO,
  );

  return counts.map((document) => {
    const terms = new Map<string, number>();
    let sumOfSquares = 0;

    for (const [term, count] of document) {
      const frequency = documentFrequency.get(term) ?? 0;
      if (
        frequency < MIN_DOCUMENT_FREQUENCY ||
        frequency > maxDocumentFrequency
      ) {
        continue;
      }

      const weight =
        (1 + Math.log(count)) * Math.log(1 + counts.length / frequency);

      terms.set(term, weight);
      sumOfSquares += weight * weight;
    }

    return { terms, norm: Math.sqrt(sumOfSquares) || 1 };
  });
}

export function cosine(a: TermVector, b: TermVector): number {
  const [small, large] = a.terms.size <= b.terms.size ? [a, b] : [b, a];
  let dot = 0;

  for (const [term, weight] of small.terms) {
    const other = large.terms.get(term);
    if (other) dot += weight * other;
  }

  return dot / (a.norm * b.norm);
}
