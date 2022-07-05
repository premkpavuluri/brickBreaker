(function () {
  const px = (value) => `${value}px`;

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

  class Paddle {
    #id;
    #position;
    #width;
    #height;
    #speed;

    constructor(id, position, width, height, speed) {
      this.#id = id;
      this.#position = position;
      this.#width = width;
      this.#height = height;
      this.#speed = speed;
    }

    movePaddle(direction, board) {
      const { left, right } = board;

      if (direction === 'left' && this.#position.x > left) {
        this.#position.x -= this.#speed.dx;
      }

      if (direction === 'right' && this.#position.x + this.#width < right) {
        this.#position.x += this.#speed.dx;
      }
    }

    getDetails() {
      const { x, y } = this.#position;
      const { dx, dy } = this.#speed;

      return {
        id: this.#id,
        position: { x, y },
        speed: { dx, dy },
        height: this.#height,
        width: this.#width
      }
    }
  }

  const translateKeys = (key) => {
    const keys = {
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'ArrowDown': 'down',
      'ArrowUp': 'up'
    }

    return keys[key];
  };

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

  const drawPaddle = (paddle, board) => {
    const { id, position: { x, y }, width, height } = paddle.getDetails();
    const paddleElement = document.createElement('div');

    paddleElement.id = id;
    paddleElement.style.width = px(width);
    paddleElement.style.height = px(height);
    paddleElement.style.left = x;
    paddleElement.style.top = y;
    board.appendChild(paddleElement);
  };

  const animatePaddle = (paddle) => {
    const { id, position: { x, y } } = paddle.getDetails();

    const paddleElement = document.getElementById(id);
    paddleElement.style.left = x;
    paddleElement.style.top = y;
  };

  const isGameOver = ({ paddle, ball }) => {
    const { position: { x, y }, width } = paddle.getDetails();
    const rangeEnd = x + width;
    const { positions, dia } = ball.getDetails();

    const isBallInRange = positions.x > x && positions.x < rangeEnd;

    if (positions.y + dia >= y && !isBallInRange) {
      return true;
    }

    return false;
  };

  const displayGameOverMessage = (board) => {
    const promtElement = document.createElement('h2');
    const boardEle = document.getElementById(board.id);

    promtElement.id = 'game-over';
    promtElement.innerText = 'Game Over';
    boardEle.appendChild(promtElement);
  };

  const stopIfGameOver = (game, intervalId) => {
    if (isGameOver(game)) {
      displayGameOverMessage(game.board);
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
    const paddle = new Paddle('paddle',
      { x: 10, y: 500 },
      100, 10,
      { dx: 10, dy: 3 });

    return { board, ball, paddle };
  };

  const main = () => {
    const game = initializeEntities();
    drawEntities(game);

    document.onkeydown = (event) => {
      game.paddle.movePaddle(translateKeys(event.code), game.board);
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
