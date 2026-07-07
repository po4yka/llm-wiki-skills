function normalize(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(text) {
  return normalize(text).split(' ').filter((token) => token.length >= 2);
}

function scorePhrase(utterance, phrase) {
  const normalizedUtterance = normalize(utterance);
  const normalizedPhrase = normalize(phrase);
  if (!normalizedPhrase) return 0;

  const phraseTokens = tokens(normalizedPhrase);
  const utteranceTokens = new Set(tokens(normalizedUtterance));
  const overlap = phraseTokens.filter((token) => utteranceTokens.has(token)).length;
  const overlapScore = phraseTokens.length > 0 ? (overlap / phraseTokens.length) * 20 : 0;
  const exactScore = normalizedUtterance.includes(normalizedPhrase) ? 100 + phraseTokens.length : 0;

  return exactScore + overlapScore;
}

export function scoreRoute(utterance, route) {
  const intentScores = (route.intents ?? []).map((intent) => scorePhrase(utterance, intent));
  const bestIntentScore = Math.max(0, ...intentScores);
  const skillTokenScore = scorePhrase(utterance, route.skill.replace(/^llm-wiki-/, '').replace(/-/g, ' ')) / 10;
  const negativeScore = (route.not_for ?? []).reduce((total, phrase) => total + scorePhrase(utterance, phrase), 0);

  return bestIntentScore + skillTokenScore - negativeScore;
}

export function rankRoutes(utterance, routes) {
  return routes
    .map((route) => ({
      skill: route.skill,
      score: scoreRoute(utterance, route),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.skill.localeCompare(b.skill);
    });
}

export function chooseSkill(utterance, routes) {
  return rankRoutes(utterance, routes)[0];
}

export function normalizeIntent(intent) {
  return normalize(intent);
}

