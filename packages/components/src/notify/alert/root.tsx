// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';

import { Message, type Props as MessageProps, type Ref as MessageRef } from '@components/notify/message';

export type Props = Omit<MessageProps, 'transitionDuration' | 'closeAriaLabel'>;

export type Ref = MessageRef;

/**
 * 警告框
 */
export function Root(props: Props): JSX.Element {
	return <Message {...props} />;
}
