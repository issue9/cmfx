// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { aboutName } from '@cmfx/admin/plugin';
import { expect, test } from 'vitest';

import { about } from './plugin';

test('plugin', async () => {
	const p = about({
		gomods: ['./go.mod'],
		packages: ['./package.json'],
	});

	expect(p.name, 'vite-plugin-cmfx-about');
	expect(p.config).toBeTruthy();
	expect(typeof p.config).toEqual('function');
	if (typeof p.config === 'function') {
		const conf = await p.config!({}, { command: 'build', mode: 'prod' });
		const obj = conf?.define?[aboutName];
		expect(obj.dependencies.length).toEqual(0); // 根目录的 package.json 没有 dependencies。
		expect(obj.devDependencies.length).toBeGreaterThan(5);
		expect(obj.serverDependencies.length).toBeGreaterThan(5);
	}
});
