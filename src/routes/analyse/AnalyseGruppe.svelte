<script>
    export let title = "Analyse";
    import CardGrid from "$lib/CardGrid.svelte";
    import { chapters } from "./chapters";

    chapters.update((chapters) => {
        chapters.push(title);
        return chapters;
    });
</script>

<div class="mb-10" id="{title}">
    <h2 class="text-xl font-bold mb-4">{ title }</h2>

    <slot name="normal"></slot>

    <CardGrid>
        <slot></slot>
    </CardGrid>
</div>