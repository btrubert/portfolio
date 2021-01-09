export function timestampToStringCompact (ts: number) {
    let d = new Date(ts*1000)
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
}


export function timestampToStringFull (ts: number, loc: string ='fr') {
    let month: Array<string>
    let day: Array<string>
    let d = new Date(ts*1000)
    if (loc === 'fr') {
        month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
        day = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    } else {
        month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Septembre', 'Octobre', 'Novembre', 'Decembre']
        day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
    return `${day[d.getDay()]} ${d.getDate()} ${month[d.getMonth()]} ${d.getFullYear()}`
}
