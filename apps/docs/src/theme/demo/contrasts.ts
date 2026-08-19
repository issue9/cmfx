// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { LogicError } from '@cmfx/core';

export type Contrast = 'more' | 'less' | 'none';

type Vars = Record<'--contrast' | '--opacity', string>;

/**
 * 不同对比度下的变量值
 */
export const contrasts = getContrasts();

export function getContrasts(): ReadonlyMap<Contrast, Vars> {
	const contrasts: Map<Contrast, Vars> = new Map([]);

	for (const sheet of document.styleSheets) {
		for (const rule of sheet.cssRules) {
			if (rule instanceof CSSMediaRule) {
				switch (rule.conditionText) {
					case '(prefers-contrast: no-preference)':
						contrasts.set('none', getVars(rule.cssRules));
						break;
					case '(prefers-contrast: more)':
						contrasts.set('more', getVars(rule.cssRules));
						break;
					case '(prefers-contrast: less)':
						contrasts.set('less', getVars(rule.cssRules));
						break;
					default:
				}
			}
		}
	}

	return contrasts;
}

function getVars(rules: CSSRuleList): Vars {
	let c: string | undefined;
	let o: string | undefined;
	for (const r of rules) {
		if (r instanceof CSSStyleRule) {
			const cc = r.style.getPropertyValue('--contrast');
			if (cc) {
				c = cc;
			}

			const oo = r.style.getPropertyValue('--opacity');
			if (oo) {
				o = oo;
			}
		}
	}

	if (!c || !o) {
		throw new LogicError('无法从 CSS 中获取 --opacity 或是 --contrast');
	}

	return {
		'--contrast': c,
		'--opacity': o,
	};
}
