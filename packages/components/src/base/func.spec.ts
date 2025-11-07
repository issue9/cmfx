// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import { classList, style2String } from './func';

test('classList', () => {
    expect(classList()).toBeUndefined();
    expect(classList(undefined, {})).toBeUndefined();
    expect(classList(undefined, undefined, '')).toBeUndefined();
    expect(classList(undefined, undefined, '', null)).toBeUndefined();
    expect(classList(undefined, undefined, '', '')).toBeUndefined();
    expect(classList(undefined, {}, '')).toBeUndefined();

    expect(classList('error', { 'a': true, 'b': false, 'c': undefined, 'd': true }))
        .toEqual('palette--error a d');
    expect(classList(undefined, { 'a': true, 'b': false, 'c': undefined, 'd': true }, 'abc', 'def'))
        .toEqual('a d abc def');
    expect(classList(undefined, { 'a': true, 'b': false, 'c': undefined, 'd': true }, 'abc', 'def', ''))
        .toEqual('a d abc def');
    expect(classList('surface', { 'a': true, 'b': false, 'c': undefined, 'd': true }, 'abc', 'def', undefined))
        .toEqual('palette--surface a d abc def');
});

describe('style2String', () => {
    test('empty', () => {
        expect(style2String()).toEqual('');
    });

    test('str', () => {
        expect(style2String('color:red')).toEqual('color:red;');
    });

    test('str undefined', () => {
        expect(style2String('color:red', undefined)).toEqual('color:red;');
    });

    test('str str', () => {
        expect(style2String('color:red', 'background-color:blue'))
            .toEqual('color:red;background-color:blue;');
    });

    test('obj', () => {
        expect(style2String({ 'color': 'red' })).toEqual('color:red;');
    });

    test('obj undefined', () => {
        expect(style2String({ 'color': 'red', 'background-color': 'blue' }, undefined))
            .toEqual('color:red;background-color:blue;');
    });

    test('obj obj', () => {
        expect(style2String({ 'color': 'red' }, { 'background-color': 'blue' }))
            .toEqual('color:red;background-color:blue;');
    });

    test('obj undefined obj', () => {
        expect(style2String({ 'color': 'red' }, undefined, { 'background-color': 'blue' }))
            .toEqual('color:red;background-color:blue;');
    });


    test('obj str', () => {
        expect(style2String({ 'color': 'red' }, 'background-color:blue')).toEqual('color:red;background-color:blue;');
    });

    test('str obj', () => {
        expect(style2String('color:red', { 'background-color': 'blue' })).toEqual('color:red;background-color:blue;');
    });
});
