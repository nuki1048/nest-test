import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import express from 'express';
import { AppModule } from './app.module';

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
  req: Request,
  res: Response,
): Promise<void> {
  const app = await bootstrap();
  app(req, res);
}
