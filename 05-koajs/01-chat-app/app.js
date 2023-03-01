const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const { result } = require('lodash');
const router = new Router();

/**let subscribers = Object.create(null);


router.get('/subscribe', async (ctx, next) => {
    await promise;
    let resp = promise;
    ctx.body = resp;

});

let promise = new Promise((resolve) => {router.post('/publish', async (ctx, next) => {
    let message = ctx.request.body.message;
    resolve(message);
    });
})
*/
const clients = new Set();
router.get('/subscribe', async (ctx, next) => {
    const message = await new Promise((resolve, reject) => {
      clients.add(resolve);
  
      ctx.res.on('close', function() {
        clients.delete(resolve);
        resolve();
      });
    });
  
    ctx.body = message;
  });

  router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body.message;
  
    if (!message) {
      ctx.throw(400, 'required field `message` is missing');
    }
  
    clients.forEach(resolve => {
      resolve(message);
    });
  
    clients.clear();
  
    ctx.body = 'ok';
  });

app.use(router.routes());

module.exports = app;
