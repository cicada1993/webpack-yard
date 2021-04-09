const { getOptions } = require('loader-utils')

function get_name_from_filename(filename) {
    if (!filename)
        return null;
    const parts = filename.split(/[/\\]/).map(encodeURI);
    if (parts.length > 1) {
        const index_match = parts[parts.length - 1].match(/^index(\.\w+)/);
        if (index_match) {
            parts.pop();
            parts[parts.length - 1] += index_match[1];
        }
    }
    const base = parts.pop()
        .replace(/%/g, 'u')
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z_$0-9]+/g, '_')
        .replace(/^_/, '')
        .replace(/_$/, '')
        .replace(/^(\d)/, '_$1');
    if (!base) {
        throw new Error(`Could not derive component name from file ${filename}`);
    }
    return base[0].toUpperCase() + base.slice(1);
}
module.exports = function (source) {
    const options = getOptions(this)
    console.log('nblity loader options', options)
    console.log('node_env', process.env.NODE_ENV)
    let nbReg = new RegExp(/nb:\{.+?\}/g)
    let nbCodeArr = source.match(nbReg)
    let codeArr = nbCodeArr.map(
        (nbCode, index, origin) => {
            return nbCode.replace(new RegExp(/^nb:{/), "").replace(new RegExp(/}$/), "")
        }
    )
    let html = source.replace(nbReg, "")
    let mounted = () => {
        console.log('hello')
    }
    let className = get_name_from_filename(this.resourcePath)
    let classCode = `class ${className} {
        constructor() {
            console.log('instance created!')
            this.init()
        }

        init() {
            console.log('function init called!')
            ${codeArr.join(";")}
        }
    }
    export default ${className}`
    let res = {
        html,
        codeArr,
        mounted: "" + mounted
    }
    return classCode
}