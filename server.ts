import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import sendEmailHandler from './api/send-email';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for secure server-side email dispatch
  app.post('/api/send-email', (req, res) => sendEmailHandler(req, res));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
