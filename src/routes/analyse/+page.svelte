<script lang="ts">
    import {
        exikutivenlistData,
        globalData,
        allPeopleGroupedByParty,
    } from "$lib";
    import GroupList from "$lib/GroupList.svelte";
    import PageTitle from "$lib/PageTitle.svelte";
    import ListTitle from "$lib/ListTitle.svelte";

    const exekutivenMitNurMännern = $exikutivenlistData.filter(exekutive => {
        let people = $globalData[exekutive].people
        let onlyMen = people.every(person => {
            return person.gender == "M"
        })
        return onlyMen
    })

    const exekutivenMitNurFrauen = $exikutivenlistData.filter(exekutive => {
        let people = $globalData[exekutive].people
        let onlyWomen = people.every(person => {
            return person.gender == "F"
        })
        return onlyWomen
    })

    const exekutivenMitGeraderAnzahlRätinnenUndRäten = $exikutivenlistData.filter(exekutive => {
        let people = $globalData[exekutive].people
        
        return people.length % 2 == 0
    })

    const parteinSortiertNachAnzahlPersonen = Object.entries($allPeopleGroupedByParty).sort((a, b) => {
        return b[1].length - a[1].length
    })

    console.log(parteinSortiertNachAnzahlPersonen);
</script>

<PageTitle title="Analyse" />

<!-- Exekutiven die nur aus Männern oder Frauen bestehen -->

<div class="grid grid-cols-3 gap-8">
    <div>
        <ListTitle title="Exekutiven mit nur Männern" />
        <GroupList groups={exekutivenMitNurMännern} />
    </div>
    
    <div>
        <ListTitle title="Exekutiven mit nur Frauen" />
        <GroupList groups={exekutivenMitNurFrauen} />
    </div>

    <div>
        <ListTitle title="Exekutiven mit einer geraden Anzahl Rätinnen und Räten" />
        <GroupList groups={exekutivenMitGeraderAnzahlRätinnenUndRäten} />
    </div>

    <div>
        <ListTitle title="Parteienranking nach Anzahl Mandaten" />
        <ul>
            {#each parteinSortiertNachAnzahlPersonen as [partei, personen], i}
                <li class="flex justify-between">
                    <div class="flex">
                        <span class="opacity-50 w-8">{i + 1}.</span>
                        <a href="/partei?p={partei}">{partei}</a>
                    </div>

                    <div>{personen.length}</div>
                </li>
            {/each}
        </ul>
    </div>
</div>

