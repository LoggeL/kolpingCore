QrScanner.WORKER_PATH = 'js/qr-scanner-worker.min.js'
const videoElem = document.getElementById('scannerArea')
const qrScanner = new QrScanner(videoElem, result => {
    qrScanner.stop()
    console.log('decoded qr code:', result)
    alert(result)
})
qrScanner.start()
