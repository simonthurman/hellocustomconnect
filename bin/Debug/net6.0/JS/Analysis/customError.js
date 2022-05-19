//-----------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------

class CustomError extends Error {
    constructor(errorType, message, trace, actionName, ...args) {
        super(...args);
        Error.captureStackTrace(this, CustomError);
        this.code = errorType;
        this.message = message;
        this.trace = trace;
        this.actionName = actionName;
    }
}

const ErrorCode = {
    CannotModifyWorkflowContext: "InlineCodeCannotModifyWorkflowContext",
    ExecutionTimeout: "InlineCodeExecutionTimeout",
    InternalFailure: "InlineCodeInternalFailure",
    InvalidProperty: "InlineCodeInvalidProperty",
    OperationMissing: "InlineCodeOperationMissing",
    ParsingFailure: "InlineCodeParsingFailure",
    ScriptRuntimeFailure: "InlineCodeScriptRuntimeFailure"
};

module.exports = CustomError
module.exports.ErrorCode = ErrorCode
