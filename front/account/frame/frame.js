const url = 'http://127.0.0.1:5005/'
let sessionData

document.getElementById('sendInfoBut').addEventListener('click', async () => {
    console.log('click')
    await sendDataToCSV(sessionData, url)
})

appendDataToInfoSheets()

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

async function appendDataToInfoSheets() {

    info = await getInfoSheets(sessionData, url)
    console.log(info)

    for (let i = 0; i < info.length; i++) {

        date = document.createElement('p')
        text = document.createTextNode(info[i].date)
        date.appendChild(text)
        document.getElementById('infoSheets').appendChild(date)

        time = document.createElement('p')
        text = document.createTextNode(info[i].time)
        time.appendChild(text)
        document.getElementById('infoSheets').appendChild(time)

        comment = document.createElement('p')
        text = document.createTextNode(info[i].comment)
        comment.appendChild(text)
        document.getElementById('infoSheets').appendChild(comment)

        btn = document.createElement("BUTTON");   // Create a <button> element
        btn.innerHTML = "CLICK ME";                   // Insert text
        document.getElementById('infoSheets').appendChild(btn);               // Append <button> to <body>
    }
}

function auth() {
    sessionData = JSON.parse(sessionStorage.getItem('isLogin'))

    document.getElementById('userName').innerHTML = sessionData.userName

    if (!sessionData) {
        window.location.href = '../index.html'
    }
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