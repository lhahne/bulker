import * as restify from 'restify';

const server = restify.createServer();

server.get('/', (req, res, next) => {
   res.send('hi');
    next();
});

const port = 9000;

server.listen(port, () => {
    console.log(`${server.name} listening at ${server.url}`);
});
