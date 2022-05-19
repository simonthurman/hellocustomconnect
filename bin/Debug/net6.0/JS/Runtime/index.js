//-----------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------

let helper = require('./helper.js');
let CustomError = require('./customError.js');
let ErrorCode = require('./customError.js').ErrorCode;
let FunctionInputHandler = require('./functionInputHandler.js');
let vm = require('vm');

module.exports = async function (context, req) {
    var startTime = process.hrtime();
    try {
        var response = {
            userOutput: executeUserFunctionV1(req)
        };
        context.bindings.JavaScriptOutput = updateResponseWithMetadata(response);
    }
    catch (errorRes) {
        var errorResponse = {
            errorMessage: errorRes
        };
        context.bindings.JavaScriptOutput = updateResponseWithMetadata(errorResponse)
    }

    // NOTE (hongzli): Sets the elapsed time of user function execution.
    function updateResponseWithMetadata(inputObject) {
        inputObject.elapsedTimeInMilliseconds = convertElapsedTimeToMilliseconds(process.hrtime(startTime));
        inputObject.activityId = req.activityId
        return inputObject;
    }

    // NOTE (hongzli): Executes the users code inside a sandbox function that is provided the workflowContext results.
    function executeUserFunctionV1(req) {
        var inputHandler = new FunctionInputHandler(req);
        try {
            'use strict';
            var func = new Function('workflowContext', inputHandler.functionDefinition);
            var script = new vm.Script("(" + func.toString() + ")(workflowContext);");
            return script.runInNewContext(getSandboxContext(inputHandler), { timeout: inputHandler.executionTimeout });
        }
        catch (err) {
            if (err instanceof CustomError) {
                throw err;
            }

            // NOTE (hongzli): Error code isn't being set for timeouts, we need to rely on message
            if (err.message === "Script execution timed out.") {
                throw new CustomError(ErrorCode.ExecutionTimeout, err.message, err.stack);
            }

            throw new CustomError(ErrorCode.ScriptRuntimeFailure, err.message, err.stack);
        }
    }

    // NOTE (hongzli): Gets the properties and modules that will be available in the vm sandbox.
    function getSandboxContext(inputHandler) {
        var sandbox = {
            workflowContext: inputHandler.workflowContext
        };

        // NOTE (hongzli): Mapping module name to var name.
        inputHandler.requiredNodeModules.forEach(function (module) {
            eval("var " + module + " = require('" + module + "');");
            sandbox[module] = eval(module);
        });

        return sandbox;
    }

    // NOTE (hongzli): Converts the elapsed running time of the function to ms.
    function convertElapsedTimeToMilliseconds(elapsed) {
        return ((elapsed[0] * 1000) + (elapsed[1] / 1000000)).toFixed();
    }
};
