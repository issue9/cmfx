// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { messageTypes } from '@components/notify/message';
import { Root as C } from './root';

export const Alert = Object.assign(C, { types: messageTypes });

export namespace Alert {
	export type Props = import('./root').AlertProps;
	export type Ref = import('./root').AlertRef;
	export type Type = import('../message').MessageType;
}
