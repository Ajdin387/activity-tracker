export class ApiError extends Error {
    status: number;
    body?: unknown;

    constructor(message: string, status: number, body?: unknown) {
        super(message);
        this.status = status;
        this.body = body;
    }
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, init);

    if (!res.ok) {
        let body: unknown = undefined;
        try { body = await res.json(); } catch {}
        throw new ApiError(res.statusText || "Request failed", res.status, body);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
}