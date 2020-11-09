// (?) - не понятно будет ли работать, работает ли сейчас так как запланировано

const url = 'http://127.0.0.1:5005/'
let sessionData
let onehourprice = 10
let userTimeSum = 0
window.onload = () => {

    //Загружает данные с сервера в таблицу
    PreparingDataForInfoSheets()

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


        document.getElementsByClassName('delBut')[0].addEventListener('click', () => {

        })

    }
}


auth()


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

async function PreparingDataForInfoSheets() {
    let info = await getInfoSheets(sessionData, url)
    console.log(info)
    for (let i = 0; i < info.length; i++) {

        appendDataToInfoSheets(i, info)

        userTimeSum += parseInt(info[i].time)
    }


    document.getElementById('moneySum').innerHTML = userTimeSum * onehourprice
}

async function appendDataToInfoSheets(i, info) {

    date = document.createElement('p')
    text = document.createTextNode(info[i].date)
    date.appendChild(text)
    date.className = i
    document.getElementById('infoSheets').appendChild(date)

    time = document.createElement('p')
    text = document.createTextNode(info[i].time)
    time.className = 'time ' + i
    time.appendChild(text)
    document.getElementById('infoSheets').appendChild(time)

    comment = document.createElement('p')
    text = document.createTextNode(info[i].comment)
    comment.appendChild(text)
    comment.className = i
    document.getElementById('infoSheets').appendChild(comment)

    btn = document.createElement("BUTTON");   // Create a <button> element
    btn.innerHTML = "-";                   // Insert text
    btn.className = "delBut " + i
    btn.id = 'delBut'
    document.getElementById('infoSheets').appendChild(btn);               // Append <button> to <body>
}


function auth() {
    sessionData = JSON.parse(sessionStorage.getItem('isLogin'))

    if (!sessionData) {
        window.location.href = '../index.html'
    }

    document.getElementById('userName').innerHTML = sessionData.userName
}

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