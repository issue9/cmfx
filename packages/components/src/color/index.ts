// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Color as C } from './root';
import { HSLSpace } from './space_hsl';
import { OKLCHSpace } from './space_oklch';
import { PresetSpace } from './space_preset';
import { RGBSpace } from './space_rgb';
import { TailwindVarsSpace } from './space_vars';
import { WebSafeSpace } from './space_websafe';
import { wcag } from './wcag';

export const Color = Object.assign(C, {
	HSLSpace,
	OKLCHSpace,
	PresetSpace,
	RGBSpace,
	TailwindVarsSpace,
	WebSafeSpace,
	wcag,
});

export namespace Color {
	export type Props = import('./root').ColorProps;
	export type Ref<P extends boolean = false> = import('./root').ColorRef<P>;
	export type Space = import('./space').ColorSpace;
}
