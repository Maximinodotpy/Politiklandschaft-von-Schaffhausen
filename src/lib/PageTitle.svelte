<script>

    export let title = "Page Title";

    export let category = "";

    export let trackingClasses = 'tracking-wide md:tracking-widest'

</script>

<svelte:head>
    <title>{title} | Politiklandschaft von Schaffhausen</title>
</svelte:head>

<div class="mb-8">
    <div>{ category }</div>
    <h1 class="uppercase {trackingClasses} md:text-4xl text-2xl">
        <slot name="title">{ title }</slot>
    </h1>
    <slot name="below"></slot>
</div>