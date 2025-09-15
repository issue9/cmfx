// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Drawer, fieldAccessor, Mode, ObjectAccessor, Scheme, useComponents, useLocale, useTheme } from '@cmfx/components';
import { ExpandType } from '@cmfx/core';
import { createEffect, JSX, untrack } from 'solid-js';
import { unwrap } from 'solid-js/store';

import { Demo } from './demo';
import { params } from './params';
import { Ref } from './ref';
import styles from './style.module.css';

/**
 * 主题生成器
 */
export default function SchemeBuilder(): JSX.Element {
    const modeFA = fieldAccessor<Mode>('mode', 'light');
    const l = useLocale();
    const [, act] = useComponents();

    const t = useTheme();
    const schemeFA = new ObjectAccessor<ExpandType<Scheme>>(unwrap(t.scheme!)); // t.scheme 可能是 Proxy

    createEffect(() => { act.setTitle(l.t('_d.theme.builder')); });

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
