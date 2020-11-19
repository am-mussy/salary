let url = 'http://127.0.0.1:5005/'
let userName
let userAccess

const accountURL = './account/account.html'
const adminURL = './admin/admin.html'

document.getElementById('okBut').addEventListener('click', async () => { await auth(url) })


routing()

async function auth(url) {

    let response
    let serverResponse // Ответ сервера Объект
    userName = document.getElementById('username').value
    user = {
        userName,
        action: 'find'
    }

    try {
        response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Ошибка:', error);
    }

    serverResponse = await response.json()

    console.log(serverResponse)

    if (serverResponse.isFind) {

        let sessionData = {
            'userName': serverResponse.userName,
            'access': serverResponse.access
        }

        console.log(serverResponse.isFind)
        sessionStorage.setItem('isLogin', JSON.stringify(sessionData))


        await routing(serverResponse)
    }

}

async function routing() {

    console.log('routing...')
    console.log(sessionStorage.getItem('isLogin'))

    let sessionData = JSON.parse(sessionStorage.getItem('isLogin'))

    console.log(sessionData)

    if (sessionData.access === 'Admin') {
        console.log('routing... to ', accountURL)
        window.location.href = adminURL
    }

    if (sessionData.access === 'User') {
        console.log('routing... to ', accountURL)
        window.location.href = userURL
    }
}


