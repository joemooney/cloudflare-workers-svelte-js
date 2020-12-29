<script>
  import Form from "./Form.svelte";
  import Table from "./Table.svelte";
  let id = "";
  let name = "";
  let price = "";
  let url = "";
  function edit(event) {
    console.log(event.detail);
    ({ id, name, price } = event.detail);
  }
</script>

<style>
  main {
    flex: 1;
    align-content: center;
    justify-content: center;
    width: 80%;
    margin: 0 auto;
  }
</style>

<main>
  <h1>Journal/Notebook/Bookmarks</h1>
  <Form bind:id bind:name bind:price />

  <Table on:edit={edit} />
</main>
