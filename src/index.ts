import express, { Express, Request, Response } from 'express';


const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Tic-Tac-Toe backend');
});

app.listen(port, () => {
  console.log(`🦄[backend]: Server is running at http://localhost:${port}`);
});