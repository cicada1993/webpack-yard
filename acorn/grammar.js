const acorn = require('acorn')

console.log(acorn.parse("let a = 'gg'", { ecmaVersion: "latest" }))