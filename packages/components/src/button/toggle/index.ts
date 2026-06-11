// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { ToggleButton as C, FitScreen, FullScreen } from './root';

export const ToggleButton = Object.assign(C, { FitScreen, FullScreen });

export namespace ToggleButton {
	export type Props = import('./root').ToggleButtonProps;
	export type Ref = import('./root').ToggleButtonRef;
	export type FitScreenProps = import('./root').ToggleButtonFitScreenProps;
	export type FullScreenProps = import('./root').ToggleButtonFullScreenProps;
}
