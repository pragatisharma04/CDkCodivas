"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTestStage = exports.isProdStage = exports.print = exports.GammaStageName = exports.ProdStageName = void 0;
exports.ProdStageName = 'prod';
exports.GammaStageName = 'gamma';
function print(logStatement) {
    console.log('\x1b[35m%s\x1b[0m', logStatement);
}
exports.print = print;
function isProdStage(stage) {
    return exports.ProdStageName === stage;
}
exports.isProdStage = isProdStage;
function isTestStage(stage) {
    return exports.ProdStageName !== stage && exports.GammaStageName !== stage;
}
exports.isTestStage = isTestStage;
