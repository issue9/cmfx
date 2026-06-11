// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { file2Base64 } from './preview';
import { Album as C } from './root';

export const Album = Object.assign(C, {
	file2Base64,
});

export namespace Album {
	export type Props = import('./root').AlbumProps;
	export type Ref = import('./root').AlbumRef;
}
