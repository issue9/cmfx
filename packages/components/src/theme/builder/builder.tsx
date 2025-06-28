// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ExpandType } from '@cmfx/core';
import { JSX, ParentProps } from 'solid-js';
import IconDark from '~icons/material-symbols/dark-mode';
import IconLight from '~icons/material-symbols/light-mode';

import { applyTheme, BaseProps, initSchemeFromHTML, Mode, Scheme } from '@/base';
import { Button, ButtonGroup } from '@/button';
import { ThemeProvider, useLocale } from '@/context';
import { Drawer } from '@/drawer';
import { FieldAccessor, ObjectAccessor } from '@/form';
import { Components } from './demo';
import { params } from './params';
import { Ref } from './ref';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    ref?: { (el: Ref): void; };

    /**
     * 是否提供导出等操作按钮
     */
    actions?: boolean;
}

/**
 * 主题编辑组件
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
                <div class={styles.actions}>
                    <ButtonGroup rounded>
                        <Button square title={l.t('_c.theme.light')}
                            checked={modeFA.getValue() === 'light'} onClick={() => modeFA.setValue('light')}>
                            <IconLight />
                        </Button>
                        <Button square title={l.t('_c.theme.dark')}
                            checked={modeFA.getValue() === 'dark'} onClick={() => modeFA.setValue('dark')}>
                            <IconDark />
                        </Button>
                    </ButtonGroup>
                </div>
            </header>

            <Components />
        </div>
    </ThemeProvider>;

    return <Drawer palette='secondary' mainPalette={props.palette} main={<Main />}>{ params(schemeFA, ref) }</Drawer>;
}
