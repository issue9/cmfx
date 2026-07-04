// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { useLockScreen } from './context';
import { LockScreen as C, type LockScreenProps, type LockScreenRef } from './root';
import { Password } from './screen';

export const LockScreen = Object.assign(C, {
	use: useLockScreen,
	Password: Password,
});

export namespace LockScreen {
	export type Props = LockScreenProps;
	export type Ref = LockScreenRef;
}
