let appInfo = require('../../package.json');
let appName = appInfo.name + ' Version ' + appInfo.version;
$('#appName').html(appName);

auslesen();

// =================================================
// Reads everything from the JSON file
// =================================================
function auslesen() {
    let cl      = require('../json/changelog.json');
    let entries = cl.entries;
    let l       = entries.length;
    let content  = '';
    let type;
    let changed;

    // Loop all entries
    for (let i = 0; i <= l - 1; i++) {
        // A heading and list for each entry
        content += `<h3 class='lead'>Version ${entries[i].version} (<span class='smallTxt' style='padding:5px;'>${entries[i].date}</span>)</h3>`;
        content += `<ul class="list-style-none">`;
        let el = entries[i].contents.length;
        let typeBefore = '';

        // Go through contents
        for (let a = 0; a <= el - 1; a++) {
            type = entries[i].contents[a].type;
            changed = entries[i].contents[a].changed;

            if (typeBefore === entries[i].contents[a].type) {
                content += `
                <br>- <span class='text'>${changed}</span>`
            } else {

                if (typeBefore !== '') {
                    content += `</li>`
                }
                content += `
                <li>
                    <div class="badge badge-${type}">${type}</div>
                    - <span class='text'>${changed}</span>`
            }

            typeBefore = type
        }

        // Close list
        content += '</ul><hr/>'
    }

    // Fill Changelog
    $('#changelog').html(content)
}

$("#createdBy").click(function () {
    const {
        shell
    } = require("electron");
    shell.openExternal("https://www.michael-lucas.net");
});