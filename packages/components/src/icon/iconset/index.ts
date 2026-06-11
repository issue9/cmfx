// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import * as morpheus from '@iconsets/svg-morpheus-ts';

import { IconSet as C, iconSetEasings } from './root';

export const IconSet = Object.assign(C, {
	easings: iconSetEasings,
	rotations: morpheus.rotations,
});

export namespace IconSet {
	export type Rotation = morpheus.Rotation;
	export type Props = import('./root').IconSetProps;
	export type Ref = import('./root').IconSetRef;
}
