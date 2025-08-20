// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, fieldAccessor, Mode, ObjectAccessor, Scheme, use, useLocale } from '@cmfx/components';
import { ExpandType } from '@cmfx/core';
import { createEffect, JSX, untrack } from 'solid-js';
import { unwrap } from 'solid-js/store';

import { Demo } from './demo';
import { params, random } from './params';
import { Ref } from './ref';
import styles from './style.module.css';

/**
 * 主题生成器
 */
export default function SchemeBuilder(): JSX.Element {
    const modeFA = fieldAccessor<Mode>('mode', 'dark');
    const l = useLocale();
    const [, act] = use();

    createEffect(() => {
        act.setTitle(l.t('_d.theme.builder'));
    });

    const schemeFA = new ObjectAccessor<ExpandType<Scheme>>({ contrast: 65 });
    random(schemeFA); // 只有 random 生成的数据才能保证在参数面板上都有选项可用。
    schemeFA.setPreset(unwrap(schemeFA.object())); // 作为默认值

    const ref: Ref = {
        export: (): Scheme => {
            return schemeFA.object();
        },
        reset: () => {
            modeFA.reset();
            schemeFA.reset();
        },
        apply: () => {
            act.switchScheme(unwrap(schemeFA.object()));
            act.switchMode(untrack(modeFA.getValue));
        },
    };

    return <Drawer class={styles.builder}
        palette='secondary' mainPalette='surface' main={<Demo m={modeFA} s={schemeFA} />}
    >
        {params(schemeFA, modeFA, ref)}
    </Drawer>;
}
