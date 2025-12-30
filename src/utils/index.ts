import {dirname} from "path"
import {fileURLToPath} from "url"
import {randomUUID} from "crypto"

export function getDirname(importMetaUrl:string){
    return dirname(getFilename(importMetaUrl))    
}

export function getFilename(importMetaUrl:string){
    return fileURLToPath(importMetaUrl)
}


/**
 * 生成一个随机的 UUID v4
 * @returns {string} 格式如：550e8400-e29b-41d4-a716-446655440000
 */
export function getUUID(): string {
  return randomUUID()
}