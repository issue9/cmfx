// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { KeyOfMessage, Locale } from 'admin/dev';
import { Message } from './en';

export type { Message };
export type MessageKey = KeyOfMessage<Message>;

export const loads: Record<Locale, {():Promise<Message>}> = {
    'en': async () => { return (await import('./en')).default; },
    'cmn-Hans': async () => { return (await import('./cmn-Hans')).default; },
} as const;
