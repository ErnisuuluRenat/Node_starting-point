const fs = require('fs')
const {createHmac} = require('node:crypto')

const secret = 'abcdef'
const hash = createHmac('sha256', secret)
.update('i love strawberrys')
.digest('hex');
console.log(hash)

let textIn = fs.readFileSync("./txt/input.txt").toString("utf8")
console.log(textIn)

const textOut = `this is what we need about avocado ${textIn}. \n Created on ${Date.now()}`
fs.writeFileSync("./txt/output.txt", textOut)

fs.readFile("./txt/start.txt",  "utf8", (err, data1) => {
    fs.readFile(`./txt/${data1}.txt`, 'utf8', (err, data2) => {
        fs.readFile(`./txt/output.txt`, 'utf8', (err, data3) => {
            fs.writeFile("./txt/funalAnswer.txt", `${data2}\n${data3}`, 'utf8', (err) => {
                console.log("Your file has been written")
            })
        })
    })
})

