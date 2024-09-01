


export let exportAsCSV = (data: Array<{[key: string]: any}>, filename: string) => {
    let csv = "data:text/csv;charset=utf-8,";

    // Add the header
    csv += Object.keys(data[0]).join(",") + "\n";

    // Add the data
    for (let row of data) {
        csv += Object.values(row).join(",") + "\n";
    }

    // Create a link and click it
    let encodedUri = encodeURI(csv);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
}


export let partyToColor = (party: string) => {
    switch (party) {
        case "SVP":           return "71BE44";
        case "SP":            return "FE0000";
        case "Grüne":         return "84B414";
        case "GLP":           return "004B32";
        case "FDP":           return "00A0E2";
        case "EDU":           return "E60005";
        case "EVP":           return "F8DA00";
        case "Die Mitte":     return "FF9B00";
        case "Junge SVP":     return "000";
        case "Junge Grüne":   return "000";
        default:              return "000";
    }
}