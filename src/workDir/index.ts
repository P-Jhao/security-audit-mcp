import { join } from "node:path";
import { getDirname, getUUID } from "../utils";
import fs from "fs"



const __dirname = getDirname(import.meta.url) //获取当前文件的目录名

const basePath = join(__dirname, '../..') // 获取到上两级的目录

const workPath = join(basePath, 'work') // 定义工作目录路径

fs.mkdirSync(workPath, {recursive:true}) // 确保工作目录存在

export async function createWorkDir(){
    const workDir = join(workPath, getUUID())
    await fs.promises.mkdir(workDir, {recursive:true})
    return workDir
}

export async function deleteWorkDir(workDir:string){
    await fs.promises.rm(workDir, {recursive:true}) //删除工作目录
}