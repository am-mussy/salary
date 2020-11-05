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
let csvUsers = '../../users.csv'
let csvinfoSheets = '../../infoSheets.csv'

let log = true



if (log) if (log) console.log(`IP: ${ip.address()}:5005`,)

app.post('/', async function (req, res) {
    if (log) console.log('-----------------------------------')
    if (log) console.log('post: ПОЛУЧЕННЫЕ ДАННЫЕ \n', req.body)
    await createCSV() //Переделать под единичный запуск при старте сервера

    if (req.body.action === 'getInfoSheets') {

        if (log) console.log('getInfoSheets')

        let info = await getDataForInfoSheets(req.body.userName)
        let infoSheetsHTML = ''

        for (let i = 0; i < info.length; i++) {
            console.log(i, info[i])
            infoSheetsHTML += `<p>${info[i].date}</p>
            <p>${info[i].time}</p>
            <p>${info[i].comment}</p>
            <button class="delBut">-</button>`
        }

        res.send(JSON.stringify(infoSheetsHTML))
    }

    if (req.body.action === 'addInfoSheets') {

        if (log) console.log('addInfoSheets')
        addDataForInfoSheets([{
            userName: req.body.userName,
            date: req.body.date,
            time: req.body.time,
            comment: req.body.comment
        }])

        res.send('addInfoSheets')
    }

    if (req.body.action === 'add') {

        if (fs.existsSync(csvUsers)) {

            let user
            user = await findUser(req.body.userName)
            console.log(user)
            if (log) console.log('find', { user })

            if (!user.isFind) {


                await addUserInCSV.writeRecords([{
                    userName: req.body.userName,
                    email: req.body.email,
                    role: req.body.role
                }])

                res.send('add')

            } else {
                if (log) console.log('post ТАКОЙ ПОЛЬЗОВАТЕЛЬ УЖЕ ЕСТЬ')

                res.send('FUCK U')
            }

        } else {

            await addUserInCSV.writeRecords([{
                userName: req.body.userName,
                email: req.body.email,
                role: req.body.role
            }])

            res.send('add')
        }
    }

    if (req.body.action === 'find') {
        //if(log) console.log(JSON.stringify(await findUser(csvUsers, req.body.userName)))
        res.send(JSON.stringify(await findUser(req.body.userName)))
    } else {
        //Переделать на нормальный ответ сервера
        //res.send('Пользователя нет в системе')
    }

    res.status(200)

})

app.listen(5005);



async function addDataForInfoSheets(data) {
    await addInfoInCSV.writeRecords(data)
}

async function getDataForInfoSheets(userName) {
    if (log) console.log('getDataForInfoSheets...')
    let DataForInfoSheets = []

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvinfoSheets)
            .pipe(csv())
            .on('data', (data) => {

                if (data.userName === userName) {

                    DataForInfoSheets.push({
                        date: data.date,
                        time: data.time,
                        comment: data.comment
                    })
                }
            })
            .on('end', () => resolve(DataForInfoSheets))

        //Здесб будет SUCKтировка мASSива по SEEMени

    })

}

async function findUser(userName) {

    let userRes

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvUsers)
            .pipe(csv())
            .on('data', (data) => {
                if (log) console.log(data)

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

                    if (log) console.log('findUser: Пользователя нет в системе')
                }

            })
            .on('end', () => resolve(userRes))
    })

}

async function createCSV() {
    if (fs.existsSync(csvUsers)) {
        if (log) console.log('csvUsers: ФАЙЛ НАЙДЕН')
        addUserInCSV = createCsvWriter({
            path: csvUsers,
            header: [
                { id: 'userName', title: 'userName' },
                { id: 'email', title: 'email' },
                { id: 'role', title: 'role' },
            ],
            append: true
        })

    } else {

        if (log) console.log('csvUsers: ФАЙЛ НЕ НАЙДЕН')
        addUserInCSV = createCsvWriter({
            path: csvUsers,
            header: [
                { id: 'userName', title: 'userName' },
                { id: 'email', title: 'email' },
                { id: 'role', title: 'role' },
            ]
        })
    }

    if (fs.existsSync(csvinfoSheets)) {
        if (log) console.log('csvinfoSheets: ФАЙЛ НАЙДЕН')
        addInfoInCSV = createCsvWriter({
            path: csvinfoSheets,
            header: [
                { id: 'userName', title: 'userName' },
                { id: 'date', title: 'date' },
                { id: 'time', title: 'time' },
                { id: 'comment', title: 'comment' },
            ],
            append: true
        })

    } else {

        if (log) console.log('csvinfoSheets: ФАЙЛ НЕ НАЙДЕН')
        addInfoInCSV = createCsvWriter({
            path: csvinfoSheets,
            header: [
                { id: 'userName', title: 'userName' },
                { id: 'date', title: 'date' },
                { id: 'time', title: 'time' },
                { id: 'comment', title: 'comment' },
            ]
        })

        addInfoInCSV.writeRecords({ userName: '', date: '', time: '', comment: '' })
    }


}