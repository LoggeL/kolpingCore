const fns = require('date-fns')

module.exports = {
    registrationSuccessful: (data) => ({
        "subject": `Deine Theater Anmeldung!`,
        "html": `
<p>
Hallo ${data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;")} ${data.surname.replace(/</g, "&lt;").replace(/>/g, "&gt;")}, <br>
<br>
hiermit bestätigen wir dir deine Anmeldung zu unserem diesjährigen Open-Air-Theater. Deine Anmeldung lautet: <br>
Name: ${data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;")} ${data.surname.replace(/</g, "&lt;").replace(/>/g, "&gt;")} <br>
Datum & Uhrzeit: ${fns.format(new Date(data.date), 'dd/MM/yyyy HH:mm')}<br>
Personenanzahl: ${data.people_count}<br>
<br>
Wir freuen uns dich bei unseren Aufführungen begrüßen zu dürfen.<br>
<br>
Dein Theaterteam<br>
<br>
Wenn du noch Fragen zur Veranstaltung stehen wir dir unter sebastian.sattler11@web.de zur Verfügung.<br>
<br>
Um unkompliziert einchecken zu können, könnt ihr das untere Ticket ausgedruckt oder digital mitbringen. Es gilt für alle Personen, die sich über diesen Account angemeldet haben.<br>
<br>
<a href="http://theater.kolping-ramsen.de/ticket.html?${data.token}">EINTRITTSTICKET</a>
</p>`}),
    unregistrationSuccessful: (data) => ({
        "subject": `Deine Theater Stornierung!`,
        "html": `<p>
Hallo ${data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;")} ${data.surname.replace(/</g, "&lt;").replace(/>/g, "&gt;")}, <br>
du hast folgende Anmeldung storniert:<br>
<br>
Name: ${data.name.replace(/</g, "&lt;").replace(/>/g, "&gt;")} ${data.surname.replace(/</g, "&lt;").replace(/>/g, "&gt;")}<br>
Datum & Uhrzeit: ${fns.format(new Date(data.date), 'dd/MM/yyyy HH:mm')}<br>
Personenzahl: ${data.people_count}<br>
<br>
Du möchtest dich für einen anderen Termin anmelden? Klicke dafür <a href="http://theater.kolping-ramsen.de/anmeldung.html">HIER</a>.<br>
Wenn du noch Fragen hast stehen wir dir unter sebastian.sattler11@web.de zur Verfügung.<br>
<br>
Dein Theaterteam<br>
<br>
Du möchtest deine Anmeldung stornieren? Klicke dafür auf <a href="https://kolping.logge.top/api/public/theater/registration/delete/${data.token}">STORNIEREN</a>.<br>
</p>`
    })
}
