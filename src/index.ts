import express, { Express, Request, Response } from 'express';
import path from 'path';

const app: Express = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../src/public')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../src/public/index.html'));
});

app.post('/move', (req: Request, res: Response) => {
  console.log('move');
});

app.listen(port, () => {
  console.log(`🦄[backend]: Server is running at http://localhost:${port}`);
});