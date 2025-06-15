// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, For, JSX, onCleanup, onMount, Show } from 'solid-js';

import { joinClass } from '@/base';
import { Accessor, calcLayoutFieldAreas, Field, FieldBaseProps } from '@/form/field';
import styles from './style.module.css';

export interface Props extends FieldBaseProps {
    min?: number;
    max?: number;
    step?: number;

    /**
     * 滑轨和滑块拥有相同的调度
     */
    fitHeight?: boolean;

    /**
     * 可以在滑轨上作一些标记
     *
     * NOTE: 要求这些标记点必须在 {@link Props#min} 和 {@link Props#max} 之间。
     * 所以 marks 不为空时，min 和 max 是不能为空的。
     */
    marks?: Array<[value: number, title: string]>;

    accessor: Accessor<number>;
}

/**
 * 相当于 <input type="range" />
 */
export default function Range(props: Props): JSX.Element {
    if (props.layout === undefined) { props.layout = 'horizontal'; }

    const access = props.accessor;
    const [marks, setMarks] = createSignal<Props['marks']>([]);
    let fieldRef: HTMLDivElement;

    onMount(() => {
        // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            const top = (-(entry.contentBoxSize[0].blockSize/2 + 2)).toString() + 'px';
            fieldRef.style.setProperty('--top', top);
        });
        
        resizeObserver.observe(fieldRef!.firstElementChild!);
        onCleanup(() => {resizeObserver.disconnect();});
    });

    let scale: number;
    createEffect(() => {// 根据 min 和 max 计算各个标记点的值
        if (props.marks && props.marks.length > 0) {
            let marks = props.marks ? props.marks.sort((a, b) => a[0] - b[0]) : undefined;
            marks = marks?.map((item) => {
                item[0] -= props.min!;
                return item;
            });
            setMarks(marks);
            scale = (props.max! - props.min!) / 100;
        }
    });

    return <Field ref={el=>fieldRef=el} class={joinClass(styles.range, props.class)}
        {...calcLayoutFieldAreas(props.layout!)}
        help={props.help}
        hasHelp={access.hasHelp}
        getError={access.getError}
        title={props.title}
        label={props.label}
        palette={props.palette}
    >
        <input type="range" min={props.min} max={props.max} step={props.step} value={access.getValue()}
            classList={{[styles['fit-height']]: props.fitHeight }}
            readOnly={props.readonly} disabled={props.disabled} name={access.name()} onChange={(e) => {
                if (!props.readonly && !props.disabled) {
                    let v = parseFloat(e.target.value);
                    access.setValue(v);
                    access.setError();
                }
            }}
        />

        <Show when={marks()}>
            <div class={styles.marks}>
                <For each={marks()}>
                    {(item) => (
                        <span class={styles.item} style={{ 'left': (item[0] / scale!).toString() + '%' }}>{item[1]}</span>
                    )}
                </For>
            </div>
        </Show>
    </Field>;
}
