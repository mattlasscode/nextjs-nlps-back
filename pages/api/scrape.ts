import { NextApiRequest, NextApiResponse } from 'next';
import { scheduleScraping, runScheduledTask } from '../../lib/scheduler';
import { scraperConfigs, ScraperConfig } from '../../lib/scrapers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { action, config, interval } = req.body;

      switch (action) {
        case 'schedule':
          if (!config || !interval) {
            return res.status(400).json({ error: 'Missing required parameters' });
          }

          // Validate config
          const scraperConfig: ScraperConfig = {
            ...config,
            baseUrl: config.baseUrl || scraperConfigs[config.name]?.baseUrl,
          };

          if (!scraperConfig.baseUrl) {
            return res.status(400).json({ error: 'Invalid configuration' });
          }

          const taskId = await scheduleScraping(scraperConfig, interval);
          return res.status(200).json({ taskId });

        case 'run':
          if (!req.body.taskId) {
            return res.status(400).json({ error: 'Missing taskId' });
          }

          await runScheduledTask(req.body.taskId);
          return res.status(200).json({ message: 'Task completed successfully' });

        default:
          return res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      console.error('Error in scrape endpoint:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 