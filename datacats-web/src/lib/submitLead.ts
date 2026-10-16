const FALLBACK = 'We could not send your message right now. Please email josh@datacats.ca instead.';

export async function submitLead(payload: Record<string, unknown>): Promise<void> {
  let res: Response;
  try {
    res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(FALLBACK);
  }
  if (res.ok) return;

  const data = await res.json().catch(() => ({}));
  if (res.status === 400 && data.errors) throw new Error('Please check the highlighted fields and try again.');
  if (res.status === 429) throw new Error('Too many attempts. Please wait a few minutes and try again.');
  throw new Error(FALLBACK);
}
