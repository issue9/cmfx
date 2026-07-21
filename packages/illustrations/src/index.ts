// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { bro } from './bro';
import type { Gallery, Props, Ref } from './common';
import { undraw } from './undraw';

export { bro, type Gallery, type Props, type Ref, undraw };

/**
 * 创建指定名称的插图集
 */
export function createGallery(name: 'bro' | 'undraw'): Gallery {
	return name === 'bro' ? bro : undraw;
}
