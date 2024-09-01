<script lang="ts">
    import { exportAsCSV } from "./helpers";
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from 'flowbite-svelte';

    export let name = 'Table';

    export let data: Array<Object> = [];
</script>

<!-- Exportable table -->
<Table divClass="border" striped={true}>
    <TableHead>
        <!-- Create Head Dynamically -->
        {#each Object.keys(data[0]) as key}
            <TableHeadCell>{key}</TableHeadCell>
        {/each}
    </TableHead>
    <TableBody tableBodyClass="divide-y">
        {#each data as row}
            <TableBodyRow>
                {#each Object.keys(row) as key}
                    <TableBodyCell>{row[key]}</TableBodyCell>
                {/each}
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>

<button class=" p-4 mt-4 opacity-50 hover:opacity-100 transition-all" on:click={() => exportAsCSV(data, name)}>CSV</button>