// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

export async function newCache(id: string): Promise<Cache> {
    if ('caches' in window) {
        return await caches.open(id);
    }
    console.warn('非 HTTP 环境，无法启用 API 缓存功能！');
    return new CacheImplement();
}

class CacheImplement implements Cache {
    async add(_: RequestInfo | URL): Promise<void> {}

    async addAll(requests: RequestInfo[]): Promise<void>;
    async addAll(requests: Iterable<RequestInfo>): Promise<void>;
    async addAll(_: unknown): Promise<void> {
        return;
    }

    async delete(_: RequestInfo | URL, __?: CacheQueryOptions): Promise<boolean> {
        return true;
    }

    async keys(_?: RequestInfo | URL, __?: CacheQueryOptions): Promise<ReadonlyArray<Request>> {
        return [];
    }

    async match(_: RequestInfo | URL, __?: CacheQueryOptions): Promise<Response | undefined> {
        return;
    }

    async matchAll(_?: RequestInfo | URL, __?: CacheQueryOptions): Promise<ReadonlyArray<Response>> {
        return [];
    }

    async put(_: RequestInfo | URL, __: Response): Promise<void> {
        return;
    }
}
