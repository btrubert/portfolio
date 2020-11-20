import fs from 'fs'
import { join } from 'path'

export function getTranslation(namespace: string, language: string) {
    const directory = join(process.cwd(), `/src/locales/${language}`)
    const fullPath = join(directory, `${namespace}.json`)
    const content = fs.readFileSync(fullPath, 'utf8')
    return content
}