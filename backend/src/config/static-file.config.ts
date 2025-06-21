import { ServeStaticModuleOptions } from '@nestjs/serve-static';
import { join } from 'path';

export const staticFileConfig: ServeStaticModuleOptions = {
  rootPath: join(process.cwd(), 'public'),
  serveRoot: '/public',
  serveStaticOptions: {
    index: false, // Disable directory listing
    cacheControl: true,
    maxAge: '1d', // Cache static files for 1 day
  },
  useGlobalPrefix: false,
};
