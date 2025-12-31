import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

function findPgCtl(): string {
  const base = 'C:\\\\Program Files\\\\PostgreSQL'
  try {
    const versions = fs.readdirSync(base).filter((n) => /^\d+/.test(n)).sort((a, b) => b.localeCompare(a))
    if (versions.length) {
      const exe = path.join(base, versions[0], 'bin', 'pg_ctl.exe')
      if (fs.existsSync(exe)) return exe
    }
  } catch {}
  return 'pg_ctl'
}

function findPgTool(tool: 'initdb' | 'psql'): string {
  const base = 'C:\\\\Program Files\\\\PostgreSQL'
  try {
    const versions = fs.readdirSync(base).filter((n) => /^\d+/.test(n)).sort((a, b) => b.localeCompare(a))
    if (versions.length) {
      const exe = path.join(base, versions[0], 'bin', `${tool}.exe`)
      if (fs.existsSync(exe)) return exe
    }
  } catch {}
  return tool
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
function rootDir() {
  return path.resolve(__dirname, '..', '..', '..')
}

function dataDir() {
  return path.join(rootDir(), 'pgdev', 'data')
}

function logFile() {
  return path.join(rootDir(), 'pgdev', 'postgres.log')
}

function run(cmd: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' })
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))))
  })
}

async function main() {
  const mode = process.argv[2] || 'start'
  const pgctl = findPgCtl()
  if (mode === 'start') {
    await run(pgctl, ['-D', dataDir(), '-l', logFile(), 'start', '-o', '-p 5433'])
  } else if (mode === 'stop') {
    await run(pgctl, ['-D', dataDir(), 'stop'])
  } else if (mode === 'status') {
    await run(pgctl, ['-D', dataDir(), 'status'])
  } else if (mode === 'restart') {
    await run(pgctl, ['-D', dataDir(), 'stop'])
    await run(pgctl, ['-D', dataDir(), '-l', logFile(), 'start', '-o', '-p 5433'])
  } else if (mode === 'logs') {
    await run('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', 'Get-Content', '-Path', logFile(), '-Wait', '-Tail', '200'])
  } else if (mode === 'reset') {
    await run(pgctl, ['-D', dataDir(), 'stop'])
    try { fs.rmSync(dataDir(), { recursive: true, force: true }) } catch {}
    fs.mkdirSync(dataDir(), { recursive: true })
    const initdb = findPgTool('initdb')
    await run(initdb, ['-D', dataDir(), '-A', 'trust'])
    await run(pgctl, ['-D', dataDir(), '-l', logFile(), 'start', '-o', '-p 5433'])
    const psql = findPgTool('psql')
    const user = process.env['USERNAME'] || 'postgres'
    await run(psql, ['-U', user, '-h', 'localhost', '-p', '5433', '-d', 'postgres', '-c', "CREATE ROLE daggerheart LOGIN PASSWORD 'dev';"])
    await run(psql, ['-U', user, '-h', 'localhost', '-p', '5433', '-d', 'postgres', '-c', "ALTER ROLE daggerheart CREATEDB;"])
    await run(psql, ['-U', user, '-h', 'localhost', '-p', '5433', '-d', 'postgres', '-c', "CREATE DATABASE daggerheart OWNER daggerheart;"])
  } else {
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
