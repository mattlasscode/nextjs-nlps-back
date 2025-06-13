import { PrismaClient } from '@prisma/client';
import { scrapeProducts, ScraperConfig } from './scrapers';
import { getEmbedding } from './openai';

const prisma = new PrismaClient();

interface ScheduledTask {
  id: string;
  config: ScraperConfig;
  interval: number; // in minutes
  lastRun?: Date;
}

const tasks: ScheduledTask[] = [];

export async function scheduleScraping(config: ScraperConfig, intervalMinutes: number) {
  const task: ScheduledTask = {
    id: Math.random().toString(36).substring(7),
    config,
    interval: intervalMinutes,
  };
  
  tasks.push(task);
  return task.id;
}

export async function runScheduledTask(taskId: string) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) throw new Error('Task not found');

  try {
    console.log(`Running scheduled task for ${task.config.name}`);
    const products = await scrapeProducts(task.config);
    
    // Process each product
    for (const product of products) {
      const embedding = await getEmbedding(product.title + ' ' + product.description);
      
      // Upsert the product
      await prisma.product.upsert({
        where: {
          title_url: {
            title: product.title,
            url: product.url || '',
          },
        },
        update: {
          description: product.description,
          price: product.price,
          image: product.image,
          sku: product.sku,
          embedding,
        },
        create: {
          title: product.title,
          description: product.description,
          url: product.url || '',
          price: product.price,
          image: product.image,
          sku: product.sku,
          embedding,
          storeId: task.config.storeId,
        },
      });
    }

    task.lastRun = new Date();
    console.log(`Completed scheduled task for ${task.config.name}`);
  } catch (error) {
    console.error(`Error running scheduled task for ${task.config.name}:`, error);
    throw error;
  }
}

// Start the scheduler
export function startScheduler() {
  setInterval(async () => {
    const now = new Date();
    
    for (const task of tasks) {
      const shouldRun = !task.lastRun || 
        (now.getTime() - task.lastRun.getTime()) >= task.interval * 60 * 1000;
      
      if (shouldRun) {
        try {
          await runScheduledTask(task.id);
        } catch (error) {
          console.error(`Failed to run task ${task.id}:`, error);
        }
      }
    }
  }, 60000); // Check every minute
} 