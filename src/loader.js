/** 解析html 生成css和js */
export async function importHtml(entry) {
    // 解析html 生成css 和 js
    let content = await loadSource(entry)
    // 解析script
    const scripts = await parseScript(content, entry)
    // 解析css
    const { css, styles } = parseCss(content, entry)
    // 解析body
    const body = parseBody(content)
    console.log(scripts, css, styles, body);
}
function loadSource(url) {
    return window.fetch(url).then(res => res.text())
}
const ATTR_RE = /["'=\w\s]*/.source

async function parseScript(content, entry) {
    const SCRIPT_RE = new RegExp('<script' + ATTR_RE + '>([\\w\\W]*)<\/script>', 'g')
    const SCRIPT_SRC_RE = new RegExp('<script' + ATTR_RE + 'src="(.+)">', 'g')
    let scripts = []
    let scriptsUrls = []
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
    const CSS_LINK_RE = new RegExp('<link' + ATTR_RE + 'href="([^"]+.css[^"]*)"' + ATTR_RE + '>', 'g')
    const STYLE_CONTENT_RE = /<style>([^<]*)<\/style>/g
    // console.log(CSS_LINK_RE);
    // console.log(STYLE_CONTENT_RE);
    const CSS_RE = new RegExp('(?:' + CSS_LINK_RE.source + ')|(?:' + STYLE_CONTENT_RE.source + ')', 'g')
    let match, css = [], styles = []
    while ((match = CSS_RE.exec(content))) {
        let style
        if (match[1]) {
            style = match[1].trim()
            style = css.push(style)
        } else if (match[2]) {
            style = match[2].trim()
            style && styles.push(style)
        }
    }
    return { css, styles }
}

function parseBody(content) {
    const BODY_RE = /<body>([\w\W]*)<\/body>/g
    const SCRIPT_RE = /<script["'=\w\s]*>[\s\S]*<\/script>/g
    let bodyContent = content.match(BODY_RE)
    return bodyContent
}