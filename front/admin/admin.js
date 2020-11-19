// (?) - не понятно будет ли работать, работает ли сейчас так как запланировано


const url = 'http://127.0.0.1:5005/'
let sessionData

auth()

//метод нотификаций
let notification = {
    show: alarm,
    clearAll: clearAllNotification
}


window.onload = async () => {

    console.log('loaded')

    //Загружает данные с сервера в таблицу
    await PreparingDataForInfoSheets()

    //При нажатии на кнопку "+" проверяет и отправлет данные на сервер          
    document.getElementById('sendInfoBut').addEventListener('click', inputProcessing)

    //после загрузки странцицы вешает обработчик всем кнопкапкам "удалить"
    for (let i = 0; document.getElementsByClassName('delBut').length > i; i++) {

        document.getElementsByClassName('delBut')[i].removeEventListener('click', removeElemFromInfoSheets)
        document.getElementsByClassName('delBut')[i].addEventListener('click', removeElemFromInfoSheets)
    }

    document.getElementById('logout').addEventListener('click', logout)
}


//Авторизация - вернует на странцу ввода логина, если в sessionData - его не будет
function auth() {
    sessionData = JSON.parse(sessionStorage.getItem('isLogin'))

    if (!sessionData) {
        window.location.href = '../index.html'
    }

    document.getElementById('userName').innerHTML = sessionData.userName
}

//Удаляет данные из sessionStorage и переадресовывает на старицу логина
function logout() {

    sessionStorage.removeItem('isLogin')
    window.location.href = '../index.html'
}

//Подготавливает данные для отображения
async function PreparingDataForInfoSheets() {
    let info = await getInfoSheets(sessionData, url)
    console.log(info)
    for (let i = 0; i < info.length; i++) {

        appendDataToInfoSheets(i, info)
    }

}

//Запрашивает данные таблицы с сервера
async function getInfoSheets(sessionData, url) {

    console.log('getInfoSheets')

    let body = {
        action: "getUserList"
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


//Добавляет(рисует) данные в таблице 
async function appendDataToInfoSheets(i, info) {

    userName = document.createElement('p')
    text = document.createTextNode(info[i].userName)
    userName.appendChild(text)
    userName.className = info[i].userName + ' userName'
    document.getElementById('infoSheets').appendChild(userName)

    role = document.createElement('p')
    text = document.createTextNode(info[i].role)
    role.className = info[i].userName + ' roles'
    role.appendChild(text)
    document.getElementById('infoSheets').appendChild(role)

    // comment = document.createElement('p')
    // text = document.createTextNode(info[i].comment)
    // comment.appendChild(text)
    // comment.className = info[i].id
    // document.getElementById('infoSheets').appendChild(comment)

    btn = document.createElement("BUTTON");
    btn.innerHTML = "-";
    btn.className = info[i].userName + " delBut"
    btn.id = 'delBut'
    document.getElementById('infoSheets').appendChild(btn);
}

//Отправляет новые данные на сервер
async function sendDataToCSV(url) {

    let body = {
        action: "addUser",
        userName: document.getElementById('userName').value,
        role: document.getElementById('role').value,
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
async function delOfInfoSheets(userName) {
    console.log('del...')

    let body = {
        action: "delUser",
        userName: userName
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

//удаляет строку из таблицы
async function removeElemFromInfoSheets() {
    console.log('klick')
    await delOfInfoSheets(document.getElementsByClassName('delBut')[0].classList[0])

    let lineClass = document.getElementsByClassName(document.getElementsByClassName('delBut')[0].className.split(' ')[0])

    for (let j = lineClass.length - 1; j >= 0; j--) {
        lineClass[j].remove()
    }
}

//Метод объекта notification
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
    }, 4000);

}

function clearAllNotification() {
    document.getElementById('notification').innerHTML = ''
}

async function inputProcessing() {

    console.log('addDataToInfoSheets')
    let isFind = false

    for (let i = 0; document.getElementsByClassName('userName').length > i; i++) {

        console.log(document.getElementById('userName').value)
        console.log(document.getElementsByClassName('userName')[i].innerText)


        if (document.getElementById('userName').value === document.getElementsByClassName('userName')[i].innerText) {
            isFind = true
            notification.show('Wrong user name', 'This name has been already added')
        }


    }

    if (document.getElementById('userName').value.indexOf(' ') === -1) {

        if (document.getElementById('userName').value && document.getElementById('role').value && !isFind) {

            await sendDataToCSV(url)
            await appendDataToInfoSheets(0, [
                {
                    userName: document.getElementById('userName').value,
                    role: document.getElementById('role').value,
                }
            ])

            for (let i = 0; document.getElementsByClassName('delBut').length > i; i++) {

                document.getElementsByClassName('delBut')[i].removeEventListener('click', removeElemFromInfoSheets)
                document.getElementsByClassName('delBut')[i].addEventListener('click', removeElemFromInfoSheets)
            }

        }
    } else {

        notification.show('Wrong user name', 'The name must not contain spaces')
    }
}