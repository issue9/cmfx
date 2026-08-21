// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type {
	ToggleButtonFitScreenProps,
	ToggleButtonFullScreenProps,
	ToggleButtonProps,
	ToggleButtonRef,
} from './root';
import { ToggleButton as C, FitScreen, FullScreen } from './root';

export const ToggleButton = Object.assign(C, { FitScreen, FullScreen });

export namespace ToggleButton {
	export type Props = ToggleButtonProps;
	export type Ref = ToggleButtonRef;
	export type FitScreenProps = ToggleButtonFitScreenProps;
	export type FullScreenProps = ToggleButtonFullScreenProps;
}
