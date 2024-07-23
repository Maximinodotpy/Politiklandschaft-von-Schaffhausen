// place files you want to import through the `$lib` alias in this folder.
import { writable } from "svelte/store";
import { derived } from "svelte/store";

export interface PersonData {
    firstname: string;
    lastname: string;
    party: string;
    birthyear: number | null;
    image: string;
    since: string;
    tasks: string;
    gender: string;
}

export interface GroupData {
    source: string;
    type: string;
    layer: string;
    place: string;
    name: string;

    people: PersonData[];
}

export interface Data {
    [key: string]: GroupData;
}

// Get all files in folder Statis/Data
const files = import.meta.glob("../../static/Data/*.xlsx")

// get all dates from the files by using a regex that matches this YYYY-MM-DD
export const dates = Object.keys(files).map((key) => {
    const match = key.match(/(\d{4}-\d{2}-\d{2})/);
    if (match) {
        return match[1];
    }
    return null;
})

export const selectedDate = writable(dates[dates.length - 1]);

export const globalData = writable<Data>({});

export const partieslistData = derived(globalData, ($globalData) => {
    const parties = new Set<string>();
    for (const key in $globalData) {
        let group = $globalData[key];
        
        for (const person of group.people) {
            if (!person.party) {
                continue;
            }
            parties.add(person.party);
        }
    }
    return Array.from(parties);
});

export const gemeindenlistData = derived(globalData, ($globalData) => {
    const gemeinden = new Set<string>();
    for (const key in $globalData) {
        let group = $globalData[key];
        gemeinden.add(group.place);
    }
    return Array.from(gemeinden);
});

export const exikutivenlistData = derived(globalData, ($globalData) => {
    const exikutiven = new Set<string>();
    for (const key in $globalData) {
        let group = $globalData[key];

        if (group.type !== "Exekutive") {
            continue;
        }
        exikutiven.add(group.name);
    }
    return Array.from(exikutiven);
});

export const legislativenlistData = derived(globalData, ($globalData) => {
    const legislativen = new Set<string>();
    for (const key in $globalData) {
        let group = $globalData[key];

        if (group.type !== "Legislative") {
            continue;
        }
        legislativen.add(group.name);
    }
    return Array.from(legislativen);
});

export const allPeopleGroupedByParty = derived(globalData, ($globalData) => {
    const peopleByParty: { [key: string]: PersonData[] } = {};
    for (const key in $globalData) {
        let group = $globalData[key];
        
        for (const person of group.people) {
            if (!person.party) {
                continue;
            }
            if (!peopleByParty[person.party]) {
                peopleByParty[person.party] = [];
            }
            peopleByParty[person.party].push(person);
        }
    }
    return peopleByParty;
});

export const allPeople = derived(globalData, ($globalData) => {
    const people: PersonData[] = [];
    for (const key in $globalData) {
        let group = $globalData[key];
        
        for (const person of group.people) {
            people.push(person);
        }
    }
    return people;
});

export const partiesMatchedWithWhereTheyAreRepresentedLegaslitativaly = derived(globalData, ($globalData) => {
    const partiesMatchedWithWhereTheyAreRepresentedLegaslitativaly: { [key: string]: string[] } = {};
    for (const key in $globalData) {
        let group = $globalData[key];

        if (group.type !== "Legislative") {
            continue;
        }

        for (const person of group.people) {
            if (!person.party) {
                continue;
            }
            if (!partiesMatchedWithWhereTheyAreRepresentedLegaslitativaly[person.party]) {
                partiesMatchedWithWhereTheyAreRepresentedLegaslitativaly[person.party] = [];
            }
            partiesMatchedWithWhereTheyAreRepresentedLegaslitativaly[person.party].push(group.name);
        }
    }

    // remove duplicate places
    for (const party in partiesMatchedWithWhereTheyAreRepresentedLegaslitativaly) {
        partiesMatchedWithWhereTheyAreRepresentedLegaslitativaly[party] = Array.from(new Set(partiesMatchedWithWhereTheyAreRepresentedLegaslitativaly[party]));
    }

    return partiesMatchedWithWhereTheyAreRepresentedLegaslitativaly;
});

export const partiesMatchedWithWhereTheyAreRepresentedExekutivaly = derived(globalData, ($globalData) => {
    const partiesMatchedWithWhereTheyAreRepresentedExekutivaly: { [key: string]: string[] } = {};
    for (const key in $globalData) {
        let group = $globalData[key];

        if (group.type !== "Exekutive") {
            continue;
        }

        for (const person of group.people) {
            if (!person.party) {
                continue;
            }
            if (!partiesMatchedWithWhereTheyAreRepresentedExekutivaly[person.party]) {
                partiesMatchedWithWhereTheyAreRepresentedExekutivaly[person.party] = [];
            }
            partiesMatchedWithWhereTheyAreRepresentedExekutivaly[person.party].push(group.name);
        }
    }

    // remove duplicate places
    for (const party in partiesMatchedWithWhereTheyAreRepresentedExekutivaly) {
        partiesMatchedWithWhereTheyAreRepresentedExekutivaly[party] = Array.from(new Set(partiesMatchedWithWhereTheyAreRepresentedExekutivaly[party]));
    }

    return partiesMatchedWithWhereTheyAreRepresentedExekutivaly;
})