// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { BaseProps, joinClass, PropsError } from '@/base';
import { createSignal, createEffect } from 'solid-js';

import { useLocale } from '@/context';
import { Picker } from './picker';
import styles from './style.module.css';
import { Choice, ChoiceOption, fieldAccessor } from '@/form';

export interface Props extends BaseProps {
    /**
     * 初始的颜色值
     */
    value?: string;

    /**
     * 颜色值发生变化时触发的事件
     */
    onChange?: (value: string) => void;

    /**
     * 指定的颜色拾取面板的类型
     */
    pickers: Array<Picker>;
}

/**
 * 颜色选取面板
 */
export default function ColorPanel(props: Props) {
    for (let i = 0; i < props.pickers.length;i++ ) {
        for (let j = i+1;j<props.pickers.length;j++) {
            if (props.pickers[i].id === props.pickers[j].id) {
                throw new PropsError('spaces', '存在重复的 id 属性');
            }
        }
    }

    const l = useLocale();

    const idFA = fieldAccessor('id', props.pickers[0].id);
    const choiceOptions: Array<ChoiceOption> = props.pickers.map(space => ({
        type: 'item',
        value: space.id,
        label: l.t(space.localeID)
    }));

    const signal = createSignal<string>('');

    createEffect(() => { // 监视 signal 变化，用以触发 onchange
        const v = signal[0]();
        if (props.onChange) { props.onChange(v); }
    });

    createEffect(() => { // 监视 props.value 变化
        const v = props.value;
        if (!v) { return; }

        for (const p of props.pickers) {
            if (p.include(v)) {
                idFA.setValue(p.id);
                return;
            }
        }
    });

    return <div class={joinClass(props.palette, styles['color-panel'], props.class)} style={props.style}>
        <header>
            <p>{signal[0]()}</p>
            <Choice options={choiceOptions} accessor={idFA} />
        </header>

        <main>
            {props.pickers.find(p => p.id === idFA.getValue())?.panel(signal)}
        </main>
    </div>;
}
