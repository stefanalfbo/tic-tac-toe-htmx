import express, { Express, Request, Response } from 'express';
import path from 'path';

const app: Express = express();
const port = 3000;

type Client = {
  id: number;
  res: Response;
}

let clients: Client[] = [];

type Player = 'X' | 'O' | '';

const initializeGame = () => {
  app.locals.board = [
    '', '', '',
    '', '', '',
    '', '', ''
  ] as Player[];
  app.locals.nextPlayer = 'X' as Player;
  app.locals.status = 'Next player: X';
}

const switchPlayer = () => {
  app.locals.nextPlayer = app.locals.nextPlayer === 'X' ? 'O' : 'X';
}

const isWinner = (currentBoard: Player[]): boolean => {
  const winnerLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winnerLines.length; i++) {
    const [a, b, c] = winnerLines[i];
    if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
      return true;
    }
  }
  return false;
}

const sendStatusEvent = (status: string) => {
  clients.forEach(client => client.res.write(`data: ${JSON.stringify(status)}\n\n`))
}

initializeGame();

app.use(express.static(path.join(__dirname, '../src/public')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../src/public/index.html'));
});

app.get('/move', (req: Request, res: Response) => {
  const boardIndex = parseInt(req.query.pos as string);
  const moveByPlayer = app.locals.nextPlayer;

  if (app.locals.board[boardIndex] !== '') {
    res.send(app.locals.board[boardIndex])
    return;
  }

  if (isWinner(app.locals.board)) {
    return;
  }

  app.locals.board[boardIndex] = moveByPlayer;
  switchPlayer();

  if (isWinner(app.locals.board)) {
    app.locals.status = `Winner: ${moveByPlayer}`;
  } else {
    app.locals.status = `Next player: ${app.locals.nextPlayer}`;
  }  
  sendStatusEvent(app.locals.status);
  res.send(moveByPlayer);
});

app.get('/status', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push({
    id: Date.now(),
    res,
  });

  sendStatusEvent(app.locals.status);
});

app.listen(port, () => {
  console.log(`🦄[backend]: Server is running at http://localhost:${port}`);
});
