//-----------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------

var esprima = require('esprima');
var estraverse = require('estraverse');
let CustomError = require('./customError.js');
let ErrorCode = require('./customError.js').ErrorCode;

module.exports = function calculateDependencies(actionName, userCode) {
    return calculateDependenciesV1(actionName, userCode);
}

function calculateDependenciesV1(actionName, userCode) {
    var tree;
    try {
        tree = esprima.parseScript(`function outsideFunction() { ${userCode} }`).body[0].body;
    } catch (error) {
        throw new CustomError(ErrorCode.ParsingFailure, error.message, null, actionName)
    }

    var workflowContextVariables = [];
    var actionsVariables = [];
    var dependentActions = new Set([]);
    var includeTrigger = false;

    for (let i = 0; i < tree.body.length; i++) {
        var item = tree.body[i];
        var varDeclaration = item.declarations != null && item.declarations.length === 1 && item.declarations[0].type === 'VariableDeclarator' ? item.declarations[0] : null;
        if (varDeclaration != null && varDeclaration.init != null && varDeclaration.init.type === 'Identifier' && varDeclaration.init.name === 'workflowContext') {
            workflowContextVariables.push(varDeclaration.id.name);
        }
        else if (varDeclaration != null &&
            varDeclaration.init != null &&
            varDeclaration.init.type === 'MemberExpression' &&
            varDeclaration.init.object != null &&
            varDeclaration.init.object.type === 'Identifier' &&
            varDeclaration.init.object.name === 'workflowContext' &&
            varDeclaration.init.property != null &&
            varDeclaration.init.property.type === 'Identifier' &&
            varDeclaration.init.property.name === 'actions') {
                actionsVariables.push(varDeclaration.id.name);
        }
    }

    estraverse.traverse(tree, {
        enter: function (node) {
            if (node.type === 'MemberExpression') {
                if (node.object != null && node.object.type === 'Identifier') {
                    if (actionsVariables.includes(node.object.name)) {
                        dependentActions.add(node.property.name);
                    }
                    else if (node.object.name === "workflowContext" && node.property.name === "trigger") {
                        includeTrigger = true;
                    }
                }
                else if (node.object != null &&
                    node.object.type === 'MemberExpression' &&
                    node.object.object != null &&
                    node.object.object.type === 'Identifier' &&
                    (workflowContextVariables.includes(node.object.object.name) || node.object.object.name === 'workflowContext') &&
                    node.object.property.type === 'Identifier' &&
                    node.object.property.name === 'actions') {
                        dependentActions.add(node.property.name)
                }
            }
        }
    });

    return {
        actions: Array.from(dependentActions).filter(Boolean),
        includeTrigger: includeTrigger
    };
}