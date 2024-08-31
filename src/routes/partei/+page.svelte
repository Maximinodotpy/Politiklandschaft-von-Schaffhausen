<script lang="ts">
    // Get the name of the gemeinde which is in the url
    import { page } from "$app/stores";
    import {
        allPeopleGroupedByParty,
        partiesMatchedWithWhereTheyAreRepresentedLegaslitativaly,
        partiesMatchedWithWhereTheyAreRepresentedExekutivaly,

        type PersonData

    } from "$lib/index";
    import PeopleTable from "$lib/PeopleTable.svelte";
    import CommunityList from "$lib/CommunityList.svelte";
    import PageTitle from "$lib/PageTitle.svelte";

    let partyName = $page.url.searchParams.get("p") as string;

    let thisParty: PersonData[] = [];

    let noSuchParty = false;

    allPeopleGroupedByParty.subscribe((data) => {
        if (partyName in data) {
            thisParty = data[partyName];
            noSuchParty = false;
        } else {
            noSuchParty = true;
        }
    });
</script>

{#if noSuchParty}
    <p>Es gibt keine Partei mit dem Namen "{partyName}"</p>

    <p>Zurück zur <a href="/">Homepage</a></p>
{:else}
    <PageTitle title={partyName} category="Partei" />
    
    {#if !(partyName in $allPeopleGroupedByParty) || thisParty?.length == 0}
        <p>Daten werden geladen ...</p>
    {:else}
        <div class="mb-20">
            <h2 class="tracking-widest text-2xl mb-4">Alle Personen in dieser Partei ({thisParty?.length})</h2>
    
            <PeopleTable data={thisParty} hideParty={true} tableName={partyName} />
        </div>
    
        <div class="grid md:grid-cols-2 gap-4">
            <div class="mb-20">
                <h2 class="tracking-widest text-2xl mb-4">Vertreten in Folgenden Exekutiven</h2>
            
                <CommunityList communities={$partiesMatchedWithWhereTheyAreRepresentedExekutivaly[partyName]} />
            </div>
            
            <div class="mb-20">
                <h2 class="tracking-widest text-2xl mb-4">Vertreten in Folgenden Legislativen</h2>
            
                <CommunityList communities={$partiesMatchedWithWhereTheyAreRepresentedLegaslitativaly[partyName]} />
            </div>
        </div>
    {/if}
{/if}