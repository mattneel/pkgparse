const fs = require('fs')
const search = require('./search')
const fetchNPMDeps = require('./helpers/fetchNPMDeps')
const checkDepsExist = require('./helpers/checkDepsExist')
const { error } = require('./helpers/loggers')

module.exports = async function feast (module) {
  if (module) {
    try {
      const deps = await fetchNPMDeps(module)

      if (deps) {
        // A silly easter egg
        if (module === 'pkgparse') {
          error(`${module} is... hey wait, that"s me!`)
        } else {
          error(`${module} is made of...`)
        }
        searchArray(deps)
      }
    } catch (e) {
      error('You might be offline?')
    }
  } else {
    readPackage()
  }
}

function readPackage () {
  fs.readFile(process.cwd() + '/package.json', 'utf-8', (err, file) => {
    if (!err) {
      let pkg = JSON.parse(file)
      let deps = checkDepsExist(pkg)

      if (deps.size) {
        searchArray(deps)
      } else {
        error('That package seems to have no dependencies!')
      }
    } else {
      error('There is no package.json in this directory!')
    }
  })
}

function searchArray (deps) {
  for (let dep of deps) {
    search(dep)
  }
}
