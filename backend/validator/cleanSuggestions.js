const cleanSuggestions = (raw) => {
  try {
    const cleaned = raw
      .replace(/```json|```/g, '') // Remove markdown
      .trim();

    const maybeParsed = JSON.parse(cleaned || raw);
    if (Array.isArray(maybeParsed)) return maybeParsed;
    if (Array.isArray(maybeParsed.tasks)) return maybeParsed.tasks;
  } catch {
    // Continue to fallback
  }

  // Fallback: manual cleanup
  return raw
    .split('\n')
    .map(line =>
      line.replace(/^[\s\["\],]+|[\s\]"`,]+$/g, '').trim()
    )
    .filter(line =>
      line.length &&
      !/^{|}$/.test(line) &&
      !/[a-zA-Z0-9_]+\s*:\s*\[?$/i.test(line) // 🧠 filters lines like 'taskTitles: [' or 'tasks: ['
    );
};

module.exports = cleanSuggestions;
