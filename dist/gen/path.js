"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const free_swagger_client_1 = require("free-swagger-client");
const lodash_1 = require("lodash");
const RELATIVE_PATH = "./interface"; // interface 的相对路径
const genDisabledCode = (lang) => lang === "ts"
    ? `// @ts-nocheck \n/* eslint-disable */\n`
    : "/* eslint-disable */\n";
const genImportInterfaceCode = (apiCollection) => {
    const importsInterface = lodash_1.uniq(Object.keys(apiCollection)
        .map(key => apiCollection[key])
        .reduce((acc, cur) => [...acc, ...cur.imports], []));
    if (lodash_1.isEmpty(importsInterface))
        return "";
    return `import {${importsInterface.join(",")}} from "${RELATIVE_PATH}";`;
};
// 生成单个 ts 文件中的所有 api
const genPaths = (apiCollection, config) => {
    let code = "";
    code += genDisabledCode(config.lang);
    code += config.lang === "ts" ? genImportInterfaceCode(apiCollection) : "";
    code += config.customImportCode;
    code += Object.values(apiCollection)
        .map(api => free_swagger_client_1.genPath(api, config.template))
        .reduce((acc, cur) => acc + cur);
    return utils_1.formatCode(config.lang)(code);
};
exports.genPaths = genPaths;
