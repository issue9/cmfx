// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { type MessageType, messageTypes } from '@components/notify/message';
import { type AlertProps, type AlertRef, Alert as C } from './root';

export const Alert = Object.assign(C, { types: messageTypes });

export namespace Alert {
	export type Props = AlertProps;
	export type Ref = AlertRef;
	export type Type = MessageType;
}
