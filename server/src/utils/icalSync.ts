import ical, { type VEvent } from 'node-ical';
import Villa from '../models/Villa.js';
import IcalBlock from '../models/IcalBlock.js';

export async function syncAllIcalFeeds(): Promise<{ villa: string; imported: number; errors: string[] }[]> {
  const villas = await Villa.find({ 'icalImportUrls.0': { $exists: true } });
  const results: { villa: string; imported: number; errors: string[] }[] = [];

  for (const villa of villas) {
    let imported = 0;
    const errors: string[] = [];

    for (const feed of villa.icalImportUrls) {
      try {
        const events = await ical.async.fromURL(feed.url);

        for (const [, event] of Object.entries(events)) {
          if (!event || event.type !== 'VEVENT') continue;
          const vevent = event as VEvent;

          if (!vevent.start || !vevent.end) continue;

          const startDate = new Date(vevent.start);
          const endDate = new Date(vevent.end);

          if (endDate <= new Date()) continue;

          try {
            await IcalBlock.findOneAndUpdate(
              { villa: villa._id, uid: vevent.uid || `${feed.source}-${startDate.toISOString()}` },
              {
                villa: villa._id,
                source: feed.source,
                uid: vevent.uid || `${feed.source}-${startDate.toISOString()}`,
                summary: vevent.summary || 'Blocked',
                startDate,
                endDate,
                lastSyncedAt: new Date(),
              },
              { upsert: true }
            );
            imported++;
          } catch (e) {
            errors.push(`Event ${vevent.uid}: ${(e as Error).message}`);
          }
        }
      } catch (e) {
        errors.push(`Feed ${feed.source} (${feed.url}): ${(e as Error).message}`);
      }
    }

    results.push({ villa: villa.title, imported, errors });
  }

  return results;
}
