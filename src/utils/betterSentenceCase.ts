export function betterSentenceCase(str: string): string {
  const tokens = str.match(/[A-Za-z]+|[^A-Za-z]+/g);
  if (!tokens) return str;

  let wordIndex = 0;

  const transformed = tokens.map((token) => {
    const hasLetters = /[A-Za-z]/.test(token);
    if (!hasLetters) return token;

    const lettersOnly = token.replace(/[^A-Za-z]+/g, '');
    const isAllCaps = lettersOnly === lettersOnly.toUpperCase();
    const isPluralizedAcronym =
      lettersOnly.length > 0 && /^[A-Z]{2,}(?:['’]?[sS])$/.test(lettersOnly);

    if (isAllCaps || isPluralizedAcronym) {
      wordIndex += 1;
      return token;
    }

    if (wordIndex === 0) {
      const lower = token.toLowerCase();
      const firstLetterMatch = lower.match(/[a-z]/);

      if (!firstLetterMatch) {
        wordIndex += 1;
        return lower;
      }

      const i = firstLetterMatch.index!;
      const result =
        lower.slice(0, i) + lower.charAt(i).toUpperCase() + lower.slice(i + 1);

      wordIndex += 1;
      return result;
    }

    wordIndex += 1;
    return token.toLowerCase();
  });

  return transformed.join('');
}
