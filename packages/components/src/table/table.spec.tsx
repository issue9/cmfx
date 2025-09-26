// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Query, sleep } from '@cmfx/core';
import { render } from '@solidjs/testing-library';
import { describe, expect, test } from 'vitest';

import { Provider } from '@/context/context.spec';
import { BasicTable, Ref as BasicTableRef } from './basic';
import { LoaderTable, Ref as LoaderTableRef } from './loader';
import { RemoteTable, Ref as RemoteTableRef } from './remote';

describe('Table', () => {
    test('basic ref', async () => {
        let ref: BasicTableRef;
        const { unmount } = render(() => <BasicTable columns={[]} ref={el => ref = el} />, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        expect(ref!.element()).not.toBeUndefined();
        expect(ref!.table()).not.toBeUndefined();

        unmount();
    });

    test('loader ref', async () => {
        let ref: LoaderTableRef<object>;
        const { unmount } = render(() => <LoaderTable<object, Query> load={async (q: Query): Promise<object[]> => { return []; }} columns={[]} queries={{}} ref={el => ref = el} />, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        expect(ref!.element()).not.toBeUndefined();
        expect(ref!.table()).not.toBeUndefined();

        unmount();
    });

    test('remote ref', async () => {
        let ref: RemoteTableRef<object>;
        const { unmount } = render(() => <RemoteTable<object, Query> path='/' columns={[]} queries={{}} ref={el => ref = el} />, {
            wrapper: Provider,
        });
        await sleep(500); // Provider 是异步的，需要等待其完成加载。

        expect(ref!.element()).not.toBeUndefined();
        expect(ref!.table()).not.toBeUndefined();

        unmount();
    });
});
