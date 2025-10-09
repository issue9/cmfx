// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import {
    createEffect, createMemo, createSignal, createUniqueId, For, JSX, mergeProps, onCleanup, onMount, Show
} from 'solid-js';

import { RefProps } from '@/base';
import { Accessor, Field, fieldArea2Style, FieldBaseProps, FieldHelpArea, useForm } from '@/form/field';
import { calcLayoutFieldAreas } from './area';
import styles from './style.module.css';

export interface Ref {
    /**
     * 组件的根元素
     */
    element(): HTMLDivElement;

    /**
     * 组件中实际用于输入的 input 元素
     */
    input(): HTMLInputElement;
}

export interface Props extends FieldBaseProps, RefProps<Ref> {
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
    marks?: Array<[number, string]>;

    accessor: Accessor<number>;

    /**
     * 如果需要显示滑块的当前值，可以通过此字段进行格式化。
     */
    value?: (value: number) => JSX.Element;
}

/**
 * 相当于 <input type="range" />
 */
export default function Range(props: Props): JSX.Element {
    const form = useForm();
    props = mergeProps(form, props);

    const access = props.accessor;
    const [marks, setMarks] = createSignal<Array<[val: number, title: JSX.Element, offset: number]>>([]);
    const [value, setValue] = createSignal<number>(access.getValue());
    let wrapRef: HTMLDivElement;
    let inputRef: HTMLInputElement;

    const wheel = (e: WheelEvent) => {
        if (props.readonly || props.disabled) { return; }

        e.preventDefault();
        const step = props.step ?? 1;

        let v = access.getValue() + (e.deltaY > 0 ? step : -step);
        if ((props.max !== undefined) && (v > props.max)) { v = props.max; }
        if ((props.min !== undefined) && (v < props.min)) { v = props.min; }
        access.setValue(v);
        access.setError();
    };

    onMount(() => {
        // TODO: [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。
        const resizeObserver = new ResizeObserver(entries => {
            const h = entries[0].contentBoxSize[0].blockSize / 2;
            wrapRef.style.setProperty('--range-marks-item-top', `calc(-${h}px - 50%)`);
        });

        resizeObserver.observe(inputRef);
        onCleanup(() => { resizeObserver.disconnect(); });
    });

    createEffect(() => { setValue(access.getValue()); });

    createEffect(() => { // 根据 min 和 max 计算各个标记点的值
        let prev = 0;
        const scale = (props.max! - props.min!) / 100;
        if (props.marks && props.marks.length > 0) {
            setMarks(props.marks.sort((a, b) => a[0] - b[0]).map(v => {
                const offset = (v[0] - prev) / scale; // 先取 prev，再赋值新值给 prev。
                prev = v[0];
                return [v[0], v[1], offset];
            }));
        }
    });

    const id = createUniqueId();
    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, !!props.hasHelp, !!props.label, !!props.value));
    return <Field class={props.class} title={props.title} palette={props.palette}>
        <Show when={areas().labelArea}>
            {area => <label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <div ref={el => wrapRef = el} style={fieldArea2Style(areas().inputArea)} class={styles.range}
            aria-readonly={props.readonly} aria-disabled={props.disabled}
        >
            <input type="range" min={props.min} max={props.max}
                class={props.rounded ? styles.rounded : ''}
                step={props.step} value={access.getValue()} readOnly={props.readonly}
                classList={{ [styles['fit-height']]: props.fitHeight }}
                ref={el => {
                    inputRef = el;
                    if (props.ref) {
                        props.ref({
                            element() { return wrapRef; },
                            input() { return el; }
                        });
                    }
                }}
                onwheel={wheel} disabled={props.disabled} name={access.name()} onChange={e => {
                    if (!props.readonly && !props.disabled) {
                        let v = parseFloat(e.target.value);
                        access.setValue(v);
                        access.setError();
                    }
                }} onInput={e => {
                    if (!props.value) { return; }
                    setValue(parseFloat(e.target.value));
                }}
            />

            <Show when={marks() && marks()!.length > 0}>
                <div class={styles.marks}>
                    <For each={marks()}>
                        {item => (
                            <span class={styles.item} style={{ 'width': `${item[2]}%` }}><span>{item[1]}</span></span>
                        )}
                    </For>
                </div>
            </Show>
        </div>

        <Show when={areas().valueArea}>
            {area =>
                <div style={fieldArea2Style(area())} class={styles.value}>
                    {props.value!(value())}
                </div>
            }
        </Show>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
