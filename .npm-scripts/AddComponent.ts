import { exec } from "node:child_process"
import { rename } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url))

// modify this to match the path of your ui components folder (relative to this file)
const base = resolve(__dirname, "..", "src", "shared", "components", "ui")

main()

function main() {
  const componentName = process.argv[2]
  if (!componentName) {
    console.error("Please provide a component name.")
  } else {
    createComponent(componentName)
  }
}

function createComponent(componentName: string) {
  const command = `pnpm dlx shadcn@latest add ${componentName}`
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`)
      return
    }

    const oldFilePath = resolve(base, `${componentName}.tsx`)
    const newFilePath = resolve(base, `${renamer(componentName)}.tsx`)
    renameFile(oldFilePath, newFilePath)
  })
}

function renamer(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

function renameFile(oldPath: string, newPath: string) {
  rename(oldPath, newPath, (err) => {
    if (err) {
      console.error(`Error renaming file: ${err}`)
      return
    }
  })
}
