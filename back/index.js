//web server and parser
const ip = require('ip')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("body-parser").json())

let csvWriter
let csvPath = '../../out.csv'
let userRes

app.post('/', async function (req, res) {
    console.log('-----------------------------------')
    console.log('post: ПОЛУЧЕННЫЕ ДАННЫЕ \n', req.body)
    await createCSV()

    if (req.body.action == 'add') {

        if (fs.existsSync(csvPath)) {

            let user
            user = await findUser(csvPath, req.body.userName)

            console.log('find', { user })

            if (!user.isFind) {

                let data = [
                    { userName: req.body.userName, email: req.body.email, role: req.body.role }
                ]
                await addUser(data)

            } else {
                console.log('post ТАКОЙ ПОЛЬЗОВАТЕЛЬ УЖЕ ЕСТЬ')
            }

        } else {
            let data = [
                { userName: req.body.userName, email: req.body.email, role: req.body.role }
            ]
            await addUser(data)
        }
    }

    if (req.body.action == 'find') {
        console.log(JSON.stringify(await findUser(csvPath, req.body.userName)))
        res.send(JSON.stringify(await findUser(csvPath, req.body.userName)))
    } else {
        res.send('Пользователя нет в системе')
    }

    res.status(200)

})

app.listen(5005);
console.log(ip.address());

async function addUser(data) {
    await csvWriter.writeRecords(data)
    console.log('addUser: ДАННЫЕ ДОБАВЛЕННЫ')
}

async function findUser(path, userName) {

    return new Promise((resolve, reject) => {
        fs.createReadStream(path)
            .pipe(csv())
            .on('data', (data) => {
                //console.log(data)
                if (data.userName === userName) {

                    userRes = {
                        isFind: true,
                        userName: data.userName,
                        access: data.role
                    }

                    resolve(userRes)
                } else {
                    userRes = {
                        isFind: false
                    }
                }

            })
            .on('end', () => resolve(userRes))
    })

}

async function createCSV() {
    if (fs.existsSync(csvPath)) {
        console.log('createCSV: ФАЙЛ НАЙДЕН')
        csvWriter = createCsvWriter({
            path: csvPath,
            header: [
                { id: 'userName', title: 'userName' },
                { id: 'email', title: 'email' },
                { id: 'role', title: 'role' },
            ],
            append: true
        })

    } else {

        console.log('createCSV: ФАЙЛ НЕ НАЙДЕН')
        csvWriter = createCsvWriter({
            path: csvPath,
            header: [
                { id: 'userName', title: 'userName' },
                { id: 'email', title: 'email' },
                { id: 'role', title: 'role' },
            ]
        })
    }
}