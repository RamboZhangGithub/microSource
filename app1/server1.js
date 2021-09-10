/** 主应用 */
const express = require('express')
const app = express();
app.use('*', function (reg, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT,GET,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'X-Request-With')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})
app.use(express.static('./app1'))

app.listen(9001, () => {
    console.log('app1，端口号9001');
})