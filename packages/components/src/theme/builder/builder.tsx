// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { ExpandType } from '@cmfx/core';
import { JSX, ParentProps, untrack } from 'solid-js';
import { unwrap } from 'solid-js/store';

import { BaseProps, joinClass, Mode, Scheme } from '@/base';
import { use } from '@/context';
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

    const schemeFA = new ObjectAccessor<ExpandType<Scheme>>({ contrast: 65 });
    random(schemeFA); // 只有 random 生成的数据才能保证在参数面板上都有选项可用。
    schemeFA.setPreset(unwrap(schemeFA.object())); // 作为默认值

    const [, act] = use();

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

    if (props.ref) { props.ref(ref); }

    return <Drawer class={joinClass(styles.builder, props.class)} palette={props.palette} main={<Demo m={modeFA} s={schemeFA} />}>
        {params(schemeFA, modeFA, ref)}
    </Drawer>;
}
