import { formatCode } from "../utils";
import { InterfaceCollection } from "../parse/interface";

const genInterfaces = (interfaces: InterfaceCollection): string[] =>
  Object.entries(interfaces).map(([name, props]) =>
    formatCode(` 
    export interface ${name} {
        ${Object.entries(props).map(
          ([propName, prop]) =>
            `
            ${propName} ${prop.required ? "" : "?"}: ${
              prop.type
            }  ${prop.description && `// ${prop.description}`}
            `
        )}
      }
      `)
  );

export { genInterfaces };