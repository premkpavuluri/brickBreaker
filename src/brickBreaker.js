(function () {
  const px = (value) => `${value}px`;

  class View {
    #id;
    #top;
    #left;
    #bottom;
    #right;

    constructor(id, top, left, bottom, right) {
      this.#id = id;
      this.#top = top;
      this.#left = left;
      this.#bottom = bottom;
      this.#right = right;
    }

    isAtLeftEdge({ x, y }) {
      return x <= this.#left;
    }

    isAtRightEdge({ x, y }) {
      return x >= this.#right;
    }

    isAtTopEdge({ x, y }) {
      return y <= this.#top;
    }

    isAtBottomEdge({ x, y }) {
      return y >= this.#bottom;
    }

    getDetails() {
      return {
        id: this.#id,
        top: this.#top,
        bottom: this.#bottom,
        left: this.#left,
        right: this.#right
      }
    }
  }

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

    move(view) {
      this.#positions.y += this.#speed.dy;
      this.#positions.x += this.#speed.dx;
      const { x, y } = this.#positions;
      const maxX = x + this.#dia;
      const maxY = y + this.#dia;

      if (view.isAtLeftEdge({ x, y }) || view.isAtRightEdge({ x: maxX, y })) {
        this.#speed.dx = -this.#speed.dx;
      }

      if (view.isAtTopEdge({ x, y }) || view.isAtBottomEdge({ x, y: maxY })) {
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

    move(direction, view) {
      const { x, y } = this.#position;
      const maxX = x + this.#width;

      if (direction === 'left' && !view.isAtLeftEdge({ x, y })) {
        this.#position.x -= this.#speed.dx;
      }

      if (direction === 'right' && !view.isAtRightEdge({ x: maxX, y })) {
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

  const drawView = (view, viewElement) => {
    const { top, bottom, left, right } = view.getDetails();

    viewElement.style.height = px((bottom - top));
    viewElement.style.width = px((right - left));
    viewElement.style.left = px(left);
    viewElement.style.top = px(top);

    return true;
  };

  const createBall = (ball, view) => {
    const { id, positions: { x, y } } = ball.getDetails();
    const ballElement = document.createElement('div');

    ballElement.id = id;
    ballElement.className = 'ball';
    ballElement.style.left = px(x);
    ballElement.style.top = px(y);
    view.appendChild(ballElement);

    return;
  };

  const animateBall = (ball) => {
    const { id, positions: { x, y } } = ball.getDetails();

    const ballElement = document.getElementById(id);
    ballElement.style.left = x;
    ballElement.style.top = y;

    return true;
  };

  const drawPaddle = (paddle, view) => {
    const { id, position: { x, y }, width, height } = paddle.getDetails();
    const paddleElement = document.createElement('div');

    paddleElement.id = id;
    paddleElement.style.width = px(width);
    paddleElement.style.height = px(height);
    paddleElement.style.left = x;
    paddleElement.style.top = y;
    view.appendChild(paddleElement);
  };

  const animatePaddle = (paddle) => {
    const { id, position: { x, y } } = paddle.getDetails();

    const paddleElement = document.getElementById(id);
    paddleElement.style.left = x;
    paddleElement.style.top = y;
  };

  const isGameOver = ({ paddle, ball }) => {
    const { position: { x, y }, width } = paddle.getDetails();
    const { positions, dia } = ball.getDetails();
    const rangeEnd = x + width;

    const isBallInRange = positions.x > x && positions.x < rangeEnd;

    if (positions.y + dia >= y && !isBallInRange) {
      return true;
    }

    return false;
  };

  const displayGameOverMessage = (view) => {
    const promtElement = document.createElement('h2');
    const boardEle = document.getElementById(view.getDetails().id);

    promtElement.id = 'game-over';
    promtElement.innerText = 'Game Over';
    boardEle.appendChild(promtElement);
  };

  const stopIfGameOver = (game, intervalId) => {
    if (isGameOver(game)) {
      displayGameOverMessage(game.view);
      clearInterval(intervalId);
    }
  };

  const drawEntities = (game) => {
    const viewElement = document.getElementById(game.view.getDetails().id);
    drawView(game.view, viewElement);
    createBall(game.ball, viewElement);
    drawPaddle(game.paddle, viewElement);
  };

  const initializeEntities = () => {
    const view = new View('board', 0, 0, 500, 500);
    const ball = new Ball('ball-1', { x: 100, y: 100 }, 20, { dx: 2, dy: 3 });
    const paddle = new Paddle('paddle',
      { x: 10, y: 500 },
      100, 10,
      { dx: 10, dy: 3 });

    return { view, ball, paddle };
  };

  const main = () => {
    const game = initializeEntities();
    drawEntities(game);

    document.onkeydown = (event) => {
      game.paddle.move(translateKeys(event.code), game.view);
      animatePaddle(game.paddle);
    };

    const intervalId = setInterval(() => {
      game.ball.move(game.view);
      animateBall(game.ball);
      stopIfGameOver(game, intervalId);
    }, 15);
  };

  window.onload = main;
})();
