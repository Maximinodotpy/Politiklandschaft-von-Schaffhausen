<script lang="ts">
    import type { PersonData } from "$lib";
    import  { base } from '$app/paths';
    import {
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        TableSearch
    } from 'flowbite-svelte';
    import { exportAsCSV } from "./helpers";

    export let data: PersonData[];
    export let searchTerm: string = '';
    export let hideParty: boolean = false;
    export let hidePlace: boolean = true;
    export let hideSearch: boolean = false;
    export let tableName: string = 'Personen';
    
    $: femaleToMaleRatio = getFemaletoMaleRatio(data);
    $: filteredData = data.filter(person => {
        return person.firstname.toLowerCase().includes(searchTerm.toLowerCase()) || person.lastname.toLowerCase().includes(searchTerm.toLowerCase());
    });

    function getFemaletoMaleRatio(data: PersonData[]) {
        let male = data.filter(person => person.gender == 'M').length
        let female = data.filter(person => person.gender == 'F').length

        return {
            male, female, ratio: female/male, count: data.length
        }
    }

    function downloadAsCSV() {
        exportAsCSV(data, tableName);
    }

    function downloadAsJSON() {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tableName}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
</script>

<TableSearch placeholder="Suchen" hoverable={true} bind:inputValue={searchTerm} divClass="border" searchClass="{ hideSearch ? 'hidden': '' }">
    <caption class="px-5 pb-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
        Zu dieser Tabelle
        <div class="grid grid-cols-2">
            <div class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                <ul class="grid md:grid-cols-6 grid-cols-3">
                    <li>{femaleToMaleRatio.male} Männer</li>
                    <li>{femaleToMaleRatio.female} Frauen</li>
                    <li>{Math.round(femaleToMaleRatio.female/femaleToMaleRatio.count*100)}% Frauen</li>
                </ul>
            </div>
            <div class="flex gap-3 items-center">
                Herunterladen als
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" on:click={downloadAsCSV}>
                    CSV
                </button>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" on:click={downloadAsJSON}>
                    JSON
                </button>
            </div>
        </div>
    </caption>
    <TableHead>
        <TableHeadCell>Vorname</TableHeadCell>
        <TableHeadCell>Nachname</TableHeadCell>
        <TableHeadCell class="{hideParty ? 'hidden': ''}">Partei</TableHeadCell>
        <TableHeadCell class="hidden md:table-cell">Geburtsjahr</TableHeadCell>
        <TableHeadCell class="hidden md:table-cell">Aufgaben</TableHeadCell>
        <TableHeadCell class="hidden md:table-cell">Seit</TableHeadCell>
        <TableHeadCell class="hidden md:table-cell">Bild</TableHeadCell>
        <TableHeadCell class="hidden md:table-cell">Kontakt</TableHeadCell>
        <!-- <TableHeadCell class="hidden md:table-cell">G</TableHeadCell> -->
    </TableHead>
    <TableBody>
        {#each filteredData as person}
            <TableBodyRow>
                <TableBodyCell>{person.firstname ?? ''}</TableBodyCell>
                <TableBodyCell>{person.lastname ?? ''}</TableBodyCell>
                <TableBodyCell class="{hideParty ? 'hidden': ''}">
                    <a href="{base}/partei?p={person.party}">{person.party ?? ''}</a>
                </TableBodyCell>
                <TableBodyCell class="hidden md:table-cell">{person.birthyear ?? ''}</TableBodyCell>
                <TableBodyCell class="hidden md:table-cell">{person.tasks ?? ''}</TableBodyCell>
                <TableBodyCell class="hidden md:table-cell">{person.since ?? ''}</TableBodyCell>
                <TableBodyCell class="hidden md:table-cell">
                    <a href="{person.image}" target="_blank" class="text-xs">
                        <img src={person.image} width="70" alt={person.firstname + " " + person.lastname} />
                    </a>
                </TableBodyCell>
                <TableBodyCell class="hidden md:table-cell">
                    {#if person.email}
                        <a class="no-underline block p-4w" href="mailto:{person.email ?? ''}">✉️</a>
                    {/if}
                </TableBodyCell>
                <!-- <TableBodyCell class="hidden md:table-cell">{person.gender ?? ''}</TableBodyCell> -->
            </TableBodyRow>
        {/each}
    </TableBody>
</TableSearch>