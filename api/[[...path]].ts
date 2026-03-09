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
    expressApp.set('trust proxy', 1);
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
  const rawUrl = (req as { url?: string }).url ?? req.url ?? '/';
  const path = rawUrl.replace(/^\/api/, '') || '/';
  const expressReq = Object.assign(req, {
    url: path,
    originalUrl: path,
    path,
    baseUrl: '',
  }) as express.Request;
  app(expressReq, res as express.Response);
}
