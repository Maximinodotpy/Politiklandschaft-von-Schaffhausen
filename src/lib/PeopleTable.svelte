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
    import { partyToColor } from "./helpers";

    export let data: PersonData[];
    export let searchTerm: string = '';
    export let hideParty: boolean = false;
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


    let all_birthyears_are_known = data.every(person => {
        return person.birthyear != null;
    });

    let youngest_person = data.sort((a, b) => (b.birthyear||0) - (a.birthyear||0))[0];
    let oldest_person = data.sort((a, b) => (a.birthyear||0) - (b.birthyear||0))[0];

    let people_born_after_2000 = data.filter(person => (person.birthyear || 0) > 2000);
    let people_born_before_1950 = data.filter(person => (person.birthyear || Infinity) < 1950);
</script>

<TableSearch placeholder="Suchen" hoverable={true} bind:inputValue={searchTerm} divClass="border" searchClass="{ hideSearch ? 'hidden': '' }" striped={true}>
    <caption class="px-5 pb-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
        Zu dieser Tabelle
        <div class="grid md:grid-cols-2">
            <div class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                <ul class="grid grid-cols-3">
                    <li>{femaleToMaleRatio.male} Männer</li>
                    <li>{femaleToMaleRatio.female} Frauen</li>
                    <li>{Math.round(femaleToMaleRatio.female/femaleToMaleRatio.count*100)}% Frauen</li>
                </ul>
            </div>

            {#if all_birthyears_are_known}
                <div class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400 grid gap-2">
                    <div><b>Ältester</b> {oldest_person.firstname} {oldest_person.lastname} (Jg. {oldest_person.birthyear})</div>
                    <div><b>Jüngster</b> {youngest_person.firstname} {youngest_person.lastname} (Jg. {youngest_person.birthyear})</div>
                    
                    <div>
                        <b>Personen die nach 2000 geboren sind ({people_born_after_2000.length})</b>
    
                        {#if people_born_after_2000.length > 0}
                            <ul class="list-disc list-outside ml-5">
                                {#each people_born_after_2000 as person}
                                    <li>{person.firstname} {person.lastname} (Jg. {person.birthyear})</li>
                                {/each}
                            </ul>
                        {/if}
                    </div>

                    <div>
                        <b>Personen die vor 1950 geboren sind ({people_born_before_1950.length})</b>
    
                        {#if people_born_before_1950.length > 0}
                            <ul class="list-disc list-outside ml-5">
                                {#each people_born_before_1950 as person}
                                    <li>{person.firstname} {person.lastname} (Jg. {person.birthyear})</li>
                                {/each}
                            </ul>
                        {/if}
                    </div>
                </div>
            {/if}
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
                        <img src={person.image || `https://placehold.co/70x70/${partyToColor(person.party)}/fff?text=${person.firstname[0]+person.lastname[0]}`} width="70" alt={person.firstname + " " + person.lastname} />
                    </a>
                </TableBodyCell>
                <TableBodyCell class="hidden md:table-cell">
                    {#if person.email}
                        <a class="no-underline block p-4w" href="mailto:{person.email ?? ''}">✉️</a>
                    {/if}
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</TableSearch>

<div class="flex gap-3 items-center p-4 mt-4">
    <button on:click={downloadAsCSV} class="opacity-50 hover:opacity-100 transition-all">CSV</button>
    <button on:click={downloadAsJSON} class="opacity-50 hover:opacity-100 transition-all">JSON</button>
</div>