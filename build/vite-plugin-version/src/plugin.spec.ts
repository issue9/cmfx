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
		pkg: '../package.json',
		output: '../version.json',
	});

	expect(p.name, 'vite-plugin-cmfx-version');
	expect(typeof p.writeBundle).toEqual('function');
	if (typeof p.writeBundle === 'function') {
		await p.writeBundle.call(null, null);

		const content = await fs.promises.readFile(path.join(__dirname, '../version.json'), 'utf8');
		const info = JSON.parse(content) satisfies Info;
		expect(info.version).toMatch(pkg.version);
	}
});
