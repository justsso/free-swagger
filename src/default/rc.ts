import path from "path";
import os from "os";
import fse from "fs-extra";
import prettier from "prettier";
import { jsTemplate, tsTemplate } from "./template";
import { Template } from "../utils";

export interface Answer {
  previousSource?: string;
  source?: string;
  root?: string;
  customImportCode?: string;
  lang?: "js" | "ts";
  shouldEditTemplate: "y" | "n";
  jsTemplate: string;
  tsTemplate: string;
  template?: Template;
  apiChoices: { name: string; checked: boolean }[];
}

class Rc {
  path: string;
  data: Answer;

  constructor() {
    const homedir = os.homedir();
    this.path = path.resolve(homedir, ".free-swaggerrc");
    const data = fse.readFileSync(this.path, "utf-8") || "{}";
    this.data = { ...this.getDefault(), ...JSON.parse(data) };
  }
  getDefault(): Answer {
    return {
      source: undefined,
      root: `${path.resolve(process.cwd(), "src/api")}`,
      lang: "ts",
      shouldEditTemplate: "n",
      customImportCode: `import axios from "axios";`,
      template: tsTemplate,
      tsTemplate: `${tsTemplate}`,
      jsTemplate: `${jsTemplate}`,
      apiChoices: []
    };
  }
  merge(answer: Partial<Answer>): void {
    this.data = { ...this.data, ...answer };
  }
  // 生成本次输入的所有回答并存储进 rc
  save(): void {
    fse.writeFileSync(
      this.path,
      prettier.format(JSON.stringify(this.data), {
        parser: "json"
      })
    );
  }
  // 记录当前 source 和之前的 source
  // 对比两者判断是否需要清空用户选择的 api 缓存记录
  recordHash(newSource?: string): void {
    this.data.previousSource = this.data.source;
    this.data.source = newSource;
  }
  refreshCache(): boolean {
    return this.data.previousSource !== this.data.source;
  }
}

export const rc = new Rc();