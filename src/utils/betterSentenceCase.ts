function splitAlphabeticSegment(segment: string): string[] {
  if (/^[A-Z]{2,}$/.test(segment) || /^[A-Z]{2,}(?:['’]?[sS])$/.test(segment))
    return [segment];
  if (/^[A-Z](?:[a-z]+[A-Z])+$/u.test(segment)) return [segment];

  return (
    segment.match(
      /[A-Z]{2,}(?=[A-Z][a-z])|[A-Z]{2,}(?=[a-z])|[A-Z]?[a-z]+|[A-Z]+|[a-z]+/g,
    ) ?? [segment]
  );
}

export function betterSentenceCase(str: string): string {
  const segments = str.match(/[A-Za-z]+|[^A-Za-z]+/g);
  if (!segments) return str;

  let wordIndex = 0;
  const result: string[] = [];

  for (const segment of segments) {
    if (!/[A-Za-z]/.test(segment)) {
      result.push(segment);
      continue;
    }

    const parts = splitAlphabeticSegment(segment);
    const lastIndex = parts.length - 1;

    for (const [index, part] of parts.entries()) {
      const lettersOnly = part.replace(/[^A-Za-z]+/g, '');
      const hasLetters = lettersOnly.length > 0;

      if (!hasLetters) {
        result.push(part);
        continue;
      }

      const isAllCaps = lettersOnly === lettersOnly.toUpperCase();
      const isPluralizedAcronym = /^[A-Z]{2,}(?:['’]?[sS])$/.test(lettersOnly);
      const isMixedCaseAcronym = /^[A-Z](?:[a-z]+[A-Z])+$/u.test(lettersOnly);

      if (isAllCaps || isPluralizedAcronym || isMixedCaseAcronym) {
        wordIndex += 1;
        result.push(part);
      } else if (wordIndex === 0) {
        const lower = part.toLowerCase();
        const firstLetterMatch = lower.match(/[a-z]/);

        if (!firstLetterMatch) {
          wordIndex += 1;
          result.push(lower);
        } else {
          const i = firstLetterMatch.index!;
          const transformed =
            lower.slice(0, i) +
            lower.charAt(i).toUpperCase() +
            lower.slice(i + 1);

          wordIndex += 1;
          result.push(transformed);
        }
      } else {
        wordIndex += 1;
        result.push(part.toLowerCase());
      }

      if (parts.length > 1 && index < lastIndex) {
        const isCoPrefix = lettersOnly.toLowerCase() === 'co';
        result.push(isCoPrefix ? '-' : ' ');
      }
    }
  }

  return result.join('');
}
