


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