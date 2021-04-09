import NBModule from './break.nblity'
import _load_school from '../wasm/school.cside'
import SVModule from './consult.svelte'
import { origin } from './wrapper'
let url = new URL("../assets/img/nb.png", import.meta.url)
_load_school().then(
    (_module_school) => {
        console.log(_module_school)
    }
)
console.log('webpack-url', url)
console.log('tree-shaking', origin.bbb)
console.log('nb-module', NBModule)
console.log('sv-module', SVModule)
console.log('env', process.env)
let nb = new NBModule()
let svApp = new SVModule({
    target: document.getElementById("app"),
    props: {

    }
})