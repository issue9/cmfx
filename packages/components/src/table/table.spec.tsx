// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { API, Query } from '@cmfx/core';
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
        expect(ref!.root()).not.toBeUndefined();
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
        expect(ref!.root()).not.toBeUndefined();
        expect(ref!.table()).not.toBeUndefined();
        ct.testProps();
    });
});

describe('RemoteTable', async () => {
    type Obj = {
        name: string;
    };

    const api = await API.build('id', sessionStorage, '/base', '/token', 'application/json', 'application/json', 'zh-CN');

    let ref: RemoteTableRef<Obj>;
    const ct = await ComponentTester.build(
        'RemoteTable',
        props => <RemoteTable<Obj, Query> {...props} path='/' columns={[]} queries={{}} ref={el => ref = el} rest={api} />
    );

    test('props', async () => {
        expect(ref!.root()).not.toBeUndefined();
        expect(ref!.table()).not.toBeUndefined();
        ct.testProps();
    });
});
