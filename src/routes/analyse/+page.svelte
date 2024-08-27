<script lang="ts">
    import {
        exikutivenlistData,
        globalData,
        allPeopleGroupedByParty,
        allPeople,
    } from "$lib";
    import GroupList from "$lib/GroupList.svelte";
    import PageTitle from "$lib/PageTitle.svelte";
    import ListTitle from "$lib/ListTitle.svelte";
    import ColumnChart from "$lib/ColumnChart.svelte";
    import PeopleTable from "$lib/PeopleTable.svelte";
    import RankedList from "$lib/RankedList.svelte";

    let menColor = "#03FAFF";
    let womenColor = "#E503FF";

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
    }).map(([partei, people]) => {
        return [partei, people.length]
    })

    let anzahlMännerProPartei: {x: string, y: number}[] = []
    for (let partei in $allPeopleGroupedByParty) {
        let count = $allPeopleGroupedByParty[partei].filter(person => {
            return person.gender == "M"
        }).length

        anzahlMännerProPartei.push({
            x: partei,
            y: count
        })
    }
    
    let anzahlFrauenProPartei: {x: string, y: number}[] = []
    for (let partei in $allPeopleGroupedByParty) {
        let count = $allPeopleGroupedByParty[partei].filter(person => {
            return person.gender == "F"
        }).length

        anzahlFrauenProPartei.push({
            x: partei,
            y: count
        })
    }

    const gemeindenWoEinVornameMehrAlsEinmalVorkommt = $exikutivenlistData.filter(exekutive => {
        let people = $globalData[exekutive].people
        let names = people.map(person => person.firstname)
        let namesSet = new Set(names)
        return names.length != namesSet.size
    })

    const gemeindenWoEinNachnameMehrAlsEinmalVorkommt = $exikutivenlistData.filter(exekutive => {
        let people = $globalData[exekutive].people
        let names = people.map(person => person.lastname)
        let namesSet = new Set(names)
        return names.length != namesSet.size
    })


    let zehnHaeufigsteVornamen: { [key: string]: number } = {}

    $allPeople.forEach(person => {
        if (zehnHaeufigsteVornamen[person.firstname]) {
            zehnHaeufigsteVornamen[person.firstname] += 1
        } else {
            zehnHaeufigsteVornamen[person.firstname] = 1
        }
    })

    zehnHaeufigsteVornamen = Object.entries(zehnHaeufigsteVornamen).sort((a, b) => {
        return b[1] - a[1]
    }).slice(0, 10).reduce((acc, [name, count]) => {
        acc[name] = count
        return acc
    }, {})

    console.log(Object.entries(zehnHaeufigsteVornamen).sort((a, b) => {
        return b[1] - a[1]
    }), 'hel');
    
    let zehnHaeufigsteVornamenSortiert = Object.entries(zehnHaeufigsteVornamen).sort((a, b) => {return b[1] - a[1]})

    console.log(zehnHaeufigsteVornamen, 'gas');
    console.log(gemeindenWoEinVornameMehrAlsEinmalVorkommt, 'fas');
</script>

<PageTitle title="Analyse" />

<!-- Exekutiven die nur aus Männern oder Frauen bestehen -->
<div class="grid md:grid-cols-3 gap-8">
    <div class="bg-neutral-50 px-8 py-4 border">
        <ListTitle title="Exekutiven mit nur Männern" />
        <GroupList groups={exekutivenMitNurMännern} />
    </div>
    
    <div class="bg-neutral-50 px-8 py-4 border">
        <ListTitle title="Exekutiven mit nur Frauen" />
        <GroupList groups={exekutivenMitNurFrauen} />
    </div>

    <div class="bg-neutral-50 px-8 py-4 border">
        <ListTitle title="Exekutiven mit einer geraden Anzahl Rätinnen und Räten" />
        <GroupList groups={exekutivenMitGeraderAnzahlRätinnenUndRäten} />
    </div>

    <div class="bg-neutral-50 px-8 py-4 border">
        <ListTitle title="Exekutiven wo es mehrere Menschen mit dem gleichen Vornamen hat" />
        <GroupList groups={gemeindenWoEinVornameMehrAlsEinmalVorkommt} />
    </div>

    <div class="bg-neutral-50 px-8 py-4 border">
        <ListTitle title="Exekutiven wo es mehrere Menschen mit dem gleichen Nachnamen hat" />
        <GroupList groups={gemeindenWoEinNachnameMehrAlsEinmalVorkommt} />
    </div>

    <div class="bg-neutral-50 px-8 py-4 border">
        <ListTitle title="Häufigste Vornamen" />
        <RankedList data={zehnHaeufigsteVornamenSortiert} name="Häufigste Vornamen" />
    </div>

    <div class="bg-neutral-50 px-8 py-4 border">
        <ListTitle title="Parteienranking nach Anzahl Mandaten" />
        <RankedList data={parteinSortiertNachAnzahlPersonen} name="Parteienranking nach Anzahl Mandaten" />
    </div>

    <div class="bg-neutral-50 px-8 py-4 border col-span-2">
        <ListTitle title="Parteienmandate mit Frau/Mann Anteile aufgeteilt nach Partei" />
        <ColumnChart data={[
            {
                name: "Frauen",
                color: womenColor,
                data: anzahlFrauenProPartei,
            },
            {
                name: "Männer",
                color: menColor,
                data: anzahlMännerProPartei,
            },
        ]} />
    </div>
</div>

