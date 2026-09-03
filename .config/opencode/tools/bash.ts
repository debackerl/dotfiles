// MIT License

// Copyright (c) 2025 opencode

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { tool, type ToolContext } from "@opencode-ai/plugin"
import { spawn, type ChildProcess } from "child_process"
import { type Dirent } from "node:fs"
import { readdir } from "node:fs/promises"
import DESCRIPTION from "./bash.txt"

const SIGKILL_TIMEOUT_MS = 200
const MAX_METADATA_LENGTH = 300
const MAX_LENGTH = 30_000
const DEFAULT_TIMEOUT = 2 * 60 * 1000

const LANG = process.env.LANG || "en_US.UTF-8"
const PATH = process.env.PATH || "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
const USER = process.env.USER || ""

const DEV_COMMANDS = ["git", "ldd", "lint", "python", "python3", "pytest", "pip", "pipx", "uv", "uvx", "ruff", "black", "astro", "node", "bun", "deno", "npm", "npx", "pnpm", "bunx", "tsc", "vite", "esbuild", "parcel", "webpack", "dotnet", "nuget", "java", "javac", "mvn", "gradle", "gcc", "g++", "llc", "llvm-cov", "llvm-diff", "make", "cmake", "meson", "conan", "rustc", "cargo", "go", "dart", "kotlin", "kotlinc", "julia", "php", "composer", "laravel", "zig"]
const PKG_COMMANDS = ["dpkg", "dnf", "rpm", "apt", "apt-get", "apk", "pacman", "nix", "yum", "brew", "flatpak", "snap", "port", "emerge", "zypper", "conda", "mamba"]
const DOC_COMMANDS = ["magick", "identify", "exiftool", "ffmpeg", "ffprobe", "convert", "mkvmerge", "mkvinfo", "mkvpropedit", "MP4Box", "docling", "markitdown", "pandoc"]
const MAIN_COMMANDS = new Set(["file", "jq", "yq", "rg", "eza", "sd", "ag", "fd", "tldr", "man", "ls", "find", "wc", "uniq", "sort", "cut", "sed", "awk", "grep", "xargs", "file", "stat", "du", "readlink", "diff", "env", "which", "strings", ...PKG_COMMANDS, ...DOC_COMMANDS, ...DEV_COMMANDS])

async function killTree(proc: ChildProcess, opts?: { exited?: () => boolean }): Promise<void> {
  const pid = proc.pid
  if (!pid || opts?.exited?.()) return

  if (process.platform === "win32") {
    await new Promise<void>((resolve) => {
      const killer = spawn("taskkill", ["/pid", String(pid), "/f", "/t"], { stdio: "ignore" })
      killer.once("exit", () => resolve())
      killer.once("error", () => resolve())
    })
    return
  }

  try {
    process.kill(-pid, "SIGTERM")
    await Bun.sleep(SIGKILL_TIMEOUT_MS)
    if (!opts?.exited?.()) {
      process.kill(-pid, "SIGKILL")
    }
  } catch (_e) {
    proc.kill("SIGTERM")
    await Bun.sleep(SIGKILL_TIMEOUT_MS)
    if (!opts?.exited?.()) {
      proc.kill("SIGKILL")
    }
  }
}

async function getExecutablesFromPath(path: string): Promise<Set<string>> {
  const separator = process.platform === "win32" ? ";" : ":"
  const paths = path.split(separator)
  const executables: string[] = []

  for (const dir of paths) {
    try {
      if (!dir) continue

      const stat = await Bun.file(dir).stat()
      if (!stat?.isDirectory()) continue

      for (const dirent of (await readdir(dir, { withFileTypes: true })) as Dirent[]) {
        if (!dirent.isFile() && !dirent.isSymbolicLink()) continue
        const fullPath = `${dir}/${dirent.name}`
        const fileStat = await Bun.file(fullPath)?.stat()

        if (process.platform === "win32") {
          const ext = dirent.name.split(".").pop()?.toLowerCase()
          if (ext && [".bat", ".cmd", ".exe", ".com", ".ps1"].includes(`.${ext}`)) {
            executables.push(dirent.name)
          }
        } else {
          if ((fileStat.mode & 0o111) !== 0) {
            executables.push(dirent.name)
          }
        }
      }
    } catch (e) { /* ignore when a directory could not be found */ }
  }

  return new Set(executables);
}

// @ts-ignore
const recommendedCommands = [...MAIN_COMMANDS.intersection(await getExecutablesFromPath(PATH))].join(",")

//export const readonly = tool({
export default tool({ // replaces built-in bash tool
  description: DESCRIPTION.replaceAll("${maxChars}", String(MAX_LENGTH)).replaceAll("${recommendedCommands}", recommendedCommands),
  args: {
    command: tool.schema.string().describe("The command to execute"),
    timeout: tool.schema.number().describe("Optional timeout in milliseconds").optional(),
    workdir: tool.schema.string().describe(
        `The working directory to run the command in. Use this instead of 'cd' commands.`,
      ).optional(),
    description: tool.schema.string().describe(
        "Clear, concise description of what this command does in 5-10 words. Examples:\nInput: ls\nOutput: Lists files in current directory\n\nInput: git status\nOutput: Shows working tree status\n\nInput: npm install\nOutput: Installs package dependencies\n\nInput: mkdir foo\nOutput: Creates directory 'foo'",
      ),
    stdin: tool.schema.string().describe(
        "Optional string to pass as stdin to the command. Use this instead of echoing text and piping it into the command.",
      ).optional(),
  },
  async execute(params, ctx: ToolContext): Promise<string> {
    const cwd = params.workdir || ctx.directory
    if (params.timeout !== undefined && params.timeout < 0) {
      throw new Error(`Invalid timeout value: ${params.timeout}. Timeout must be a positive number.`)
    }
    const timeout = params.timeout ?? DEFAULT_TIMEOUT

    const homedir = `/home/${USER}`

    const args = [
      "--unshare-ipc", // can't talk to other processes
      "--unshare-pid", // can't see other processes
      "--unshare-net", // can't access network
      "--unshare-cgroup",
      "--new-session", // prevent injection of input into the terminal
      "--die-with-parent", // ensure processes are killed when bwrap's parent dies
      "--dev-bind", "/dev", "/dev",
      "--ro-bind", "/bin", "/bin",
      "--ro-bind", "/etc", "/etc",
      "--ro-bind", "/sbin", "/sbin",
      "--ro-bind", "/usr", "/usr",
      "--ro-bind", "/lib", "/lib",
      "--ro-bind-try", "/lib64", "/lib64",
      "--ro-bind", "/lib", "/lib",
      "--ro-bind", "/var", "/var",
      "--ro-bind-try", "/home/linuxbrew", "/home/linuxbrew",
      "--ro-bind", homedir, homedir,
      "--tmpfs", "/run",
      "--tmpfs", "/tmp",
      "--",
      "bash",
      "-c",
      params.command
    ];

    const proc = spawn("bwrap", args, {
      cwd,
      env: {
        "LANG": LANG,
        "PATH": PATH,
        "USER": USER,
        "HOME": homedir,
      },
      stdio: [params.stdin ? "pipe" : "ignore", "pipe", "pipe"],
      detached: process.platform !== "win32",
    })

    let output = ""

    // Initialize metadata with empty output
    ctx.metadata({
      metadata: {
        output: "",
        description: params.description,
      },
    })

    const append = (chunk: Buffer) => {
      output += chunk.toString()
      ctx.metadata({
        metadata: {
          // truncate the metadata to avoid GIANT blobs of data (has nothing to do w/ what agent can access)
          output: output.length > MAX_METADATA_LENGTH ? output.slice(0, MAX_METADATA_LENGTH) + "\n\n..." : output,
          description: params.description,
        },
      })
    }

    if (proc.stdin && params.stdin) {
      proc.stdin.write(params.stdin);
      proc.stdin.end();
    }

    proc.stdout?.on("data", append)
    proc.stderr?.on("data", append)

    let timedOut = false
    let aborted = false
    let exited = false

    const kill = () => killTree(proc, { exited: () => exited })

    if (ctx.abort.aborted) {
      aborted = true
      await kill()
    }

    const abortHandler = () => {
      aborted = true
      void kill()
    }

    ctx.abort.addEventListener("abort", abortHandler, { once: true })

    const timeoutTimer = setTimeout(() => {
      timedOut = true
      void kill()
    }, timeout + 100)

    await new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timeoutTimer)
        ctx.abort.removeEventListener("abort", abortHandler)
      }

      proc.once("exit", () => {
        exited = true
        cleanup()
        resolve()
      })

      proc.once("error", (error) => {
        exited = true
        cleanup()
        reject(error)
      })
    })

    const resultMetadata: string[] = []

    if (timedOut) {
      resultMetadata.push(`bash tool terminated command after exceeding timeout ${timeout} ms`)
    }

    if (aborted) {
      resultMetadata.push("User aborted the command")
    }

    if (resultMetadata.length > 0) {
      output += "\n\n<bash_metadata>\n" + resultMetadata.join("\n") + "\n</bash_metadata>"
    }

    return `exit code: ${proc.exitCode}\n<output>${output.length > MAX_LENGTH ? output.slice(0, MAX_LENGTH) + "\n\n..." : output}</output>`
  },
});
