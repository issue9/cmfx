// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export class CacheImplement implements Cache {
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
        const arr: Readonly<Array<Response>> = [];
        return arr;
    }

    async put(_: RequestInfo | URL, __: Response): Promise<void> {
        return;
    }
}
