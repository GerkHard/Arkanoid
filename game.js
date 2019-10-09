let game = {
   ctx: null,
   platform: null,
   ball: null,
   sprites: {
      bg: null, // null, потому что в этих свойствах мы ожидаем получить объект изображения
      ball: null,
      platform: null
   },
   init: function() {
      // init
      this.ctx = document.querySelector('#gameInterface').getContext('2d');
   },
   preload(callback) {
      // preload
      let loaded = 0;
      let required = Object.keys(this.sprites).length; // разобраться
      for (let key in this.sprites) { // ?
         this.sprites[key] = new Image();
         this.sprites[key].src = `./img/${key}.png`;
         this.sprites[key].addEventListener('load', () => {
            ++loaded;
            if (loaded >= required) {
               callback();
            }
         });
      }
      
      /*this.background = new Image();
      this.background.src = 'img/bg.png';

      this.ball = new Image();
      this.ball.src = './img/ball.png';

      this.platform = new Image();
      this.platform.src = './img/ball.png';*/
   },
   run() {
      // run
      window.requestAnimationFrame(() => {
         this.render();
      });
   },
   render() {
      // render
      this.ctx.drawImage(this.sprites.bg, 0, 0); // метод, который указывает контексту, что мы планируем отрисовать, 2-й и 3-й пареметры - координаты (левый верхний угол)
      this.ctx.drawImage(this.sprites.ball, 0, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
      this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
   },
   start: function() {
      this.init();
      this.preload(() => {
         this.run();
      });
      
   }
};

game.ball = {
   x: 320,
   y: 280,
   width: 20,
   height: 20
};

game.platform = {
   x: 280,
   y: 300
};

window.addEventListener('load', () => {
   game.start();
});