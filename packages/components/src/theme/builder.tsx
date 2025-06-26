// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ExpandType } from '@cmfx/core';
import { JSX, ParentProps } from 'solid-js';
import IconApply from '~icons/fluent/text-change-accept-20-filled';
import IconDark from '~icons/material-symbols/dark-mode';
import IconExport from '~icons/material-symbols/export-notes';
import IconLight from '~icons/material-symbols/light-mode';
import IconReset from '~icons/material-symbols/reset-settings';

import { applyTheme, BaseProps, genScheme, Mode, Scheme } from '@/base';
import { Button, ButtonGroup } from '@/button';
import { ThemeProvider, useLocale } from '@/context';
import { Dialog, DialogRef } from '@/dialog';
import { Drawer } from '@/drawer';
import { FieldAccessor, ObjectAccessor } from '@/form';
import { Label } from '@/typography';
import { Components } from './demo';
import { params } from './params';
import styles from './style.module.css';

export interface Ref {
    /**
     * 导出 Scheme 对象
     */
    export(): Scheme;

    /**
     * 重置对象
     */
    reset(): void;

    /**
     * 将当前主题应用到全局
     */
    apply(): void;
}

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
    let dlg: DialogRef;
    const modeFA = FieldAccessor<Mode>('mode', 'dark');
    const schemeFA = new ObjectAccessor<ExpandType<Scheme>>(genScheme(80));

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
                    <ButtonGroup rounded>
                        <Button square onClick={ref.reset} title={l.t('_c.reset')}><IconReset /></Button>
                        <Button square onClick={() => ref.apply()} title={l.t('_c.theme.apply')}><IconApply /></Button>
                        <Button square onClick={() => dlg.showModal()} title={l.t('_c.theme.export')}><IconExport /></Button>
                    </ButtonGroup>
                </div>
            </header>

            <Dialog ref={el => dlg = el} header={<Label icon={IconExport}>{l.t('_c.theme.export')}</Label>}>
                <pre>{JSON.stringify(schemeFA.object(), null, 4)}</pre>
            </Dialog>

            <Components />
        </div>
    </ThemeProvider>;

    return <Drawer mainPalette={props.palette} main={<Main />}>{ params(schemeFA) }</Drawer>;
}
