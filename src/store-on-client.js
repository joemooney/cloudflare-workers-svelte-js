import { writable } from 'svelte/store';

const clientStore = writable([]);

if (localStorage.getItem('materials')) {
    clientStore.set(JSON.parse(localStorage.getItem('materials')));
}

clientStore.subscribe((items) => {
    localStorage.setItem('materials', JSON.stringify(items));
});

// return a JSON string
const serialize = () => {
    return JSON.stringify(localStorage.getItem('materials'));
}

// return a JSON object
const items = () => {
    return localStorage.getItem('materials');
}

const add = (name, price) => {
    console.log("Adding new item: " + name);
    clientStore.update((items) => {
        const item = {
            name,
            price,
            id: new Date().getTime(),
        };

        return [...items, item];
    });
};

const edit = (id, name, price) => {
    clientStore.update((items) => {
        const updatedItems = items.filter((i) => i.id !== id);

        const item = {
            name,
            price,
            id,
        };

        return [...updatedItems, item];
    });
};

const remove = (id) => {
    clientStore.update((items) => {
        return items.filter((i) => i.id !== id);
    });
};

export default {
    subscribe: clientStore.subscribe,
    add,
    edit,
    remove,
    items,
};
