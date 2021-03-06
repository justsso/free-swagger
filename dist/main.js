"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const camelcase_1 = __importDefault(require("camelcase"));
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const default_1 = require("./default");
const inquirer_1 = require("./inquirer");
const lodash_1 = require("lodash");
const path_2 = require("./parse/path");
const free_swagger_client_1 = require("free-swagger-client");
const path_3 = require("./gen/path");
const utils_2 = require("./utils");
// import { Change } from "diff";
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const diff = require("diff");
// parse swagger json
const parse = (config) => __awaiter(void 0, void 0, void 0, function* () {
    yield utils_1.ensureExist(config.root, true);
    const paths = path_2.parsePaths(config.source.paths);
    return { paths };
});
// code generate
const gen = (config, dirPath, paths) => __awaiter(void 0, void 0, void 0, function* () {
    // 生成 interface
    if (config.lang === "ts") {
        const interfacePath = path_1.default.resolve(dirPath, "interface.ts");
        yield utils_1.ensureExist(interfacePath);
        const code = free_swagger_client_1.compileInterfaces({
            source: config.source,
            prettier: utils_2.formatCode("ts")
        });
        yield fs_extra_1.default.writeFile(interfacePath, code);
    }
    // const diffObj: any = {};
    // 生成 api
    Object.entries(paths).forEach(([name, apiCollection]) => __awaiter(void 0, void 0, void 0, function* () {
        const apiCollectionPath = path_1.default.resolve(dirPath, `${camelcase_1.default(name)}.${config.lang}`);
        yield utils_1.ensureExist(apiCollectionPath);
        const code = path_3.genPaths(apiCollection, config);
        // todo diff
        // const previousCode = await fse.readFile(apiCollectionPath, "utf-8");
        // diffObj[name] = diff
        //   .diffChars(previousCode, code)
        //   .filter((part: Change) => part.added || part.removed);
        yield fs_extra_1.default.writeFile(apiCollectionPath, code);
        // return diffObj;
    }));
});
const fetchJSON = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = ora_1.default().render();
    spinner.start(`正在发送请求到: ${url}`);
    try {
        const { data } = yield axios_1.default.get(url);
        spinner.succeed("请求结束");
        return data;
    }
    catch (e) {
        spinner.fail("请求失败");
        throw new Error(e);
    }
});
// compile = parse + gen
const compile = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = ora_1.default().render();
    if (utils_1.isUrl(config.source)) {
        config.source = yield fetchJSON(config.source);
    }
    if (utils_1.isPath(config.source)) {
        const sourcePath = path_1.default.resolve(process.cwd(), config.source);
        config.source = JSON.parse(yield fs_extra_1.default.readFile(sourcePath, "utf-8"));
    }
    if (!utils_1.isOpenApi2(config)) {
        throw new Error("free-swagger 暂时不支持 openApi3 规范，请使用 openApi2 规范的文档");
    }
    spinner.start("正在生成 api 文件...");
    yield utils_1.ensureExist(config.root, true);
    // parse
    const { paths } = yield parse(config);
    spinner.succeed("api 文件解析完成");
    const choosePaths = config.chooseAll
        ? paths
        : lodash_1.pick(paths, ...(yield inquirer_1.chooseApi(paths)));
    // gen
    yield gen(config, config.root, choosePaths);
    spinner.succeed(`api 文件生成成功，文件根目录地址: ${chalk_1.default.green(config.root)}`);
    return config.source;
});
// freeSwagger = merge + compile
const freeSwagger = (config) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = ora_1.default().render();
    try {
        const mergedConfig = yield default_1.mergeDefaultConfig(config);
        return yield compile(mergedConfig);
    }
    catch (e) {
        spinner.fail(`${chalk_1.default.red("api 文件生成失败")}`);
        throw new Error(e);
    }
});
freeSwagger.compile = compile;
module.exports = freeSwagger;
