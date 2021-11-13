#!/usr/bin/env node

const fs = require('fs')
const commander = require('commander')
const path = require('path')
const mustache = require('mustache')
const yaml = require('js-yaml')
const changeCase = require('change-case')

const program = new commander.Command()
program.version('0.0.1')

function generate (name, output, args) {
  const content = fs.readFileSync(path.join(__dirname, 'template', name), 'utf8')
  fs.writeFileSync(output, mustache.render(content, args))
}

function create (file) {
  if (!fs.existsSync(file)) fs.mkdirSync(file)
  return file
}

program
  .command('new <name>')
  .description('create interface, view, presenter')
  .action((name) => {
    const lib = path.join(process.cwd(), 'lib')
    const pack = path.join(process.cwd(), 'pubspec.yaml')

    if (!fs.existsSync(pack)) {
      return console.log('file not found: ' + pack)
    }

    if (!fs.existsSync(lib)) {
      return console.log('directory not found: ' + lib)
    }

    const args = {
      name: changeCase.pascalCase(name),
      name_snake: changeCase.snakeCase(name)
    }
    try {
      const doc = yaml.load(fs.readFileSync(pack, 'utf8'))
      args.packageName = doc.name
    } catch (e) {
      console.log(e)
      process.exit(-1)
    }
    const file = changeCase.snakeCase(name) + '.dart'

    const kInterface = create(path.join(lib, 'interface'))
    generate('interface.mustache', path.join(kInterface, file), args)

    const kPresenter = create(path.join(lib, 'presenter'))
    generate('presenter.mustache', path.join(kPresenter, file), args)

    const kView = create(path.join(lib, 'view'))
    generate('view.mustache', path.join(kView, file), args)
  })

program.parse(process.argv)
