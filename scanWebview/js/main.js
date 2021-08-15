const key = document.getElementById('key').value
fetch('/api/public/theater/checkin', {
    method: 'POST',
    body: new URLSearchParams(jsonToQS({ checkIn: key })),
}).then(response => response.json()).then(json => {
    if (json.error === "Kein Token") {
        console.log('Check')
        // Dis good
        QrScanner.WORKER_PATH = 'js/qr-scanner-worker.min.js'
        const videoElem = document.getElementById('scannerArea')
        const qrScanner = new QrScanner(videoElem, result => {
            if (!result.startsWith('http://theater.kolping-ramsen.de/ticket.html?')) return alert('Ungültiges Code Format')
            const token = result.replace('http://theater.kolping-ramsen.de/ticket.html?', '')
            qrScanner.stop()
            console.log('decoded qr code:', result)
            fetch('/api/public/theater/checkin', {
                method: 'POST',
                body: new URLSearchParams(jsonToQS({ checkIn: key, token })),
            }).then(response => response.json()).then(json => {
                if (json.error) {
                    return alert(json.error)
                }
                alert(`${json.eventname}\n${json.name} ${json.surname}\nAnzahl: ${json.people_count}`)
                setTimeout(() => qrScanner.start(), 1000)
            })

        })
        qrScanner.start()

    }
})

function jsonToQS(json) {
    var qs = []
    for (element in json) {
        qs.push(element + "=" + json[element])
    }
    return "?" + qs.join("&")
}