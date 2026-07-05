// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type LockScreenAction, LockScreenPassword, type LockScreenScreenProps } from './action';
import { useLockScreen } from './context';
import { LockScreen as C, type LockScreenProps, type LockScreenRef } from './root';

export const LockScreen = Object.assign(C, {
	use: useLockScreen,
	Password: LockScreenPassword,
});

export namespace LockScreen {
	export type Props = LockScreenProps;
	export type Ref = LockScreenRef;
	export type ScreenProps = LockScreenScreenProps;
	export type Action = LockScreenAction;
}
