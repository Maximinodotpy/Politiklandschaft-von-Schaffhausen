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

    export let data: PersonData[];
    export let searchTerm: string = '';
    export let hideParty: boolean = false;
    export let hidePlace: boolean = true;
    export let hideSearch: boolean = false;
    
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

</script>

<TableSearch placeholder="Suchen" hoverable={true} bind:inputValue={searchTerm} divClass="border" searchClass="{ hideSearch ? 'hidden': '' }">
    <caption class="px-5 pb-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
        Infos zu dieser Tabelle
        <div class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            <ul class="grid md:grid-cols-6 grid-cols-3">
                <li>{femaleToMaleRatio.male} Männer</li>
                <li>{femaleToMaleRatio.female} Frauen</li>
                <li>{Math.round(femaleToMaleRatio.female/femaleToMaleRatio.count*100)}% Frauen</li>
            </ul>
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
                <!-- <TableBodyCell class="hidden md:table-cell">{person.gender ?? ''}</TableBodyCell> -->
            </TableBodyRow>
        {/each}
    </TableBody>
</TableSearch>