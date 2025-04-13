// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';
import { Config } from './config';

test('localStorage', async () => {
    const c = new Config(10);

    expect(c.get('id1')).toBeUndefined();
    c.set('id1', 5);
    expect(c.get('id1')).toEqual(5);
    expect(localStorage.getItem('10--id1')).toEqual('5'); // 转换为 JSON 保存的

    c.set('id2', { 'id': 50 });
    expect(c.get('id2')).toEqual({ 'id': 50 });
    expect(localStorage.getItem('10--id2')).toEqual('{"id":50}'); // 转换为 JSON 保存的

    c.remove('id3');
    c.remove('id2');
    expect(c.get('id2')).toBeUndefined();
});

test('sessionStorage', async () => {
    const c = new Config('ss', sessionStorage);

    expect(c.get('id1')).toBeUndefined();
    c.set('id1', 5);
    expect(c.get('id1')).toEqual(5);
    expect(sessionStorage.getItem('ss--id1')).toEqual('5'); // 转换为 JSON 保存的

    c.set('id2', { 'id': 50 });
    expect(c.get('id2')).toEqual({ 'id': 50 });
    expect(sessionStorage.getItem('ss--id2')).toEqual('{"id":50}'); // 转换为 JSON 保存的

    c.remove('id3');
    c.remove('id2');
    expect(c.get('id2')).toBeUndefined();
});