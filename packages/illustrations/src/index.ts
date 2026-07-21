// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { bro } from './bro';
import type { Gallery, Props, Ref } from './common';
import { undraw } from './undraw';

export { bro, type Gallery, type Props, type Ref, undraw };

/**
 * 以指定名称的插画集为基础创建新的插画集
 *
 * @param base - 基础插画集名称；
 * @param optional - 可选的部分插画集，用于覆盖基础插画集的部分内容；
 */
export function createGallery(base: 'bro' | 'undraw', optional?: Partial<Gallery>): Gallery {
	const b = base === 'bro' ? bro : undraw;
	return optional ? Object.assign({}, b, optional) : b;
}
