// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createMemo, createSignal, For, JSX, untrack } from 'solid-js';
import IconPrevYear from '~icons/material-symbols/keyboard-double-arrow-left';
import IconNextYear from '~icons/material-symbols/keyboard-double-arrow-right';
import IconToday from '~icons/material-symbols/today';

import { BaseProps, joinClass } from '@/base';
import { Button, ButtonGroup } from '@/button';
import styles from './style.module.css';

export interface Props extends BaseProps {
    disabled?: boolean;
    readonly?: boolean;

    popover?: boolean | 'manual' | 'auto';

    /**
     * 关联的值
     */
    value?: number;

    min?: number;
    max?: number;

    /**
     * 值发生改变时触发的事件
     */
    onChange?: { (val?: number, old?: number): void; };

    ref?: { (el: HTMLFieldSetElement): void; };

    class?: string;
}

/**
 * 年份选择面板
 */
export default function (props: Props): JSX.Element {
    const now = new Date();
    const [panelValue, setPanelValue] = createSignal(props.value ?? now.getFullYear());
    const [value, setValue] = createSignal(props.value ?? now.getFullYear());

    createEffect(() => {
        const now = new Date(); // 不复用上一层作用域的 now，可能存在正好跨年的情况。
        setPanelValue(props.value ?? now.getFullYear());
        setValue(props.value ?? now.getFullYear());
    });
    const years = createMemo(() => { return genYears(panelValue()); });

    return <fieldset popover={props.popover} ref={el => { if (props.ref) { props.ref(el); }}}
        disabled={props.disabled}
        class={joinClass(styles.panel, props.palette ? `palette--${props.palette}` : undefined, props.class)}
    >
        <header class={styles.year}>
            {years()[0]}-{years()[years().length - 1]}
            <ButtonGroup kind='flat' class={styles.actions}>
                <Button square onClick={() => { setPanelValue(panelValue() - 12); }}
                    disabled={value() !== undefined && ((props.min !== undefined) && (years()[0] - 12) < props.min)}
                >
                    <IconPrevYear />
                </Button>

                <Button square onClick={() => { setPanelValue(new Date().getFullYear()); }}><IconToday /></Button>

                <Button square onClick={() => { setPanelValue(panelValue() - 12); }}
                    disabled={value() !== undefined
                        && ((props.max !== undefined) && (years()[years().length - 1] + 12) > props.max)
                    }
                >
                    <IconNextYear />
                </Button>
            </ButtonGroup>
        </header>

        <div class={styles.grid}>
            <For each={years()}>
                {year => (
                    <Button kind='flat' checked={value() === year}
                        disabled={(value() !== undefined)
                            && (((props.min !== undefined) && year < props.min)
                            || ((props.max !== undefined) && year > props.max))
                        }
                        onClick={() => {
                            const old = untrack(value);
                            setValue(year);
                            if (props.onChange) { props.onChange(year, old); }
                        }}
                    >
                        {year}
                    </Button>
                )}
            </For>
        </div>
    </fieldset>;
}

export function genYears(curr: number): Array<number> {
    const start = curr - 4;
    return Array.from({ length: 12 }, (_, i) => start + i);
}
