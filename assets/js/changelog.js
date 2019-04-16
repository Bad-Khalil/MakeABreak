var appInfo = require('../../package.json')
var appName = appInfo.name + ' Version ' + appInfo.version
$('#appName').html(appName)

auslesen()

// =================================================
// Liest aus der JSON File alles aus
// =================================================
function auslesen() {
    // JSON auslesen
    var cl = require('../json/changelog.json')

    // Einträge
    var entries = cl.entries

    // Anzahl der Einträge
    var l = entries.length

    // Variablen initialisieren
    var inhalt = ''
    var art
    var artEben = ''
    var was

    // Alle Einträge durchgehen
    for (var i = 0; i <= l - 1; i++) {
        // Für jeden Eintrag eine Überschrift und Liste
        inhalt += `<h3 class='lead'>Version ${entries[i].version} (<span class='smallTxt' style='padding:5px;'>${entries[i].datum}</span>)</h3>`
        inhalt += `<ul class="list-style-none">`

        // Anzahl der Inhalte vom Eintrag
        var el = entries[i].inhalte.length

        // Inhalte durchgehen
        for (var a = 0; a <= el - 1; a++) {

            // Auslesen
            art = entries[i].inhalte[a].art
            was = entries[i].inhalte[a].was

            if (artEben === entries[i].inhalte[a].art) {
                inhalt += `
        <br>- <span class='text'>${was}</span>`
            } else {

                if (artEben !== '') {
                    inhalt += `</li>`
                }
                inhalt += `
          <li>
            <div class="badge badge-${art}">${art}</div>
            - <span class='text'>${was}</span>`
            }

            artEben = art
        }

        // Liste schließen
        inhalt += '</ul><hr/>'
    }

    // Changelog füllen
    $('#changelog').html(inhalt)
}

$("#createdBy").click(function () {
    const {
        shell
    } = require("electron");
    shell.openExternal("https://www.michael-lucas.net");
})