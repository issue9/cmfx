// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import pkg from '../package.json' with { type: 'json' };
import { type Info, version } from './plugin';

describe('version', async () => {
	const p = version({
		pkg: path.resolve(__dirname, '../package.json'),
		filename: 'version.json',
		src: path.resolve(__dirname, '../public/version_checker')
		// biome-ignore lint/suspicious/noExplicitAny: any
	}) as any;

	test('name', () => {
		expect(p.name, 'vite-plugin-cmfx-version');
	});

	test('configResolved', () => {
		expect(typeof p.configResolved).toEqual('function');
		if (typeof p.configResolved === 'function') {
			p.configResolved({ publicDir: path.resolve(__dirname, '../public') });
		}
	});

	test('buildStart', async () => {
		expect(typeof p.buildStart).toEqual('function');
		if (typeof p.buildStart === 'function') {
			await p.buildStart(null, null);

			const content = await fs.promises.readFile(path.resolve(__dirname, '../public/version.json'), 'utf8');
			const info = JSON.parse(content) satisfies Info;
			expect(info.version).toMatch(pkg.version);
		}
	});
});
