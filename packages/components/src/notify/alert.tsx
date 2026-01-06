// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { useTheme } from '@/context/theme';
import { Message, Props as MessageProps } from './message';

export type Props = Omit<MessageProps, 'transitionDuration'>;

/**
 * 警告框
 */
export default function Alert(props: Props): JSX.Element {
    const theme = useTheme();
    return <Message {...props} transitionDuration={theme.scheme.transitionDuration} />;
}
