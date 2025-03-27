import { writable } from "svelte/store";
import { browser } from "$app/environment";

const storedUser = browser ? localStorage.getItem("user") : null;
const storedToken = browser ? localStorage.getItem("token") : null;

export const auth = writable({
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null
});

export function login(user, token) {
    auth.set({ user, token });

    if (!browser) return;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    alert('Úspešne prihlášený');
}

export function logout() {
    auth.set({ user: null, token: null });

    if (!browser) return;

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alert('Úspešne odhlášený');
}