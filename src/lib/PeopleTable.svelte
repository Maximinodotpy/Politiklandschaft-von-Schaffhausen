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

    let facts_about_found_people = false
    
    $: filteredData = data.filter(person => {
        let shouldShow = true;

        if (searchTerm) {
            // Check if there is something like this Partei:SVP and only search this in the party
            if (searchTerm.includes('Partei:')) {
                const party = searchTerm.split(':')[1].trim();
                shouldShow = person.party.toLowerCase().includes(party.toLowerCase())
            } else {
                shouldShow = person.firstname.toLowerCase().includes(searchTerm.toLowerCase())
                ||
                person.lastname.toLowerCase().includes(searchTerm.toLowerCase())
                ||
                person.party.toLowerCase().includes(searchTerm.toLowerCase())
            }
        }

        return shouldShow
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


    $: fact_data = facts_about_found_people ? filteredData : data;


    $: femaleToMaleRatio = getFemaletoMaleRatio(fact_data);

    // Geburtstags-Statistiken
    $: all_birthyears_are_known = fact_data.every(person => {
        return person.birthyear != null;
    });

    $: youngest_person = fact_data.sort((a, b) => (b.birthyear||0) - (a.birthyear||0))[0];
    $: oldest_person = fact_data.sort((a, b) => (a.birthyear||0) - (b.birthyear||0))[0];

    $: people_born_after_2000 = fact_data.filter(person => (person.birthyear || 0) > 2000);
    $: people_born_before_1950 = fact_data.filter(person => (person.birthyear || Infinity) < 1950);

    $: average_age = Math.round(fact_data.reduce((acc, person) => acc + (moment().year() - (person.birthyear || 0)), 0) / fact_data.length);

    $: retirement_age = 67;

    $: retirement_age_reached = fact_data.filter(person => (person.birthyear || 0) + retirement_age <= moment().year());

    $: number_of_people_older_than_60 = fact_data.filter(person => (person.birthyear || 0) + 60 <= moment().year()).length;

    // Amtszeit-Statistiken
    $: all_start_years_are_known = fact_data.every(person => {
        return person.since != null;
    });

    // Durschnittliche Amtszeit
    $: average_since = Math.round(fact_data.reduce((acc, person) => acc + (moment().year() - (person.since || 0)), 0) / data.length);
</script>

<TableSearch placeholder="Suchen (Vorname, Nachname, Partei oder Partei:[Partei Name])" hoverable={true} bind:inputValue={searchTerm} divClass="border" searchClass="{ hideSearch ? 'hidden': '' }" striped={true} svgClass="hidden" inputClass="w-full p-2 border rounded-md">
    <caption class="px-5 pb-5 text-left">
        <div class="text-left text-gray-900 bg-white mb-4">
            <div class="text-lg font-semibold">
                Zu dieser Tabelle
            </div>
            (<label for="facts_about_found_people" class="inline-flex items-center gap-1">
                    Anhand von Suche
                    <input type="checkbox" name="" id="facts_about_found_people" bind:checked={facts_about_found_people}>
                </label>)
        </div>

        <div class="grid lg:grid-cols-3 text-sm font-normal text-gray-500 dark:text-gray-400 gap-5">
            <div><b>{femaleToMaleRatio.male}</b> Männer ({femaleToMaleRatio.male_percent}%)</div>
            <div><b>{femaleToMaleRatio.female}</b> Frauen ({femaleToMaleRatio.female_percent}%)</div>

            {#if all_birthyears_are_known}
                {#if oldest_person && youngest_person}
                    <div><b>Ältester</b> {oldest_person?.firstname} {oldest_person?.lastname} (Jg. {oldest_person.birthyear})</div>
                    <div><b>Jüngster</b> {youngest_person?.firstname} {youngest_person?.lastname} (Jg. {youngest_person.birthyear})</div>
                {/if}
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