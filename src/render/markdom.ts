import ejs from "ejs";
import { join } from "node:path";
import { getDirname } from "../utils";

const templatePath = join(getDirname(import.meta.url), "./template/index.ejs");

export async function renderMarkdown(data: any) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, data, (err, str) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(str);
    });
  });
}
