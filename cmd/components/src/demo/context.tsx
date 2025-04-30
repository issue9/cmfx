// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, LocaleProvider, ThemeProvider, useLocale } from '@cmfx/components';
import { Theme } from '@cmfx/core';

import { Demo, Stage } from './base';

export default function() {
    return <Demo>
        <Stage title="locale provider">
            <LocaleProvider id='zh-hans' unitStyle='narrow'>
                <span>{useLocale().t('_i.ok')}</span>
                <LocaleProvider id='en' unitStyle='narrow'>
                    <span>{useLocale().t('_i.ok')}</span>
                </LocaleProvider>
            </LocaleProvider>
        </Stage>

        <Stage title="theme provider">
            <ThemeProvider mode='dark' contrast='less' scheme={Theme.genScheme(70)}>
                <Button>button</Button>
                <ThemeProvider mode='light' contrast='less' scheme={Theme.genScheme(50)}>
                    <Button>button</Button>
                </ThemeProvider>
            </ThemeProvider>
        </Stage>
    </Demo>;
}
