import { writable } from "svelte/store";

export const chapters = writable<Array<string>>([])