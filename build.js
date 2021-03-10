const fs = require('fs')
const tabletop = require('tabletop');

const categories = {
    "Lobbyregister": "Unter einem Lobbyregister versteht man eine öffentliche Liste von allen Lobbyist:innen, welche als Mitglied bestimmter Gruppen wie etwa Unternehmen oder in deren Auftrag auf den politischen Prozess in schriftlicher oder sonstiger Weise Einfluss nehmen wollen.",
    "Legislativer Fußabdruck": "Manchmal auch exekutiver Fußabdruck genannt. Inhaltliche und chronologische Aufzeichnung der Entstehung einer Gesetzesvorlage sowie Nennung der an der Entstehung Beteiligten und ihrer Beiträge. So soll transparent werden, welche Interessen sich möglicherweise in Gesetzesvorhaben widerspiegeln.",
    "Karenzzeit": "Eine „Wartezeit, Sperrfrist, vor deren Ablauf eine bestimmte Erlaubnis nicht erteilt wird“. In der Politik bedeutet eine Karenzzeit, dass aus ihrem Amt ausgeschiedene Regierungsmitglieder und SpitzenbeamtInnen bis zu einem Wechsel in die Privatwirtschaft eine bestimmte Zeit warten müssen.",
    "Verhaltensregeln": "Verhaltensregeln listen eine Reihe von Anzeigepflichten und Verbotstatbeständen auf und enthalten meist auch Sanktionen. Sie stehen in einem Spannungsfeld zum Grundsatz der freien Mandatsausübung und dienen der Sicherung der Integrität des Handelns der Volksvertreter."
};


tabletop.init({
    key: '1eMAdjdADNSFxl1J2IV15G0byzb5cVHEh-G8u0inasJY',
    parseNumbers: true,
    callback(data) {
        const states = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value.elements])
        );
        fs.writeFileSync(
            'static/js/data.json',
            JSON.stringify({categories, states})
        );
    }
});

