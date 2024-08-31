<script lang="ts">
    import { allPeople } from "$lib/index";
    import PageTitle from "$lib/PageTitle.svelte";

    const pictures = $allPeople.filter((person) => person.image);
</script>

<PageTitle title="Galerie" />

<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    {#each pictures as person}
        <div class="aspect-square relative rounded-lg overflow-hidden border bg-neutral-100">
            <img src={person.image} alt="{person.firstname} {person.lastname}" class="object-cover h-full w-full" />
            <div class="text-white absolute h-1/2 flex items-end justify-center pb-2 text-xs bottom-0 w-full bg-gradient-to-b from-transparent to-black">{person.firstname} {person.lastname}</div>
        </div>
    {/each}
</div>