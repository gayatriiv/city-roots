import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const app = express();

// Global error handlers to prevent silent crashes and provide clearer logs
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static assets from attached_assets directory - must be before Vite setup
app.use('/@assets', (req, res, next) => {
  const relativePath = req.path.replace('/@assets/', '');
  const filePath = path.resolve(import.meta.dirname, '..', 'attached_assets', relativePath);
  
  console.log('Static file request:', req.path, '->', filePath);
  
  // Set proper content type for images
  if (filePath.endsWith('.jpeg') || filePath.endsWith('.jpg')) {
    res.setHeader('Content-Type', 'image/jpeg');
  } else if (filePath.endsWith('.png')) {
    res.setHeader('Content-Type', 'image/png');
  }
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving file:', err, 'Path:', filePath);
      res.status(404).json({ error: 'File not found', path: filePath });
    }
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// For Vercel deployment, we need to handle async initialization differently
if (process.env.VERCEL) {
  // Initialize routes synchronously for Vercel
  registerRoutes(app).then(server => {
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
    
    // Serve static files in production
    serveStatic(app);
  }).catch(console.error);
} else {
  // Local development
  (async () => {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const startPort = parseInt(process.env.PORT || '5000', 10);

    async function listenWithRetry(server: any, initialPort: number, host = 'localhost', maxAttempts = 10) {
      let port = initialPort;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          await new Promise<void>((resolve, reject) => {
            const onError = (err: any) => {
              server.off('listening', onListening);
              server.off('error', onError);
              reject(err);
            };

            const onListening = () => {
              server.off('listening', onListening);
              server.off('error', onError);
              resolve();
            };

            server.once('error', onError);
            server.once('listening', onListening);
            // Try to listen on the current port
            server.listen(port, host);
          });

          // If we get here, the listen succeeded
          log(`serving on port ${port}`);
          return port;
        } catch (err: any) {
          if (err && err.code === 'EADDRINUSE') {
            log(`port ${port} is in use, trying port ${port + 1}...`);
            port += 1;
            // Small delay before retrying
            await new Promise((r) => setTimeout(r, 200));
            continue;
          }
          // Unknown error - rethrow
          throw err;
        }
      }

      throw new Error(`Unable to bind to any port in range ${initialPort}-${initialPort + maxAttempts - 1}`);
    }

    // Attempt to bind with retries to avoid crashing when the default port is busy
    try {
      await listenWithRetry(server, startPort, 'localhost', 20);
    } catch (err) {
      console.error('Failed to bind server to a port:', err);
      process.exit(1);
    }
  })();
}

// Export the app for Vercel
export default app;
