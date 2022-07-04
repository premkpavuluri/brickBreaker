(function () {
  const px = (value) => `${value}px`;

  const drawBoard = (board, boardEle) => {
    const { top, bottom, left, right } = board;

    boardEle.style.height = px((bottom - top));
    boardEle.style.width = px((right - left));
    boardEle.style.left = px(left);
    boardEle.style.top = px(top);

    return;
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

    return;
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
      const width = right - left;
      const height = bottom - top;
      this.#positions.y += this.#speed.dy;
      this.#positions.x += this.#speed.dx;

      if (this.#positions.x < 0 || this.#positions.x + this.#dia > width) {
        this.#speed.dx = -this.#speed.dx;
      }

      if (this.#positions.y < 0 || this.#positions.y + this.#dia > height) {
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
    paddleElement.style.top = y - 10;
    board.appendChild(paddleElement);
  };

  const movePaddle = (paddle, board, event) => {
    const isLeftArrow = event.code === 'ArrowLeft';
    const isRightArrow = event.code === 'ArrowRight';
    const { positions: { x, y }, width } = paddle;
    const { left, right } = board;

    if (isLeftArrow && x > 0) {
      paddle.positions.x -= paddle.speed.dx;
    }

    if (isRightArrow && x + width < (right - left)) {
      paddle.positions.x += paddle.speed.dx;
    }
  };

  const animatePaddle = (paddle) => {
    const { id, positions: { x, y } } = paddle;

    const paddleElement = document.getElementById(id);
    paddleElement.style.left = x;
  };

  const initializeEntities = () => {
    const board = { id: 'board', top: 200, left: 200, bottom: 500, right: 500 };
    const ball = new Ball('ball-1', { x: 100, y: 100 }, 20, { dx: 2, dy: 3 });
    const paddle = {
      id: 'paddle',
      positions: { x: 10, y: 310 },
      width: 50, height: 10,
      speed: { dx: 10, dy: 3 }
    };

    return { board, ball, paddle };
  };

  const isGameOver = ({ board, paddle, ball }) => {
    const rangeStart = paddle.positions.x;
    const rangeEnd = rangeStart + paddle.width;
    const { positions, dia } = ball.getDetails();

    if (positions.y + dia >= paddle.positions.y - paddle.height) {
      if (!(rangeStart < positions.x && rangeEnd > positions.x)) {
        alert('Lost');
      }
    }
  };

  const main = () => {
    const game = initializeEntities();

    const boardElement = document.getElementById(game.board.id);
    drawBoard(game.board, boardElement);
    createBall(game.ball, boardElement);
    drawPaddle(game.paddle, boardElement);

    document.onkeydown = (event) => {
      movePaddle(game.paddle, game.board, event);
      animatePaddle(game.paddle);
      console.log(game.paddle);
    };

    const intervalId = setInterval(() => {
      game.ball.moveBall(game.board);
      animateBall(game.ball);
      isGameOver(game);
    }, 50);

    // setTimeout(() => clearInterval(intervalId), 10000);
  };

  window.onload = main;
})();
