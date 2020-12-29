function updateItems(items) {
    fetch("/updateItems", {
        method: "PUT",
        body: JSON.stringify(items),
    });
}

export default {
    updateItems,
}