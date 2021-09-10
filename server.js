/** 主应用 */
const express = require('express')
const app = express();
app.use(express.static('.'))

app.listen(9000, () => {
    console.log('主应用，端口号9000');
})