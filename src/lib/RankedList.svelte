<script lang="ts">
    import { exportAsCSV } from "./helpers";

    export let data: Array<[string, number]>

    export let name: string = ""

    function downloadAsCSV() {
        exportAsCSV(data, name)
    }

    function downloadAsJSON() { 
        let json = JSON.stringify(data)
        let blob = new Blob([json], {type: "application/json"})
        let url = URL.createObjectURL(blob)
        let link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `${name}.json`)
        document.body.appendChild(link)
        link.click()
    }
</script>

<ul>
    {#each data as [name, count], i}
        <li class="flex justify-between">
            <div class="flex">
                <span class="opacity-50 w-8 text-right pr-1 font-mono">{i + 1}.</span>
                {name}
            </div>

            <div>{count}</div>
        </li>
    {/each}
</ul>

<div class="mt-3 flex justify-center gap-4">
    <button class="opacity-50 hover:opacity-100 transition-all" on:click={downloadAsCSV}>CSV</button>
    <button class="opacity-50 hover:opacity-100 transition-all" on:click={downloadAsJSON}>JSON</button>
</div>