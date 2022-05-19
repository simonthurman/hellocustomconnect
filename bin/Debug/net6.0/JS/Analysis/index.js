//-----------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------

let helper = require('./helper.js');
let calculateDependencies = require('./userCodeDependencyHandler.js');
let timeoutDurationInMilliseconds = process.argv[3];
let timeout = setTimeout(() => process.kill(process.pid, 'SIGTERM'), timeoutDurationInMilliseconds);

const http = require('http');
const server = http.createServer((req, res) => {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => process.kill(process.pid, 'SIGTERM'), timeoutDurationInMilliseconds);
        body = JSON.parse(Buffer.concat(body).toString());

        // NOTE(hongzli): Use context object here to mimic v1 function app behavior to share helper code.
        let context = {};
        try {
            helper.createResponse(context, null, calculateDependencies(body['actionName'], body['javascriptCode']));
            res.writeHead(context.res.status, context.res.headers);
            res.end(JSON.stringify(context.res.body));
        }
        catch (errorRes) {
            helper.createErrorResponse(context, errorRes);
            res.writeHead(context.res.status, context.res.headers);
            res.end(JSON.stringify(context.res.body));
        }
    });
});

server.listen(process.argv[2], 'localhost', () => {
    console.log(`Node language worker running at http://localhost:${server.address().port}/`);
});

process.on('SIGTERM', () => {
    server.close();
})