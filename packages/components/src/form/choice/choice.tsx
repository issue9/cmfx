// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { adjustPopoverPosition } from '@cmfx/core';
import { createMemo, createUniqueId, For, JSX, Match, mergeProps, Show, Switch } from 'solid-js';
import IconCheck from '~icons/material-symbols/check';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { AvailableEnumType, cloneElement, joinClass, Layout } from '@/base';
import {
    Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldBaseProps, FieldHelpArea, Options
} from '@/form/field';
import styles from './style.module.css';

export interface Props<T extends AvailableEnumType, M extends boolean> extends FieldBaseProps {
    placeholder?: string;
    rounded?: boolean;
    options: Options<T>;
    multiple?: M;
    accessor: M extends true ? Accessor<Array<T | undefined>> : Accessor<T | undefined>;
}

/**
 * 用以替代 select 组件
 */
export function Choice<T extends AvailableEnumType, M extends boolean>(props: Props<T, M>): JSX.Element {
    props = mergeProps({ layout: 'horizontal' as Layout }, props);

    // multiple 为 false 时的输入框样式。
    const SingleActivator = (p: { access: Accessor<T> }) => {
        return <For each={props.options}>
            {item => (
                <Show when={p.access.getValue() === item[0]}>{cloneElement(item[1])}</Show>
            )}
        </For>;
    };

    // multiple 为 true 时的输入框样式。
    const MultipleActivator = (p: { access: Accessor<Array<T>> }) => {
        return <For each={props.options}>
            {item => (
                <Show when={p.access.getValue().indexOf(item[0]) >= 0}>
                    <span class={styles.chip}>{cloneElement(item[1])}</span>
                </Show>
            )}
        </For>;
    };

    let ul: HTMLUListElement;
    let anchorRef: HTMLElement;

    const calcPos = () => {
        const ab = anchorRef.getBoundingClientRect();
        ul.style.minWidth = ab.width + 'px';
        ul.style.width = ab.width + 'px';
        adjustPopoverPosition(ul, DOMRect.fromRect(ab), 2);
    };

    const clickInput = (e?: MouseEvent) => {
        if (props.disabled) { return; }

        if (ul.togglePopover()) {
            calcPos();
            scrollIntoView();
        }
        e?.stopPropagation();
    };


    let li: Array<HTMLLIElement> = new Array<HTMLLIElement>(props.options.length);
    const scrollIntoView = () => {
        for (let i = 0; i < props.options.length; i++) {
            const elem = li[i];
            if (elem && elem.ariaSelected === 'true') {
                elem.scrollIntoView({ block: 'center', behavior: 'smooth' });
                return;
            }
        }
    };

    // multiple 为 true 时的候选框的组件
    const MultipleOptions = (p: { ac: Accessor<Array<T>> }) => {
        return <For each={props.options}>
            {(item, i) => {
                const selected = (): boolean => { return p.ac.getValue().indexOf(item[0]) >= 0; };
                return <li aria-selected={selected()} role="option" classList={{ [styles.selected]: selected() }}
                    ref={el => {
                        if (i() >= props.options.length) {
                            li.push(el);
                        } else {
                            li[i()] = el;
                        }
                    }}
                    onClick={e => {
                        if (props.readonly || props.disabled) { return; }
                        e.stopPropagation();

                        let items = [...p.ac.getValue()];
                        const index = items.indexOf(item[0]);
                        if (index < 0) { // 不存在则添加
                            items.push(item[0]);
                        } else { // 已存在则删除
                            items.splice(index, 1);
                        }
                        p.ac.setValue(items);
                        calcPos(); // 多选的情况下，改变值可能引起宽度变化。
                        p.ac.setError();
                    }}
                >
                    {cloneElement(item[1])}
                    <IconCheck class={joinClass(styles.tail, selected() ? undefined : '!hidden')} />
                </li>;
            }}
        </For>;
    };

    // multiple 为 false 时的候选框的组件
    const SingleOptions = (p: { ac: Accessor<T> }) => {
        return <For each={props.options}>
            {(item, i) => {
                const selected = () => p.ac.getValue() === item[0];
                return <li role="option" aria-selected={selected()} classList={{ [styles.selected]: selected() }}
                    ref={el => {
                        if (i() >= props.options.length) {
                            li.push(el);
                        } else {
                            li[i()] = el;
                        }
                    }}
                    onClick={e => {
                        if (props.readonly || props.disabled) { return; }
                        e.stopPropagation();

                        if (!selected()) {
                            p.ac.setValue(item[0]);
                            p.ac.setError();
                        }
                        ul.hidePopover();
                    }}
                >
                    {cloneElement(item[1])}
                    <IconCheck class={joinClass(styles.tail, selected() ? undefined : '!hidden')} />
                </li>;
            }}
        </For>;
    };

    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.accessor.hasHelp(), !!props.label));

    const id = createUniqueId();
    return <Field class={joinClass(styles.activator, props.class)}
        title={props.title} palette={props.palette} aria-haspopup
    >
        <Show when={areas().labelArea}>
            {area => <label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)} ref={el => anchorRef = el}
            onClick={clickInput} tabIndex={props.tabindex}
            class={joinClass(styles['activator-container'], props.rounded ? 'rounded-full' : undefined)}>
            <input id={id} tabIndex={props.tabindex} class="hidden peer"
                disabled={props.disabled} readOnly={props.readonly}
            />
            <div class={styles.input}>
                <Switch fallback={<span class={styles.placeholder} innerHTML={props.placeholder ?? '&#160;'} />}>
                    <Match when={props.multiple && (props.accessor.getValue() as Array<T>).length > 0}>
                        <MultipleActivator access={props.accessor as Accessor<Array<T>>} />
                    </Match>
                    <Match when={!props.multiple && props.accessor.getValue()}>
                        <SingleActivator access={props.accessor as Accessor<T>} />
                    </Match>
                </Switch>
            </div>
            <IconExpandAll class={styles.expand} />

            <ul popover="auto" ref={el => ul = el} class={styles.options}>
                <Switch>
                    <Match when={props.multiple}><MultipleOptions ac={props.accessor as Accessor<Array<T>>} /></Match>
                    <Match when={!props.multiple}><SingleOptions ac={props.accessor as Accessor<T>} /></Match>
                </Switch>
            </ul>
        </div>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
