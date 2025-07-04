// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ExpandType } from '@cmfx/core';
import { JSX, ParentProps } from 'solid-js';

import { applyTheme, BaseProps, joinClass, Mode, Scheme } from '@/base';
import { Drawer } from '@/drawer';
import { fieldAccessor, ObjectAccessor } from '@/form';
import { Demo } from './demo';
import { params, random } from './params';
import { Ref } from './ref';
import styles from './style.module.css';

export interface Props extends BaseProps, ParentProps {
    class?: string;

    ref?: { (el: Ref): void; };
}

/**
 * 主题生成器
 */
export default function SchemeBuilder(props: Props): JSX.Element {
    const modeFA = fieldAccessor<Mode>('mode', 'dark');

    const schemeFA = new ObjectAccessor<ExpandType<Scheme>>({});
    random(schemeFA); // 只有 random 生成的数据才能保证在参数面板上都有选项可用。

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

    return <Drawer class={joinClass(styles.builder, props.class)} palette='secondary' mainPalette={props.palette} main={<Demo m={modeFA} s={schemeFA} />}>
        {params(schemeFA, modeFA, ref)}
    </Drawer>;
}
