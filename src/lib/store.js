import { writable } from "svelte/store";

export const logInState = writable(false);
export const filter = writable({});
export const currentPosts = writable('');