// (?) - не понятно будет ли работать, работает ли сейчас так как запланировано

const url = 'http://127.0.0.1:5005/'
let sessionData
let onehourprice = 10 //Стоимость часа
let userTimeSum = 0 //Сколько часов всего отработал


auth()

window.onload = async () => {

    //Загружает данные с сервера в таблицу
    await PreparingDataForInfoSheets()

    //При нажатии на кнопку "+" отправлет данные на сервер
    document.getElementById('sendInfoBut').addEventListener('click', async () => {
        console.log('clocl')
        await sendDataToCSV(sessionData, url)
        //document.getElementById('infoSheets').innerHTML = ''
        // $('#infoSheets').empty()
        await appendDataToInfoSheets(0, [
            {
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                comment: document.getElementById('comment').value
            }
        ])
        // $('#data').load(`${location.href} #infoSheets`)
        let sum = 0

        for (let i = 0; document.getElementsByClassName('time').length > i; i++) {


            sum += parseInt(document.getElementsByClassName('time')[i].innerHTML)
            console.log(sum)
        }

        console.log(parseInt(document.getElementById('moneySum').innerHTML))
        console.log(sum)
        console.log(onehourprice)

        document.getElementById('moneySum').innerHTML = onehourprice * sum

    })

    //Добавляет(?) 


    for (let i = 0; document.getElementsByClassName('delBut').length > i; i++) {

        console.log('loop')
        document.getElementsByClassName('delBut')[0].addEventListener('click', async () => {

            await delOfInfoSheets(document.getElementsByClassName('delBut')[0].classList[0])

            let lineClass = document.getElementsByClassName(document.getElementsByClassName('delBut')[0].className.split(' ')[0])

            for (let j = lineClass.length - 1; j >= 0; j--) {
                lineClass[j].remove()
            }



        })
    }

}
//Запрашивает данные таблицы с сервера
async function getInfoSheets(sessionData, url) {

    console.log('getInfoSheets')

    let body = {
        action: "getInfoSheets",
        userName: sessionData.userName
    }

    try {
        response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return response.json()

    } catch (error) {
        console.error('Ошибка:', error);
    }

}

//Подготавливает данные для отображения
async function PreparingDataForInfoSheets() {
    let info = await getInfoSheets(sessionData, url)
    console.log(info)
    for (let i = 0; i < info.length; i++) {

        appendDataToInfoSheets(i, info)

        userTimeSum += parseInt(info[i].time)
    }


    document.getElementById('moneySum').innerHTML = userTimeSum * onehourprice
}

//Добавляет(рисует) данные в таблице
async function appendDataToInfoSheets(i, info) {

    date = document.createElement('p')
    text = document.createTextNode(info[i].date)
    date.appendChild(text)
    date.className = info[i].id
    document.getElementById('infoSheets').appendChild(date)

    time = document.createElement('p')
    text = document.createTextNode(info[i].time)
    time.className = info[i].id + ' time'
    time.appendChild(text)
    document.getElementById('infoSheets').appendChild(time)

    comment = document.createElement('p')
    text = document.createTextNode(info[i].comment)
    comment.appendChild(text)
    comment.className = info[i].id
    document.getElementById('infoSheets').appendChild(comment)

    btn = document.createElement("BUTTON");   // Create a <button> element
    btn.innerHTML = "-";                   // Insert text
    btn.className = info[i].id + " delBut"
    btn.id = 'delBut'
    document.getElementById('infoSheets').appendChild(btn);               // Append <button> to <body>
}

//Авторизация - вернует на странцу ввода логина, если в sessionData - его не будет
function auth() {
    sessionData = JSON.parse(sessionStorage.getItem('isLogin'))

    if (!sessionData) {
        window.location.href = '../index.html'
    }

    document.getElementById('userName').innerHTML = sessionData.userName
}

//Отправляет новые данные на сервер
async function sendDataToCSV(sessionData, url) {

    console.log('sends...')

    let body = {
        action: "addInfoSheets",
        userName: sessionData.userName,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        comment: document.getElementById('comment').value
    }

    try {
        response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return response

    } catch (error) {
        console.error('Ошибка:', error);
    }


}

async function delOfInfoSheets(id) {
    console.log('sends...')

    let body = {
        action: "delElemInfoSheets",
        userName: sessionData.userName,
        id: id
    }

    try {
        response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })

    } catch (error) {
        console.error('Ошибка:', error);
    }

}