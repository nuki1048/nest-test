import type { VercelRequest, VercelResponse } from '@vercel/node';
// Force-include Rollup Linux binary for AdminJS (prevents runtime "Cannot find module" on Vercel)
import '@rollup/rollup-linux-x64-gnu';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

let cachedApp: express.Application;

async function bootstrap(): Promise<express.Application> {
  if (!cachedApp) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    await nestApp.init();
    cachedApp = expressApp;
  }
  return cachedApp;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const app = await bootstrap();
  const originalUrl = (req as { url?: string }).url ?? '/';
  const url = originalUrl.replace(/^\/api/, '') || '/';
  const expressReq = { ...req, url } as express.Request;
  app(expressReq, res as express.Response);
}
