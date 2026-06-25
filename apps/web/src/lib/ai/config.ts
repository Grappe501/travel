/** Server-only OpenAI configuration (PRM-OCR-001). */
export function getOpenAiConfig() {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_OCR_MODEL ?? 'gpt-4o-mini';

  return {
    apiKey,
    model,
    isConfigured: Boolean(apiKey && apiKey.length > 20 && !apiKey.includes('...')),
  };
}
