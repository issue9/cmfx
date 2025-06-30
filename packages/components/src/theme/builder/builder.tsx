// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ExpandType } from '@cmfx/core';
import { JSX, ParentProps } from 'solid-js';

import { applyTheme, BaseProps, initSchemeFromHTML, Mode, Scheme } from '@/base';
import { ThemeProvider, useLocale } from '@/context';
import { Drawer } from '@/drawer';
import { FieldAccessor, ObjectAccessor } from '@/form';
import { Components } from './demo';
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

    const Main = () => <ThemeProvider mode={modeFA.getValue()} scheme={schemeFA.object()}>
        <div class={styles.demo}>
            <header>
                <p class="text-2xl">{l.t('_c.theme.componentsDemo')}</p>

            </header>

            <Components />
        </div>
    </ThemeProvider>;

    return <Drawer palette='secondary' mainPalette={props.palette} main={<Main />}>{ params(schemeFA, modeFA, ref) }</Drawer>;
}
