// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { checkTheme } from './theme';

test('checkTheme', () => {
    expect(async () => {
        checkTheme({ mode: 'system', contrast: 'nopreference', primary: '' });
    }).rejects.toThrowError('无效的格式 primary');

    expect(async () => {
        checkTheme({ mode: 'system', contrast: 'nopreference', primary: '#33z' });
    }).rejects.toThrowError('无效的格式 primary');

    expect(checkTheme({ mode: 'system', contrast: 'nopreference', primary: '#333' }));
    expect(checkTheme({ mode: 'system', contrast: 'nopreference', primary: '333fff' }));
    expect(checkTheme({ mode: 'system', contrast: 'nopreference', primary: '#333fff' }));
});
