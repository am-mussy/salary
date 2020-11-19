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

    if (req.body.action === 'changUserAccess') {
        await changUserAccess(req.body)
        res.send('changed')
    }

    if (req.body.action === 'delUser') {
        delUser(req.body.userName)
        res.send('ok')
    }

    if (req.body.action === 'getUserList') {
        res.send(JSON.stringify(await getUserList()))


    }

    if (req.body.action === 'delElemInfoSheets') {

        await delElemInfoSheets(req.body.id)

        res.send('H')
    }

    if (req.body.action === 'getInfoSheets') {

        if (log) console.log('getInfoSheets')

        let info = await getDataForInfoSheets(req.body.userName)

        res.send(JSON.stringify(info))
    }

    if (req.body.action === 'addInfoSheets') {

        if (log) console.log('addInfoSheets')
        addDataForInfoSheets([{
            id: req.body.id,
            userName: req.body.userName,
            date: req.body.date,
            time: req.body.time,
            comment: req.body.comment
        }])

        res.send(JSON.stringify('addInfoSheets'))
    }

    if (req.body.action === 'addUser') {

        addUser(req.body)
        res.send('add')
    }

    if (req.body.action === 'find') {

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
                        id: data.id,
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

    console.log('findUser', userName)

    let userRes = {
        isFind: false
    }

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvUsers)
            .pipe(csv())
            .on('data', (data) => {

                console.log('findUser(data): ', data)

                if (data.userName === userName) {

                    userRes = {
                        isFind: true,
                        userName: data.userName,
                        access: data.role
                    }

                    resolve(userRes)
                } else {

                    console.log('findUser: Пользователя нет в системе')
                }

            })
            .on('end', () => resolve(userRes))
    })

}

async function getUserList() {

    let userRes = []

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvUsers)
            .pipe(csv())
            .on('data', (data) => {

                userRes.push(data)
            })
            .on('end', () => resolve(userRes))
    })
}

async function delUser(userName) {

    console.log('delUser:', userName)

    let user

    let streem = fs.readFile(csvUsers, 'utf8', function (err, data) {

        let _Data = data.split('\n')


        if (err) {
            console.error(err);
        }

        for (i = 0; i < _Data.length; i++) {

            if (_Data[i].split(',')[0] === userName) {

                user = _Data[i]
                _Data.splice(i, 1)
                break
            }

        }

        fs.writeFileSync(csvUsers, _Data.join('\n'))
        return user
    });

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
                { id: 'id', title: 'id' },
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
                { id: 'id', title: 'id' },
                { id: 'userName', title: 'userName' },
                { id: 'date', title: 'date' },
                { id: 'time', title: 'time' },
                { id: 'comment', title: 'comment' },
            ]
        })

        //addInfoInCSV.writeRecords({ userName: '', date: '', time: '', comment: '', id: '' })
    }


}

async function delElemInfoSheets(id) {

    console.log('delELEM')
    console.log(id)

    fs.readFile(csvinfoSheets, 'utf8', function (err, data) {
        if (err) {
            console.error(err);
        }

        let _Data = data.split('\n')


        for (i = 0; i < _Data.length; i++) {

            if (_Data[i].split(',')[0] === id) {

                _Data.splice(i, 1)
                break
            }

        }



        fs.writeFileSync(csvinfoSheets, _Data.join('\n'))
    });

}


async function changUserAccess(body) {

    console.log('changUserAccess :', body)

    await delUser(body.userName)

    setTimeout(async () => {

        await addUser(body)
    }, 50);

}

async function addUser(body) {

    console.log('addUser: ', body)


    if (fs.existsSync(csvUsers)) {

        let user
        user = await findUser(body.userName)
        console.log(user)

        console.log('addUser', { user })
        console.log('addUser', user.isFind)

        if (!user.isFind) {


            await addUserInCSV.writeRecords([{
                userName: body.userName,
                email: body.email,
                role: body.role
            }])

            console.log('addUser: User added')

        } else {

            if (log) console.log('post ТАКОЙ ПОЛЬЗОВАТЕЛЬ УЖЕ ЕСТЬ')
        }

    } else {

        await addUserInCSV.writeRecords([{
            userName: body.userName,
            email: body.email,
            role: body.role
        }])
    }
}