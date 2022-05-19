//-----------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------
let CustomError = require('./customError.js');
let ErrorCode = require('./customError.js').ErrorCode;

module.exports = function getFunctionInfo(functionReq) {
    const operationHandler = {
        set: function (target, property, value) {
            throw new CustomError(ErrorCode.CannotModifyWorkflowContext, "Cannot modify workflowContext");
        },
        defineProperty: function (inputObject, property, desc) {
            throw new CustomError(ErrorCode.CannotModifyWorkflowContext, "Cannot modify workflowContext");
        },
        get: function (inputObject, property) {
            if (property === null || typeof (property) === "symbol") {
                return;
            }

            if (property in inputObject) {
                return inputObject[property];
            }

            throw new CustomError(ErrorCode.OperationMissing, `The specified action '${property}' is not in the provided workflowContext. Try including the action by adding it to explicitDependency.actions.`);
        }
    };

    const baseHandler = {
        set: function (target, property, value) {
            throw new CustomError(ErrorCode.CannotModifyWorkflowContext, "Cannot modify workflowContext");
        },
        defineProperty: function (inputObject, property, desc) {
            throw new CustomError(ErrorCode.CannotModifyWorkflowContext, "Cannot modify workflowContext");
        },
        get: function (inputObject, property) {
            if (property === null || typeof(property) === "symbol") {
                return;
            }

            if (property === "actions") {
                var operationDependency = inputObject[property];
                if (!(operationDependency instanceof Object)) {
                    throw new CustomError(ErrorCode.OperationMissing, "Actions are not in the provided workflowContext. Try including the action by adding it to explicitDependency.actions.");
                }
                return new Proxy(operationDependency, operationHandler);
            }

            if (property === "workflow") {
                var workflow = inputObject[property];
                if (!(workflow instanceof Object)) {
                    throw new CustomError(ErrorCode.InternalFailure, "The workflowContext.workflow property is not an object.");
                }
                return workflow;
            }

            if (property === "trigger") {
                var trigger = inputObject[property];
                if (!(trigger instanceof Object)) {
                    throw new CustomError(ErrorCode.OperationMissing, "The trigger is not in the provided workflowContext. Try including the trigger by setting the actions explicitDependency.includeTrigger input property to true.");
                }
                return trigger;
            }

            throw new CustomError(ErrorCode.InvalidProperty, `The specified property '${property}' is not in the provided workflowContext, only workflowContext.workflow, workflowContext.actions and workflowContext.trigger are accessible.`);
        }
    };

    if (!(functionReq.body["workflowContext"] instanceof Object)) {
        throw new CustomError(ErrorCode.InternalFailure, "The workflowContext was not provided in the request.");
    }

    // NOTE (refortie): Default to 5s timeout
    this.executionTimeout = functionReq.body["executionTimeoutInMilliseconds"] || 5000;
    this.requiredNodeModules = functionReq.body["requiredLibraries"] || [];
    this.functionDefinition = functionReq.body["userCode"];
    this.workflowContext = new Proxy(functionReq.body["workflowContext"], baseHandler);
}