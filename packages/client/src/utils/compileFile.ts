import execa from 'execa'
import path from 'path'
import ts, { createCompilerHost, createProgram, ModuleKind, ScriptTarget } from 'typescript'

export function compileFile(filePath: string) {
  // await execa.node(path.resolve(__dirname, 'compilerWorker.js'), [filePath])
  const options = {
    module: ModuleKind.CommonJS,
    target: ScriptTarget.ES2018,
    lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'],
    declaration: true,
    strict: true,
    esModuleInterop: true,
    noEmitOnError: true,
    skipLibCheck: false,
  }

  const compilerHost = createCompilerHost(options)
  compilerHost.writeFile = () => {}

  const program = createProgram([filePath], options, compilerHost)
  const result = program.emit()

  if (result.diagnostics.length > 0) {
    const formatted = ts.formatDiagnostics(result.diagnostics, compilerHost)
    throw new Error('Compilation Error\n' + formatted)
  }
}
