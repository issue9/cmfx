// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import pkg from '../package.json' with { type: 'json' };
import { type Info, version } from './plugin';

describe('version', async () => {
	const opt = {
		pkg: path.resolve(import.meta.dirname, '../package.json'),
		filename: 'version.json',
		src: path.resolve(import.meta.dirname, '../testdata/version_checker'),
	};

	// biome-ignore lint/suspicious/noExplicitAny: any
	const plugin = version(opt) as any;

	test('name', () => {
		expect(plugin.name, 'vite-plugin-cmfx-version');
	});

	test('configResolved', () => {
		expect(typeof plugin.configResolved).toEqual('function');
		if (typeof plugin.configResolved === 'function') {
			plugin.configResolved({ publicDir: path.resolve(import.meta.dirname, '../testdata') });
		}
	});

	test('buildStart', async () => {
		expect(typeof plugin.buildStart).toEqual('function');
		if (typeof plugin.buildStart === 'function') {
			await plugin.buildStart(null, null);

			const content = await fs.promises.readFile(
				path.resolve(import.meta.dirname, `../testdata/${opt.filename}`),
				'utf8',
			);
			const info = JSON.parse(content) satisfies Info;
			expect(info.version).toMatch(pkg.version);
		}
	});
});
