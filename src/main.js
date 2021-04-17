import "./theme.css"
import NBModule from './break.nblity'
import Book from './Book.svelte'
import { origin } from './wrapper'
let url = new URL("../assets/img/nb.png", import.meta.url)
console.log('webpack-url', url)
console.log('tree-shaking', origin.bbb)
console.log('nb-module', NBModule)
console.log('env', process.env)
let nb = new NBModule()
let app = new Book({
    target: document.getElementById("app"),
    props: {

    }
})