// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useLocale, useOptions } from '@components/context';
import { Message, Props as MessageProps, Ref as MessageRef } from './message';

export type Props = Omit<MessageProps, 'transitionDuration' | 'closeAriaLabel'>;

export type Ref = MessageRef;

/**
 * 警告框
 */
export default function Alert(props: Props): JSX.Element {
    const l = useLocale();
    const [opt] = useOptions();
    return <Message {...props} transitionDuration={opt.getTransitionDuration()} closeAriaLabel={l.t('_c.close')} />;
}
