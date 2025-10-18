import { split } from 'change-case';

export function betterSentenceCase(str: string): string {
  const words = split(str);

  let wordIndex = 0;

  const transformed = words.map((token) => {
    const lettersOnly = token.replace(/[^A-Za-z]+/g, '');
    const hasLetters = lettersOnly.length > 0;
    const isAllCaps = hasLetters && lettersOnly === lettersOnly.toUpperCase();

    if (isAllCaps) {
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

  return transformed.join(' ');
}
