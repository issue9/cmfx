// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import path from 'node:path';
import { expect, test } from 'vitest';

import { findUp, initPnpmVersionSearch, parseGomods } from './files';

test('findUp', () => {
	let p = findUp(['package.json']);
	expect(p).not.toBeUndefined();

	p = findUp(['not.exists']);
	expect(p).toBeUndefined();
});

test('parseGomods', () => {
	let mods = parseGomods([path.resolve('./', 'go.mod')]); // 相对于项目根目录
	expect(mods.length).toBeGreaterThan(10);
	expect(mods[0].version.startsWith('v')).toBeTruthy();

	mods = parseGomods();
	expect(mods.length).toEqual(0);
});

test('initPnpmVersionSearch', async () => {
	const s = await initPnpmVersionSearch();
	expect(s('yaml')).toEqual('^2.8.2');
});
