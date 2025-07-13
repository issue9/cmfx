// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { lunar } from './plugin';

test('lunar', async () => {
    let node = document.createElement('td');
    lunar(new Date('2025-05-01'), node);
    expect(node.textContent).toEqual('初四');

    node = document.createElement('td');
    lunar(new Date('2025-05-27'), node);
    expect(node.textContent).toEqual('五月');

    node = document.createElement('td');
    lunar(new Date('2025-05-27'), node);
    expect(node.textContent).toEqual('五月');

    node = document.createElement('td');
    lunar(new Date('2024-12-1'), node);
    expect(node.textContent).toEqual('十一月');
});
