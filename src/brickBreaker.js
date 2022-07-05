(function () {
  const px = (value) => `${value}px`;

  const drawBoard = (board, boardEle) => {
    const { top, bottom, left, right } = board;

    boardEle.style.height = px((bottom - top));
    boardEle.style.width = px((right - left));
    boardEle.style.left = px(left);
    boardEle.style.top = px(top);

    return true;
  };

  const createBall = (ball, board) => {
    const { id, positions: { x, y } } = ball.getDetails();
    const ballElement = document.createElement('div');

    ballElement.id = id;
    ballElement.className = 'ball';
    ballElement.style.left = px(x);
    ballElement.style.top = px(y);
    board.appendChild(ballElement);

    return;
  };

  const animateBall = (ball) => {
    const { id, positions: { x, y } } = ball.getDetails();

    const ballElement = document.getElementById(id);
    ballElement.style.left = x;
    ballElement.style.top = y;

    return true;
  };

  class Ball {
    #id;
    #positions;
    #dia;
    #speed;

    constructor(id, positions, dia, speed) {
      this.#id = id;
      this.#positions = positions;
      this.#dia = dia;
      this.#speed = speed;
    }

    moveBall(board) {
      const { top, bottom, left, right } = board;
      this.#positions.y += this.#speed.dy;
      this.#positions.x += this.#speed.dx;

      if (this.#positions.x < left || this.#positions.x + this.#dia > right) {
        this.#speed.dx = -this.#speed.dx;
      }

      if (this.#positions.y < top || this.#positions.y + this.#dia > bottom) {
        this.#speed.dy = -this.#speed.dy;
      }
    }

    getDetails() {
      const { x, y } = this.#positions;
      const { dx, dy } = this.#speed;

      return {
        id: this.#id,
        positions: { x, y },
        dia: this.#dia,
        speed: { dx, dy }
      };
    }
  }

  const drawPaddle = (paddle, board) => {
    const { id, positions: { x, y }, width, height } = paddle;
    const paddleElement = document.createElement('div');

    paddleElement.id = id;
    paddleElement.style.width = px(width);
    paddleElement.style.height = px(height);
    paddleElement.style.left = x;
    paddleElement.style.top = y;
    board.appendChild(paddleElement);
  };

  const movePaddle = (paddle, board, event) => {
    const { positions: { x, y }, width } = paddle;
    const { left, right } = board;

    const isLeftArrow = event.code === 'ArrowLeft';
    const isRightArrow = event.code === 'ArrowRight';

    if (isLeftArrow && x > left) {
      paddle.positions.x -= paddle.speed.dx;
    }

    if (isRightArrow && x + width < right) {
      paddle.positions.x += paddle.speed.dx;
    }
  };

  const animatePaddle = (paddle) => {
    const { id, positions: { x, y } } = paddle;

    const paddleElement = document.getElementById(id);
    paddleElement.style.left = x;
    paddleElement.style.top = y;
  };

  const isGameOver = ({ paddle, ball }) => {
    const rangeStart = paddle.positions.x;
    const rangeEnd = rangeStart + paddle.width;
    const { positions, dia } = ball.getDetails();

    const isBallInRange = positions.x > rangeStart && positions.x < rangeEnd;

    if (positions.y + dia >= paddle.positions.y) {
      if (!isBallInRange) {
        return true;
      }
    }

    return false;
  };

  const stopIfGameOver = (game, intervalId) => {
    if (isGameOver(game)) {
      alert('Game over');
      clearInterval(intervalId);
    }
  };

  const drawEntities = (game) => {
    const boardElement = document.getElementById(game.board.id);
    drawBoard(game.board, boardElement);
    createBall(game.ball, boardElement);
    drawPaddle(game.paddle, boardElement);
  };

  const initializeEntities = () => {
    const board = { id: 'board', top: 0, left: 0, bottom: 500, right: 500 };
    const ball = new Ball('ball-1', { x: 100, y: 100 }, 20, { dx: 2, dy: 3 });
    const paddle = {
      id: 'paddle',
      positions: { x: 10, y: 500 },
      width: 100, height: 10,
      speed: { dx: 10, dy: 3 }
    };

    return { board, ball, paddle };
  };

  const main = () => {
    const game = initializeEntities();
    drawEntities(game);

    document.onkeydown = (event) => {
      movePaddle(game.paddle, game.board, event);
      animatePaddle(game.paddle);
    };

    const intervalId = setInterval(() => {
      game.ball.moveBall(game.board);
      animateBall(game.ball);
      stopIfGameOver(game, intervalId);
    }, 30);
  };

  window.onload = main;
})();
