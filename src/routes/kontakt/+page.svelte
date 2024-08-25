<script lang="ts">
    import { page } from "$app/stores";
    import { allPeople } from "$lib/index";
    import PeopleTable from "$lib/PeopleTable.svelte";
    import type { GroupData } from "$lib/index";
    import PageTitle from "$lib/PageTitle.svelte";

    const withEmail = $allPeople.filter((person) => person.email);

    let group: GroupData;
</script>

<PageTitle title="Kontakte" />

<!-- A table of all people with an E-Mail -->
<PeopleTable data={withEmail} tableName="Kontakte" />