// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createEffect, createSignal, For, JSX, onCleanup, onMount, Show } from 'solid-js';

import { joinClass } from '@/base';
import { Accessor, calcLayoutFieldAreas, Field, FieldBaseProps, Options } from '@/form/field';
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
    marks?: Options<number>;

    accessor: Accessor<number>;
}

/**
 * 相当于 <input type="range" />
 */
export default function Range(props: Props): JSX.Element {
    if (props.layout === undefined) { props.layout = 'horizontal'; }

    const access = props.accessor;
    const [marks, setMarks] = createSignal<Array<[val: number, title: JSX.Element, offset: number]>>([]);
    let fieldRef: HTMLDivElement;
    let inputRef: HTMLInputElement;

    onMount(() => {
        // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
        const resizeObserver = new ResizeObserver(entries => {
            const h = entries[0].contentBoxSize[0].blockSize / 2;
            fieldRef.style.setProperty('--range-marks-item-top', `calc(-${h}px - 50%)`);
        });

        resizeObserver.observe(inputRef);
        onCleanup(() => { resizeObserver.disconnect(); });
    });

    createEffect(() => {// 根据 min 和 max 计算各个标记点的值
        let prev = 0;
        const scale = (props.max! - props.min!) / 100;
        if (props.marks && props.marks.length > 0) {
            setMarks(props.marks.sort((a, b) => a[0] - b[0]).map(v=>{
                const offset = (v[0] - prev) / scale; // 先取 prev，再赋值新值给 prev。
                prev = v[0];
                return [v[0], v[1], offset];
            }));
        }
    });

    return <Field ref={el => fieldRef = el} class={joinClass(styles.range, props.palette ? `palette--${props.palette}` : undefined, props.class)}
        {...calcLayoutFieldAreas(props.layout!, access.hasHelp(), !!props.label)}
        help={props.help}
        getError={access.getError}
        title={props.title}
        label={props.label}
        palette={props.palette}
    >
        <input ref={el => inputRef = el} type="range" min={props.min} max={props.max} step={props.step} value={access.getValue()}
            classList={{ [styles['fit-height']]: props.fitHeight }}
            readOnly={props.readonly} disabled={props.disabled} name={access.name()} onChange={(e) => {
                if (!props.readonly && !props.disabled) {
                    let v = parseFloat(e.target.value);
                    access.setValue(v);
                    access.setError();
                }
            }}
        />

        <Show when={marks() && marks()!.length > 0}>
            <div class={styles.marks}>
                <For each={marks()}>
                    {(item) => (
                        <span class={styles.item} style={{ 'width': `${item[2]}%` }}><span>{item[1]}</span></span>
                    )}
                </For>
            </div>
        </Show>
    </Field>;
}
