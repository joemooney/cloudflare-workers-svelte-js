<script>
    import clientStore from "./store-on-client.js";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let materials = [];
    clientStore.subscribe((items) => {
        materials = items;
    });

    function edit(id, name, price) {
        dispatch("edit", { id, name, price });
    }

    // Given a list of objects generate a total
    // based on one of the fields of the object:
    $: total = materials.reduce((prev, next) => {
        prev += next.price;
        return prev;
    }, 0);

    // Format a decimal number in US$
    // Example Usage: {formatter.format(material.price)}
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    });

    function remove(id) {
        clientStore.remove(id);
    }
</script>

<style>
    table {
        width: 100%;
    }
    tr {
        cursor: pointer;
    }
    tr:last-of-type {
        cursor: inherit;
    }
</style>

<table class="primary">
    <thead>
        <tr>
            <th />
            <th>Title</th>
            <th>Price</th>
        </tr>
    </thead>
    <tbody>
        {#each materials as material (material.id)}
            <tr on:click={edit(material.id, material.name, material.price)}>
                <td>
                    <i
                        class="far fa-trash-alt"
                        on:click|stopPropagation={remove(material.id)} />
                </td>
                <td>{material.name}</td>
                <td>{formatter.format(material.price)}</td>
            </tr>
        {/each}
        <tr>
            <td>Total</td>
            <td colspan="2">{formatter.format(total)}</td>
        </tr>
    </tbody>
</table>
