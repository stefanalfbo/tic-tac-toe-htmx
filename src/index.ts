import express, { Express, Request, Response } from 'express';
import path from 'path';

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../src/public/index.html'));
});

app.listen(port, () => {
  console.log(`🦄[backend]: Server is running at http://localhost:${port}`);
});