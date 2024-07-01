// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { expect, test } from 'vitest';

import { Contrast, Mode, checkTheme } from './theme';

test('checkTheme', () => {
    expect(async () => {
        checkTheme({ mode: Mode.System, contrast: Contrast.NoPreference, primary: '' });
    }).rejects.toThrowError('无效的格式 primary');

    expect(async () => {
        checkTheme({ mode: Mode.System, contrast: Contrast.NoPreference, primary: '#33z' });
    }).rejects.toThrowError('无效的格式 primary');

    expect(checkTheme({ mode: Mode.System, contrast: Contrast.NoPreference, primary: '#333' }));
    expect(checkTheme({ mode: Mode.System, contrast: Contrast.NoPreference, primary: '333fff' }));
    expect(checkTheme({ mode: Mode.System, contrast: Contrast.NoPreference, primary: '#333fff' }));
});
