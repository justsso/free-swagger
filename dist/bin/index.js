#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const commander_1 = __importDefault(require("commander"));
const main_1 = __importDefault(require("../main"));
const rc_1 = require("../default/rc");
const questions_1 = require("./questions");
const packageJsonPath = path_1.default.resolve(__dirname, "../../package.json");
const pkg = JSON.parse(fs_extra_1.default.readFileSync(packageJsonPath, "utf-8")); // package.json
commander_1.default
    .version(pkg.version)
    .usage("")
    .option("-r --reset", "rest config", () => {
    rc_1.rc.reset();
    console.log(chalk_1.default.green("重置配置项成功"));
    return;
})
    .option("-s --show", "show config", () => {
    console.log(rc_1.rc.data);
    return;
})
    .option("-c, --config", "launch free-swagger under config mode", () => __awaiter(void 0, void 0, void 0, function* () {
    const { data: defaultAnswer } = rc_1.rc;
    // 获取用户回答
    const answer = yield inquirer_1.default.prompt([
        questions_1.source,
        {
            name: "root",
            message: "输入导出 api 的根路径",
            default: defaultAnswer.root,
            validate: (input) => input ? true : "请输入 api 根路径"
        },
        {
            name: "lang",
            type: "list",
            message: "选择导出 api 的语言",
            default: defaultAnswer.lang,
            choices: ["ts", "js"]
        },
        {
            name: "shouldEditTemplate",
            type: "list",
            default: "n",
            choices: ["y", "n"],
            message: "是否需要编辑模版"
        },
        {
            name: "template",
            type: "editor",
            message: "输入模版",
            when: ({ shouldEditTemplate }) => shouldEditTemplate === "y",
            validate: (input, answer) => {
                if (!answer)
                    return false;
                rc_1.rc.merge(answer.lang === "ts" ? { tsTemplate: input } : { jsTemplate: input });
                return true;
            },
            default: (answer) => answer.lang === "ts"
                ? defaultAnswer.tsTemplate
                : defaultAnswer.jsTemplate
        },
        {
            name: "customImportCode",
            message: `输入自定义头语句(${chalk_1.default.magenta("自定义请求库路径")})`,
            default: (answer) => answer.lang === "ts"
                ? defaultAnswer.customImportCodeTs
                : defaultAnswer.customImportCodeJs,
            validate: (input) => input ? true : "请输入默认头语句"
        }
    ]);
    rc_1.rc.merge(answer);
    rc_1.rc.save();
    yield main_1.default.compile(rc_1.rc.getConfig());
}))
    // 默认启动
    .action((command) => __awaiter(void 0, void 0, void 0, function* () {
    if (command.rawArgs[2])
        return;
    const answer = yield inquirer_1.default.prompt([questions_1.source]);
    rc_1.rc.merge(answer);
    rc_1.rc.save();
    yield main_1.default.compile(rc_1.rc.getConfig());
    return;
}))
    .parse(process.argv);
