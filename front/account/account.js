// (?) - не понятно будет ли работать, работает ли сейчас так как запланировано

const url = 'http://127.0.0.1:5005/'
let sessionData
let onehourprice = 10 //Стоимость часа
let userTimeSum = 0 //Сколько часов всего отработал

auth()

let notification = {
    show: alarm,
    clearAll: clearAllNotification
}


window.onload = async () => {

    //Загружает данные с сервера в таблицу
    await PreparingDataForInfoSheets()

    //При нажатии на кнопку "+" отправлет данные на сервер          
    document.getElementById('sendInfoBut').addEventListener('click', async () => {

        console.log('addDataToInfoSheets')
        if (document.getElementById('date').value && document.getElementById('time').value && document.getElementById('comment').value) {

            if (!isNaN(parseInt(document.getElementById('time').value))) {
                let id = new Date().getTime() + (Math.random() * 10000).toFixed(0)
                await sendDataToCSV(sessionData, url, id)
                await appendDataToInfoSheets(0, [
                    {
                        date: document.getElementById('date').value,
                        time: document.getElementById('time').value,
                        comment: document.getElementById('comment').value,
                        id: id
                    }
                ])

                let sum = 0

                for (let i = 0; document.getElementsByClassName('time').length > i; i++) {


                    sum += parseInt(document.getElementsByClassName('time')[i].innerHTML)
                    console.log(sum)
                }

                console.log(parseInt(document.getElementById('moneySum').innerHTML))
                console.log(sum)
                console.log(onehourprice)

                document.getElementById('moneySum').innerHTML = onehourprice * sum

                for (let i = 0; document.getElementsByClassName('delBut').length > i; i++) {

                    document.getElementsByClassName('delBut')[i].removeEventListener('click', removeElemFromInfoSheets)
                    document.getElementsByClassName('delBut')[i].addEventListener('click', removeElemFromInfoSheets)
                }
            } else {
                notification.show(document.getElementById('time').value, 'Is not a number')
            }
        }
    })

    //Добавляет(?) 


    for (let i = 0; document.getElementsByClassName('delBut').length > i; i++) {

        document.getElementsByClassName('delBut')[i].removeEventListener('click', removeElemFromInfoSheets)
        document.getElementsByClassName('delBut')[i].addEventListener('click', removeElemFromInfoSheets)
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

//Добавляет(рисует) данные в таблице new Date().getTime() + (Math.random() * 10000).toFixed(0)
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
async function sendDataToCSV(sessionData, url, id) {

    console.log('sends...')

    let body = {
        action: "addInfoSheets",
        userName: sessionData.userName,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        comment: document.getElementById('comment').value,
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

        return response

    } catch (error) {
        console.error('Ошибка:', error);
    }


}

//Отправляем id на удаление
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


async function removeElemFromInfoSheets() {

    await delOfInfoSheets(document.getElementsByClassName('delBut')[0].classList[0])

    let lineClass = document.getElementsByClassName(document.getElementsByClassName('delBut')[0].className.split(' ')[0])

    for (let j = lineClass.length - 1; j >= 0; j--) {
        lineClass[j].remove()
    }
}

function alarm(header, text) {

    let id = (Math.random() * 10000).toFixed(0)

    let alarm = document.createElement('div')
    alarm.className = 'alarm ' + id
    alarm.style.opacity = '1'
    alarm.innerHTML = `
    <h1>${header}</h1>   
    <p>${text}</p>`
    document.getElementById('notification').append(alarm)

    setTimeout(() => {

        document.getElementsByClassName(id)[0].remove()
    }, 2000);

}

function clearAllNotification() {
    document.getElementById('notification').innerHTML = ''
}
