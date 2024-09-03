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
    import RankedList from "$lib/RankedList.svelte";
    import Card from "$lib/Card.svelte";
    import AnalyseGruppe from "./AnalyseGruppe.svelte";
    import ExportableTable from "$lib/ExportableTable.svelte";
    import { chapters } from "./chapters";

    chapters.update((chapters) => {
        chapters = []
        return chapters;
    });

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
    
    let zehnHaeufigsteVornamenSortiert = Object.entries(zehnHaeufigsteVornamen).sort((a, b) => {return b[1] - a[1]})

    // Gemeinde wo es mehr Frauen als Männer gibt
    let gemeindenWoEsMehrFrauenAlsMännerGibt = $exikutivenlistData.filter(exekutive => {
        let people = $globalData[exekutive].people

        let women = people.filter(person => person.gender == "F").length
        let men = people.filter(person => person.gender == "M").length

        return women > men
    })


    // Personen die mehrere male vorkommen / mehrere Mandate haben
    let peopleWithMultipleMandates = $allPeople.filter(person => {
        let people = $allPeople.filter(p => p.firstname == person.firstname && p.lastname == person.lastname)
        return people.length > 1
    })

    // Merge single people with multiple mandates
    peopleWithMultipleMandates = peopleWithMultipleMandates.reduce((acc, person) => {
        let people = $allPeople.filter(p => p.firstname == person.firstname && p.lastname == person.lastname)
        acc.push(people)
        return acc
    }, [])

    console.log('Hallo', peopleWithMultipleMandates);
</script>

<PageTitle title="Analyse" />

<AnalyseGruppe title="Geschlechter">
    <Card>
        <ListTitle title="Exekutiven mit nur Männern" />
        <GroupList groups={exekutivenMitNurMännern} />
    </Card>
    
    <Card>
        <ListTitle title="Exekutiven mit nur Frauen" />
        <GroupList groups={exekutivenMitNurFrauen} />
    </Card>

    <Card>
        <ListTitle title="Gemeinderäte wo es mehr Frauen als Männer gibt" />
        <GroupList groups={gemeindenWoEsMehrFrauenAlsMännerGibt} />
    </Card>

    <Card extra_classes="col-span-2">
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
    </Card>
</AnalyseGruppe>

<AnalyseGruppe title="Namen">
    <Card>
        <ListTitle title="Exekutiven wo es mehrere Menschen mit dem gleichen Vornamen hat" />
        <GroupList groups={gemeindenWoEinVornameMehrAlsEinmalVorkommt} />
    </Card>

    <Card>
        <ListTitle title="Exekutiven wo es mehrere Menschen mit dem gleichen Nachnamen hat" />
        <GroupList groups={gemeindenWoEinNachnameMehrAlsEinmalVorkommt} />
    </Card>

    <Card>
        <ListTitle title="Häufigste Vornamen" />
        <RankedList data={zehnHaeufigsteVornamenSortiert} name="Häufigste Vornamen" />
    </Card>
</AnalyseGruppe>

<AnalyseGruppe title="Parteien">
    <Card>
        <ListTitle title="Parteienranking nach Anzahl Mandaten" />
        <RankedList data={parteinSortiertNachAnzahlPersonen} name="Parteienranking nach Anzahl Mandaten" />
    </Card>
</AnalyseGruppe>

<AnalyseGruppe title="Sonstiges">
    <Card>
        <ListTitle title="Exekutiven mit einer geraden Anzahl Rätinnen und Räten ({exekutivenMitGeraderAnzahlRätinnenUndRäten.length})" />
        <GroupList groups={exekutivenMitGeraderAnzahlRätinnenUndRäten} />
    </Card>
    <Card extra_classes="col-span-2">
        <ListTitle title="Personen die mehrere male vorkommen (Mögliche mehrfach Mandate) ({peopleWithMultipleMandates.length})" />
        <div class="grid md:grid-cols-2 gap-4">
            {#each peopleWithMultipleMandates as people}
                <div>
                    <div>{ people[0].firstname } {people[0].lastname}</div>


                    <div class="pl-4 opacity-50">
                        <GroupList groups={people.map(p => p.GroupName)} />
                    </div>
                </div>
            {/each}
        </div>
    </Card>
</AnalyseGruppe>

<AnalyseGruppe title="Informationsstatus">
    <ExportableTable slot="normal" name="Informationsstatus" data={[
        {
            "Was": "Parteien",
            "Wie viel": `${$allPeople.filter(person => person.party).length} von ${$allPeople.length}`,
            "%": `${($allPeople.filter(person => person.party).length / $allPeople.length * 100).toFixed(2)}%`
        },
        {
            "Was": "Geburtsjahre",
            "Wie viel": `${$allPeople.filter(person => person.birthyear).length} von ${$allPeople.length}`,
            "%": `${($allPeople.filter(person => person.birthyear).length / $allPeople.length * 100).toFixed(2)}%`
        },
        {
            "Was": "Seit Angaben",
            "Wie viel": `${$allPeople.filter(person => person.since).length} von ${$allPeople.length}`,
            "%": `${($allPeople.filter(person => person.since).length / $allPeople.length * 100).toFixed(2)}%`
        },
        {
            "Was": "Geschlechts Angaben",
            "Wie viel": `${$allPeople.filter(person => person.gender).length} von ${$allPeople.length}`,
            "%": `${($allPeople.filter(person => person.gender).length / $allPeople.length * 100).toFixed(2)}%`
        },
    ]}
    />
</AnalyseGruppe>

<div class="fixed bottom-0 w-full md:flex bg-white border-t left-0 hidden">
    {#each $chapters as chapter}
        <a href={`#${chapter}`} class="grow p-4 no-underline transition-all hover:bg-neutral-100 text-center">{chapter}</a>
    {/each}
</div>