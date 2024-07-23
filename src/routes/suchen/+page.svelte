<script lang="ts">
    import PageTitle from "$lib/PageTitle.svelte";
    import { allPeople } from "$lib";
    import PeopleTable from "$lib/PeopleTable.svelte";

    let search = "";

    $: peopleResults = $allPeople.filter(person => {
        return person.firstname.toLowerCase().includes(search.toLowerCase()) || person.lastname.toLowerCase().includes(search.toLowerCase());
    });
</script>

<PageTitle title="Suchen" />

<input type="text" class="shadow-sm border w-full p-4 text-3xl mb-8" placeholder="Suchbegriff" bind:value={search}>

<PeopleTable data={peopleResults} hideSearch={true} />