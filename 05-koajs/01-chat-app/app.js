const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = Object.create(null);


router.get('/subscribe', async (ctx, next) => {
    let id = ctx.query.r;
    subscribers[id] = ctx;

    const response = await promise;

    for (id in subscribers) {
        ctx.body = response;
    }
    subscribers = Object.create(null);


});

let promise = new Promise((resolve) => {router.post('/publish', async (ctx, next) => {
        const message = ctx.request.body.message;
        resolve(message);
});
});

app.use(router.routes());

module.exports = app;
