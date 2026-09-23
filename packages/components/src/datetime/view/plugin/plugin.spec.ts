// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { lunar } from './plugin';

const tzOffset = 8 * 60 * 1000;

// 修正不同环境下的时区错误
function getDate(day: string): Date {
	const d = new Date(day).getTime();
	return new Date(d + tzOffset);
}

test('lunar', async () => {
	let node = document.createElement('td');
	lunar(getDate('2025-05-01T10:00:00'), node);
	expect(node.textContent).toEqual('初四');

	node = document.createElement('td');
	lunar(getDate('2025-05-27T10:00:00'), node);
	expect(node.textContent).toEqual('五月');

	node = document.createElement('td');
	lunar(getDate('2025-05-27T10:00:00'), node);
	expect(node.textContent).toEqual('五月');

	node = document.createElement('td');
	lunar(getDate('2024-12-01T10:00:00'), node);
	expect(node.textContent).toEqual('十一月');
});
