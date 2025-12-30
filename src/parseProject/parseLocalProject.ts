import path from "node:path";
import fs from "node:fs"

export async function parseLocalProject(projectRoot:string){
    const packageJsonPath = path.join(projectRoot, "package.json")    
    const json = await fs.promises.readFile(packageJsonPath, "utf-8")
    return JSON.parse(json)
}