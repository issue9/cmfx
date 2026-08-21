// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { file2Base64 } from './preview';
import { type AlbumProps, type AlbumRef, Album as C } from './root';

export const Album = Object.assign(C, {
	file2Base64,
});

export namespace Album {
	export type Props = AlbumProps;
	export type Ref = AlbumRef;
}
