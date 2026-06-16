// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';

import { Message, type MessageProps, type MessageRef } from '@components/notify/message';

export type AlertProps = Omit<MessageProps, 'transitionDuration' | 'closeAriaLabel'>;

export type AlertRef = MessageRef;

/**
 * 警告框
 */
export function Alert(props: AlertProps): JSX.Element {
	return <Message {...props} />;
}
