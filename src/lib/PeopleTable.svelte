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
    import moment from "moment";

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

        let male_percent = Math.round(male / data.length * 100);
        let female_percent = Math.round(female / data.length * 100);

        return {
            male, female, ratio: female/male, count: data.length,
            male_percent,
            female_percent,
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


    // Geburtstags-Statistiken
    let all_birthyears_are_known = data.every(person => {
        return person.birthyear != null;
    });

    let youngest_person = data.sort((a, b) => (b.birthyear||0) - (a.birthyear||0))[0];
    let oldest_person = data.sort((a, b) => (a.birthyear||0) - (b.birthyear||0))[0];

    let people_born_after_2000 = data.filter(person => (person.birthyear || 0) > 2000);
    let people_born_before_1950 = data.filter(person => (person.birthyear || Infinity) < 1950);

    let average_age = Math.round(data.reduce((acc, person) => acc + (moment().year() - (person.birthyear || 0)), 0) / data.length);

    let retirement_age = 67;

    let retirement_age_reached = data.filter(person => (person.birthyear || 0) + retirement_age <= moment().year());

    let number_of_people_older_than_60 = data.filter(person => (person.birthyear || 0) + 60 <= moment().year()).length;

    // Amtszeit-Statistiken
    let all_start_years_are_known = data.every(person => {
        return person.since != null;
    });

    // Durschnittliche Amtszeit
    let average_since = Math.round(data.reduce((acc, person) => acc + (moment().year() - (person.since || 0)), 0) / data.length);

    
</script>

<TableSearch placeholder="Suchen" hoverable={true} bind:inputValue={searchTerm} divClass="border" searchClass="{ hideSearch ? 'hidden': '' }" striped={true} svgClass="hidden" inputClass="w-full p-2 border rounded-md">
    <caption class="px-5 pb-5 text-left">
        <div class="text-lg font-semibold text-left text-gray-900 bg-white mb-4">Zu dieser Tabelle</div>

        <div class="grid lg:grid-cols-3 text-sm font-normal text-gray-500 dark:text-gray-400 gap-5">
            <div><b>{femaleToMaleRatio.male}</b> Männer ({femaleToMaleRatio.male_percent}%)</div>
            <div><b>{femaleToMaleRatio.female}</b> Frauen ({femaleToMaleRatio.female_percent}%)</div>

            {#if all_birthyears_are_known}
                <div><b>Ältester</b> {oldest_person.firstname} {oldest_person.lastname} (Jg. {oldest_person.birthyear})</div>
                <div><b>Jüngster</b> {youngest_person.firstname} {youngest_person.lastname} (Jg. {youngest_person.birthyear})</div>
                <div><b>Durchschnittsalter</b> {average_age} Jahre</div>
                
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

                <div>
                    <b>Personen die das Rentenalter ({retirement_age}) erreicht haben ({retirement_age_reached.length})</b>

                    {#if retirement_age_reached.length > 0}
                        <ul class="list-disc list-outside ml-5">
                            {#each retirement_age_reached as person}
                                <li>{person.firstname} {person.lastname} (Jg. {person.birthyear})</li>
                            {/each}
                        </ul>
                    {/if}
                </div>

                <div>
                    <b>{number_of_people_older_than_60}</b>
                    Personen die mindestens 60 Jahre alt sind 
                </div>
            {/if}

            {#if all_start_years_are_known}
                <div><b>Durchschnittliche Amtszeit</b> {average_since} Jahre</div>
            {/if}
        </div>
    </caption>
    <TableHead>
        <TableHeadCell class="p-2 md:p-4">Vorname</TableHeadCell>
        <TableHeadCell class="p-2 md:p-4">Nachname</TableHeadCell>
        <TableHeadCell class="{hideParty ? 'hidden': ''} p-2 md:p-4">Partei</TableHeadCell>
        <TableHeadCell class="hidden md:table-cell">Geburtsjahr</TableHeadCell>
        <TableHeadCell class="hidden md:table-cell">Aufgaben</TableHeadCell>
        <TableHeadCell class="hidden md:table-cell">Seit</TableHeadCell>
        <TableHeadCell class="hidden md:table-cell">Bild</TableHeadCell>
        <TableHeadCell class="hidden md:table-cell">Kontakt</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each filteredData as person}
            <TableBodyRow>
                <TableBodyCell tdClass="p-2 md:p-4">{person.firstname ?? ''}</TableBodyCell>
                <TableBodyCell tdClass="p-2 md:p-4">{person.lastname ?? ''}</TableBodyCell>
                <TableBodyCell class="{hideParty ? 'hidden': ''}" tdClass="p-2 md:p-4">
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