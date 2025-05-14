import {name} from "eslint-config-prettier/flat";

export class Log {
  static info(name, description, code) {
    console.log(`[LOG::INFO] -- { name: "${name}", description: "${description}", code: "${code}" }`);
  }

  static warn(name, description, code) {
    console.warn(`[LOG::WARN] -- { name: "${name}", description: "${description}", code: "${code}" }`);
  }

  static error(name, description, code) {
    console.error(`[LOG::ERROR] -- { name: "${name}", description: "${description}", code: "${code}" }`);
  }
}
