// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import Color from 'colorjs.io';
import { createEffect, createSignal, JSX, Show } from 'solid-js';
import IconPicker from '~icons/circum/picker-half';

import { BaseProps, joinClass, PropsError, wcag } from '@components/base';
import { Button } from '@components/button';
import { copy2Clipboard, useLocale } from '@components/context';
import { Choice, ChoiceOption, fieldAccessor } from '@components/form';
import { PickerPanel } from './picker';
import styles from './style.module.css';

declare global {
    interface Window {
        // TODO: https://caniuse.com/?search=EyeDropper
        EyeDropper: any;
    }
}

export interface Props extends BaseProps {
    /**
     * 初始的颜色值
     *
     * @reactive
     */
    value?: string;

    /**
     * 指定一个用于计算 WCAG 值的颜色
     *
     * @remarks
     * 如果该值不为空，那么在颜色展示区域上的文字会以此颜色值显示，否则使用默认颜色值或是没有文字。
     * 该值只能是所有 CSS 直接支持的颜色值，不能是 CSS 变量。
     *
     * @reactive
     */
    wcag?: string;

    /**
     * 颜色值发生变化时触发的事件
     */
    onChange?: (value: string) => void;

    /**
     * 指定的颜色拾取面板的类型
     */
    pickers: Array<PickerPanel>;
}

/**
 * 颜色选取面板
 */
export default function ColorPanel(props: Props): JSX.Element {
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

    const signal = createSignal<string>('#000');

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

    const [apca, setApca] = createSignal(false);
    let contentRef: HTMLDivElement;

    return <div class={joinClass(props.palette, styles['color-panel'], props.class)} style={props.style}>
        <header>
            <Show when={'EyeDropper' in window}>
                <Button kind='border' square onclick={async () => {
                    const eye = new window.EyeDropper();
                    const color = new Color((await eye.open()).sRGBHex).toString();
                    signal[1](color);

                    // 切换到符合当前颜色的拾取色板
                    const picker = props.pickers.find(v => v.include(color));
                    if (picker) { idFA.setValue(picker.id); }
                }}><IconPicker /></Button>
            </Show>

            <div class={styles.middle}>
                <div class={styles.value} ref={el => contentRef = el}
                    onClick={() => copy2Clipboard(contentRef, signal[0]())}
                    style={{
                        'background-color': signal[0](),
                        'color': props.wcag ?? 'var(--palette-fg)'
                    }}
                >
                    {signal[0]()}
                </div>
                <Show when={props.wcag}>
                    {val => (
                        <span onClick={() => setApca(!apca())} class={styles['wcag-value']}
                            title={apca() ? 'WCAG 3.X(APCA)' : 'WCAG 2.X'}
                        >
                            {wcag(signal[0]().startsWith('var(--') ? getComputedStyle(contentRef).getPropertyValue('background-color') : signal[0](), val(), apca())}
                        </span>
                    )}
                </Show>
            </div>

            <Choice options={choiceOptions} accessor={idFA} />
        </header>

        <main>
            {props.pickers.find(p => p.id === idFA.getValue())?.panel(signal)}
        </main>
    </div>;
}
