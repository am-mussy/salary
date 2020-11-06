const url = 'http://127.0.0.1:5005/'
let sessionData

auth()
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

    document.getElementById('infoSheets').innerHTML = await getInfoSheets(sessionData, url)
}


function auth() {
    sessionData = JSON.parse(sessionStorage.getItem('isLogin'))

    if (!sessionData) {
        window.location.href = '../index.html'
    }
}