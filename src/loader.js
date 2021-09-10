/** 解析html 生成css和js */
export async function importHtml(entry) {
    // 解析html 生成css 和 js
    let content = await loadSource(entry)
    // 解析script
    const ret = parseScript(content, entry)
    console.log(ret);
    // 解析css
    const { css, styles } = parseCss(content, entry)
    // 解析body
}
function loadSource(url) {
    return window.fetch(url).then(res => res.text())
}
const ATTR_RE = /["'=\w\s]*/.source
function parseScript(content, entry) {
    const SCRIPT_RE = new RegExp('<script' + ATTR_RE + '>([\\w\\W]*)<\/script>', 'g')
    const SCRIPT_SRC_RE = new RegExp('<script' + ATTR_RE + 'src="(.+)">', 'g')
    const scripts = []
    const scriptsUrls = []
    let match
    while (match = SCRIPT_RE.exec(content)) {
        const script = match[1].trim()
        script && scripts.push(script)
    }
    while (match = SCRIPT_SRC_RE.exec(content)) {
        const url = match[1].trim()
        url && scriptsUrls.push(url)
    }
    let remoteScript = await Promise.all(scriptsUrls.map(url => {
        let u = (url.startsWith('http:') || url.startsWith('https:')) ? url : entry + url
        return loadSource(u)
    }))
    scripts = remoteScript.concat(scripts)
    return scripts
}
 
function parseCss(content, entry) {
    // 情况1： <link xxxx href="xxx.css"></link>
    // 情况2 ：<style>
    //    css 
    // </style>
    const CSS_LINK_RE = new RegExp('<link' + ATTR_RE + 'href="([^"]+.css[^"]*)"' + ATTR_RE + '>')
    const STYLE_CONTENT_RE = /<style>([^<]*)<\/style>/
    const CSS_RE = new RegExp('(?:' + CSS_LINK_RE + ')|?:' + STYLE_CONTENT_RE + ')', 'g')
}