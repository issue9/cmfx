// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { states } from './state';
import styles from './style.module.css';

test('states', () => {
	for (const s of states) {
		expect(styles[s]).toSatisfy(v => v !== undefined, `${s} 未存在于样式表`);
	}
});
