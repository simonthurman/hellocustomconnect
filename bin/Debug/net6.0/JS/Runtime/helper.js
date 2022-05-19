//-----------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------

let url = require('url');
let CustomError = require('./customError.js');
let ErrorCode = require('./customError.js').ErrorCode;

function getApiVersion(req) {
    var queryParams = url.parse(req.url, true).query;
    return queryParams["api-version"];
}

function createResponse(context, status, body) {
    context.res = {
        status: status ? status : 200,
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

function createErrorResponse(context, errorRes) {
    var errorCode = errorRes instanceof CustomError
        ? errorRes.code == ErrorCode.InternalFailure ? 500 : 400
        : 500
    return createResponse(context, errorCode, errorRes);
}

module.exports.getApiVersion = getApiVersion
module.exports.createResponse = createResponse
module.exports.createErrorResponse = createErrorResponse