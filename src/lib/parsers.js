export function parseMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/`(.+?)`/g, "$1")
    .trim();
}

export function parseQuiz(raw) {
  const stripped = raw.replace(/```(?:json)?\s*([\s\S]*?)```/i, "$1").trim();
  try {
    const items = JSON.parse(stripped);
    if (!Array.isArray(items)) return [];
    return items
      .filter(q => q.question && q.choices?.A && q.choices?.B && q.choices?.C && q.choices?.D && q.answer)
      .map(q => ({ question: q.question, choices: q.choices, answer: q.answer.toUpperCase() }));
  } catch {
    return [];
  }
}
