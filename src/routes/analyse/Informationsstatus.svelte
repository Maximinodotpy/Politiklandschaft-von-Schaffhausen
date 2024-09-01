<script>
    import {
        allPeople,
    } from "$lib";
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
    } from 'flowbite-svelte';
</script>

<div class="mt-20 mb-80">
    <h3 class="text-xl tracking-widest mb-8">Informationsstatus</h3>

    <Table divClass="border" striped={true}>
        <TableHead>
            <TableHeadCell>Was</TableHeadCell>
            <TableHeadCell>Wie viel</TableHeadCell>
        </TableHead>
        <TableBody tableBodyClass="divide-y">
            <TableBodyRow>
                <TableBodyCell>Parteien</TableBodyCell>
                <TableBodyCell>
                    {$allPeople.filter(person => person.party).length}
                    <div class="opacity-50 inline-block">
                        von
                        {$allPeople.length}
                    </div>
                </TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
                <TableBodyCell>Geburtsjahre</TableBodyCell>
                <TableBodyCell>
                    {$allPeople.filter(person => person.birthyear).length}
                    <div class="opacity-50 inline-block">
                        von
                        {$allPeople.length}
                    </div>
                </TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
                <TableBodyCell>Seit Angaben</TableBodyCell>
                <TableBodyCell>
                    {$allPeople.filter(person => person.since).length}
                    <div class="opacity-50 inline-block">
                        von
                        {$allPeople.length}
                    </div>
                </TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
                <TableBodyCell>Geschlechts Angaben</TableBodyCell>
                <TableBodyCell>
                    {$allPeople.filter(person => person.gender).length}
                    <div class="opacity-50 inline-block">
                        von
                        {$allPeople.length}
                    </div>
                </TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
                <TableBodyCell>Bilder</TableBodyCell>
                <TableBodyCell>
                    {$allPeople.filter(person => person.image).length}
                    <div class="opacity-50 inline-block">
                        von
                        {$allPeople.length}

                        <a href="/galerie" class="no-underline">↗️</a>
                    </div>
                </TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
                <TableBodyCell>E-Mails</TableBodyCell>
                <TableBodyCell>
                    {$allPeople.filter(person => person.email).length}
                    <div class="opacity-50 inline-block">
                        von
                        {$allPeople.length}

                        <a href="/kontakt" class="no-underline">↗️</a>
                    </div>
                </TableBodyCell>
            </TableBodyRow>
        </TableBody>
    </Table>
</div>