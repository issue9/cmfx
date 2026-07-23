// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

import pkg from '../package.json' with { type: 'json' };
import { type Info, version } from './plugin';

test('version', async () => {
	const p = version({
		pkg: path.resolve(__dirname, '../package.json'),
		output: 'version.json',
		// biome-ignore lint/suspicious/noExplicitAny: any
	}) as any;

	expect(p.name, 'vite-plugin-cmfx-version');

	expect(typeof p.configResolved).toEqual('function');
	if (typeof p.configResolved === 'function') {
		p.configResolved({ build: { outDir: path.resolve(__dirname, '../lib') } });
	}

	expect(typeof p.writeBundle).toEqual('function');
	if (typeof p.writeBundle === 'function') {
		await p.writeBundle(null, null);

		const content = await fs.promises.readFile(path.resolve(__dirname, '../lib/version.json'), 'utf8');
		const info = JSON.parse(content) satisfies Info;
		expect(info.version).toMatch(pkg.version);
	}
});
