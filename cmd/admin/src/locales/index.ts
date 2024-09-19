// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { KeyOfMessage, MessagesLoader } from 'admin/dev';
import { Message } from './en';

export type { Message };
export type MessageKey = KeyOfMessage<Message>;

export const loads: MessagesLoader<Message> = {
    'en': async () => { return (await import('./en')).default; },
    'cmn-Hans': async () => { return (await import('./cmn-Hans')).default; },
} as const;
