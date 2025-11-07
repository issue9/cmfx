// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Query } from '@cmfx/core';
import { describe, expect, test } from 'vitest';

import { ComponentTester } from '@/context/context.spec';
import { BasicTable, Ref as BasicTableRef } from './basic';
import { LoaderTable, Ref as LoaderTableRef } from './loader';
import { RemoteTable, Ref as RemoteTableRef } from './remote';

describe('BsicTable', async () => {
    let ref: BasicTableRef;
    const ct = await ComponentTester.build(
        'BsicTable',
        props => <BasicTable {...props} columns={[]} ref={el => ref = el} />
    );
    test('props', async () => {
        expect(ref!.element()).not.toBeUndefined();
        expect(ref!.table()).not.toBeUndefined();
        ct.testProps();
    });
});

describe('LoaderTable', async () => {
    let ref: LoaderTableRef<object>;
    const ct = await ComponentTester.build(
        'LoaderTable',
        props => <LoaderTable<object, Query> {...props} load={async (_: Query): Promise<object[]> => { return []; }} columns={[]} queries={{}} ref={el => ref = el} />
    );
    test('props', async () => {
        expect(ref!.element()).not.toBeUndefined();
        expect(ref!.table()).not.toBeUndefined();
        ct.testProps();
    });
});

describe('RemoteTable', async () => {
    let ref: RemoteTableRef<object>;
    const ct = await ComponentTester.build(
        'RemoteTable',
        props => <RemoteTable<object, Query> {...props} path='/' columns={[]} queries={{}} ref={el => ref = el} />
    );
    test('props', async () => {
        expect(ref!.element()).not.toBeUndefined();
        expect(ref!.table()).not.toBeUndefined();
        ct.testProps();
    });
});
