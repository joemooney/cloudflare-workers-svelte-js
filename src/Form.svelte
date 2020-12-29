<script>
    import clientStore from "./store-on-client.js";
    //import items from "./store-on-client.js";
    import serverStore from "./store-on-server.js";
    export let id;
    export let name = "";
    export let url = "";
    export let price = "";

    $: mode = id ? "update" : "add";
    $: canSubmit = price !== "" && name !== "";
    function submit() {
        if (!canSubmit) {
            return;
        }
        console.log("submit to server");

        if (mode == "add") {
            clientStore.add(name, price);
            serverStore.updateItems(clientStore.items());
        }

        if (mode === "update") {
            clientStore.update(id, name, price);
            serverStore.updateItems(clientStore.items());
        }

        price = "";
        name = "";
        id = undefined;
    }

    function cancel() {
        price = "";
        name = "";
        id = undefined;
    }
</script>

<style>
    button {
        margin-left: 20px;
    }
    button:disabled {
        cursor: not-allowed;
    }
</style>

<form on:submit|preventDefault={submit}>
    <fieldset>
        <label for="titleField">Title</label>
        <input
            bind:value={name}
            type="text"
            placeholder="<short description here>"
            id="titleField" />
        <label for="urlField">URL</label>
        <input
            bind:value={url}
            type="text"
            placeholder="<URL here>"
            id="urlField" />
        <label for="priceField">Price</label>
        <input
            bind:value={price}
            type="number"
            step="any"
            min="0"
            placeholder="Price"
            id="priceField" />

        <!-- Submit button only if all fields are filled out -->
        <button disabled={!canSubmit} class="float-right" type="submit">
            {mode}
        </button>

        <!-- Cancel button only if we are in "update" mode -->
        {#if mode == 'update'}
            <button on:click={cancel} class="float-right" type="button">
                Cancel
            </button>
        {/if}
    </fieldset>
</form>
