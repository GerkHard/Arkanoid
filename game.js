const KEYS = {
   LEFT: 37,
   RIGHT: 39,
   SPACE: 32
};

let game = {
   ctx: null,
   platform: null,
   ball: null,
   blocks: [],
   rows: 4,
   cols: 8,
   width: 640,
   height: 360,
   sprites: {
      bg: null, // null, потому что в этих свойствах мы ожидаем получить объект изображения
      ball: null,
      platform: null,
      block: null
   },
   init: function() {
      // init
      this.ctx = document.querySelector('#gameInterface').getContext('2d');
      this.setEvents();
   },
   setEvents() {
      window.addEventListener('keydown', e => {
         if (e.keyCode === KEYS.SPACE) {
            this.platform.fire();
         } else if (e.keyCode === KEYS.LEFT || e.keyCode === KEYS.RIGHT) {
            this.platform.start(e.keyCode);
         }
      });

      window.addEventListener('keyup', e => {
         if (e.keyCode === KEYS.LEFT || e.keyCode === KEYS.RIGHT) {
            this.platform.stop();
         }
      });
   },
   preload(callback) {
      // preload
      let loaded = 0;
      let required = Object.keys(this.sprites).length; // разобраться
      let onImgLoad = () => {
         ++loaded;
         if (loaded >= required) {
            callback(); // ?
         }
      };

      for (let key in this.sprites) { // ?
         this.sprites[key] = new Image();
         this.sprites[key].src = `./img/${key}.png`;
         this.sprites[key].addEventListener('load', onImgLoad);
      }
      
      /*this.background = new Image();
      this.background.src = 'img/bg.png';

      this.ball = new Image();
      this.ball.src = './img/ball.png';

      this.platform = new Image();
      this.platform.src = './img/ball.png';*/
   },
   createLevel() {
      for (let row = 0; row < this.rows; row++) {
         for (let col = 0; col < this.cols; col++) {
            this.blocks.push({
               x: 64 * col + 65,
               y: 24 * row + 35
            });
         }
      }
   },
   update() { // обновление игрового состояния
      this.platform.move();
      this.ball.move();
   },
   run() {
      // run
      window.requestAnimationFrame(() => {
         this.update();
         this.render();
         this.run();
      });
   },
   renderBlocks() {
      /*for (let block of this.blocks) {
         this.ctx.drawImage(this.sprites.block, block.x, block.y);
      }*/
      this.blocks.forEach(block => {
         this.ctx.drawImage(this.sprites.block, block.x, block.y);
      });
   },
   render() {
      // render
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(this.sprites.bg, 0, 0); // метод, который указывает контексту, что мы планируем отрисовать, 2-й и 3-й пареметры - координаты (левый верхний угол)
      this.ctx.drawImage(this.sprites.ball, 0, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
      this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
      this.renderBlocks();
   },
   start: function() {
      this.init();
      this.preload(() => {
         this.createLevel();
         this.run();
      });
      
   },
   random(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
   }
};

game.ball = {
   velocity: 3,
   dx: 0,
   dy: 0,
   x: 320,
   y: 280,
   width: 20,
   height: 20,
   start() {
       this.dy = this.velocity;
       this.dx = game.random(-this.velocity, this.velocity); // в диапазоне от -3 до +3
   },
   move() {
      if (this.dy) {
         this.y -= this.dy;
      }
      if (this.dx) {
         this.x += this.dx;
      }
   }
};

game.platform = {
   velocity: 6, // velocity for platform
   dx: 0, // current change for platform
   x: 280,
   y: 300,
   ball: game.ball,
   fire() {
      if (this.ball) { // запускать мячь мы можем только пока он есть на платформе, принадлежит этой платформе
         this.ball.start();
         this.ball = null;
      }
   },
   start(direction) {
      if (direction === KEYS.LEFT) {
         this.dx = -this.velocity;
      } else if (direction === KEYS.RIGHT) {
         this.dx = this.velocity;
      }
   },
   stop() {
      this.dx = 0;
   },
   move() {
      if (this.dx) { // проверяем движется ли платформа
         this.x += this.dx;
         if (this.ball) {
            this.ball.x += this.dx;
         }
      }
   }
};

window.addEventListener('load', () => {
   game.start();
});