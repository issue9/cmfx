// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ExpandType } from '@cmfx/core';
import { JSX, ParentProps } from 'solid-js';

import { applyTheme, BaseProps, initSchemeFromHTML, Mode, Scheme } from '@/base';
import { ThemeProvider, useLocale } from '@/context';
import { Drawer } from '@/drawer';
import { FieldAccessor, ObjectAccessor } from '@/form';
import { Components } from './components';
import { params } from './params';
import { Ref } from './ref';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    ref?: { (el: Ref): void; };
}

/**
 * 主题生成器
 */
export default function SchemeBuilder(props: Props): JSX.Element {
    const l = useLocale();
    const modeFA = FieldAccessor<Mode>('mode', 'dark');
    const schemeFA = new ObjectAccessor<ExpandType<Scheme>>(initSchemeFromHTML());

    const ref: Ref = {
        export: (): Scheme => {
            return schemeFA.object();
        },
        reset: () => {
            modeFA.reset();
            schemeFA.reset();
        },
        apply: () => {
            applyTheme(document.documentElement, { scheme: schemeFA.object(), mode: modeFA.getValue() });
        },
    };

    if (props.ref) { props.ref(ref); }

    // NOTE: 此处的 ThemeProvider 必须包含在 div 中，否则当处于 Transition 元素中时，
    // 快速多次地调整 ThemeProvider 参数可能会导致元素消失失败，出现 main 中同时出现在多个元素。
    const Main = () => <div>
        <ThemeProvider mode={modeFA.getValue()} scheme={schemeFA.object()}>
            <div class={styles.demo}>
                <header><p class="text-2xl">{l.t('_c.theme.componentsDemo')}</p></header>
                <Components />
            </div>
        </ThemeProvider>
    </div>;

    return <Drawer palette='secondary' mainPalette={props.palette} main={<Main />}>
        {params(schemeFA, modeFA, ref)}
    </Drawer>;
}
