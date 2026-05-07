import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const args = process.argv.slice(2)
const command = args[0] || 'next'
const commandArgs = args.length > 0 ? args.slice(1) : ['dev']

const logDir = path.resolve(process.cwd(), process.env.LOG_DIR || 'logs')
const logDatePattern = process.env.LOG_DATE_PATTERN || 'YYYY-MM-DD'
const logFilename = process.env.LOG_FILENAME || 'application-%DATE%.log'
const logLevel = process.env.LOG_LEVEL || 'info'
const logMaxSize = process.env.LOG_MAX_SIZE || '20m'
const logMaxFiles = process.env.LOG_MAX_FILES || '14d'
const logCompress = (process.env.LOG_ZIPPED_ARCHIVE || 'false').toLowerCase() === 'true'
const logSymlinkName = process.env.LOG_SYMLINK_NAME || 'current.log'

mkdirSync(logDir, { recursive: true })

const transport = new DailyRotateFile({
  createSymlink: true,
  datePattern: logDatePattern,
  dirname: logDir,
  filename: logFilename,
  level: logLevel,
  maxFiles: logMaxFiles,
  maxSize: logMaxSize,
  symlinkName: logSymlinkName,
  zippedArchive: logCompress,
})

transport.on('error', (error) => {
  process.stderr.write(`[log-rotation-error] ${error instanceof Error ? error.message : String(error)}\n`)
})

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`),
  ),
  level: logLevel,
  transports: [transport],
})

const stripAnsi = (input) => input.replace(/\x1b\[[0-9;]*m/g, '')

const writeChunk = (chunk, level) => {
  const text = stripAnsi(String(chunk))
  const lines = text.split(/\r?\n/)

  for (const line of lines) {
    if (line.trim().length > 0) {
      logger.log({ level, message: line })
    }
  }
}

logger.info(`starting command: ${command} ${commandArgs.join(' ')}`)
logger.info(
  `log rotation configured: dir=${logDir}, file=${logFilename}, datePattern=${logDatePattern}, maxSize=${logMaxSize}, maxFiles=${logMaxFiles}`,
)

const child = spawn(command, commandArgs, {
  env: process.env,
  shell: false,
  stdio: ['inherit', 'pipe', 'pipe'],
})

child.stdout.on('data', (chunk) => {
  process.stdout.write(chunk)
  writeChunk(chunk, 'info')
})

child.stderr.on('data', (chunk) => {
  process.stderr.write(chunk)
  writeChunk(chunk, 'error')
})

child.on('error', (error) => {
  const message = error instanceof Error ? error.message : String(error)
  logger.error(`failed to start child process: ${message}`)
  process.stderr.write(`[log-wrapper-error] ${message}\n`)
  process.exit(1)
})

child.on('close', (code, signal) => {
  if (signal) {
    logger.warn(`child process terminated by signal: ${signal}`)
    process.exit(1)
  }

  logger.info(`child process exited with code: ${code ?? 0}`)
  process.exit(code ?? 0)
})
