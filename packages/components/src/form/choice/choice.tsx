// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createUniqueId, For, JSX, Match, mergeProps, Show, Switch } from 'solid-js';
import IconExpandAll from '~icons/material-symbols/expand-all';
import IconClose from '~icons/material-symbols/close';

import { AvailableEnumType, cloneElement, joinClass } from '@/base';
import {
    Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldBaseProps, FieldHelpArea, useForm
} from '@/form/field';
import { Dropdown, DropdownRef, MenuItem, MenuItemItem } from '@/menu';
import styles from './style.module.css';

/**
 * 单个选择项的类型
 *
 * @remarks 直接采用了与 {@link MenuItem} 相同的类型，但是对为 type 为 a 的项是忽略处理的。
 */
export type Option<T extends AvailableEnumType = string> = MenuItem<T>;

export interface Props<T extends AvailableEnumType = string, M extends boolean = false> extends FieldBaseProps {
    placeholder?: string;

    /**
     * 选择项
     *
     * @reactive
     */
    options: Array<Option<T>>;

    /**
     * 是否多选
     *
     * @reactive
     */
    multiple?: M;

    /**
     * 选项是否可关闭
     *
     * @remarks 如果为 true，表示可以通过每个选中项后的关闭按钮取消当前选中项，
     * 如果是单选，那么可以让整个选项处于没有选中项的状态。
     *
     * @reactive
     */
    closable?: boolean;

    /**
     * NOTE: 非响应式属性
     */
    accessor: M extends true ? Accessor<Array<T> | undefined> : Accessor<T | undefined>;
}

/**
 * 用以替代 select 组件
 */
export function Choice<T extends AvailableEnumType = string, M extends boolean = false>(
    props: Props<T, M>
): JSX.Element {
    const form = useForm();
    props = mergeProps(form, props);

    const wlak = (f: { (val: MenuItemItem<T>): void; }, opts?: Array<Option<T>>) => {
        if (!opts || opts.length === 0) { return; }

        opts.forEach(o => {
            switch (o.type) {
            case 'group':
                wlak(f, o.items);
                break;
            case 'item':
                if (o.items && o.items.length > 0) {
                    wlak(f, o.items);
                } else {
                    f(o);
                }
                break;
            // NOTE: 自动忽略 a
            }
        });
    };

    const getSelectedMenuItems = (vals: Array<T>): Array<MenuItemItem<T>> => {
        let items: Array<MenuItemItem<T>> = [];
        if (props.multiple) {
            wlak(i => { if (vals.includes(i.value!)) { items.push(i); } }, props.options);
        } else {
            wlak(i => { if (i.value === vals[0]) { items.push(i); } }, props.options);
        }
        return items;
    };

    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));

    const value = createMemo(() => { // 生成下拉菜单的选中项
        const v = props.accessor.getValue();
        return v !== undefined ? (Array.isArray(v) ? v : [v]) : undefined;
    });

    const id = createUniqueId();
    let dropdownRef: DropdownRef;
    return <Field class={joinClass(undefined, styles.activator, props.class)}
        title={props.title} palette={props.palette}
    >
        <Show when={areas().labelArea}>
            {area => <label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <div style={fieldArea2Style(areas().inputArea)} tabIndex={props.tabindex}>
            <Dropdown value={value()} items={props.options} multiple={props.multiple} ref={el => {
                const s = el.menu().element().style;
                s.maxHeight = '240px';
                s.overflowY = 'auto';

                dropdownRef = el;
            }} onPopover={e => {
                if (props.disabled) { return true; } // disabled 模式下不弹出菜单

                if (e) { dropdownRef.menu().scrollSelectedIntoView(); }
                return false;
            }} onChange={e => {
                if (props.readonly || props.disabled) { return; }

                props.accessor.setValue(e as any);
            }}>
                <div class={joinClass(undefined, styles['activator-container'], props.rounded ? 'rounded-full' : '')}>
                    <input id={id} tabIndex={props.tabindex} class="hidden peer"
                        disabled={props.disabled} readOnly={props.readonly}
                    />
                    <div class={styles.input}>
                        <Switch fallback={<span class={styles.placeholder} innerHTML={props.placeholder ?? '&#160;'} />}>
                            <Match when={value() && value()!.length > 0 ? value() : undefined}>
                                {val =>
                                    <For each={getSelectedMenuItems(val())}>
                                        {item =>
                                            <span class={styles.chip}>
                                                {cloneElement(item.label)}
                                                <Show when={props.closable}>
                                                    <IconClose class={styles.close} onclick={e => {
                                                        if (props.disabled || props.readonly) { return; }

                                                        if (props.multiple) {
                                                            const v = props.accessor.getValue() as Array<T>;
                                                            const vals = v.filter(vv => vv != item.value);
                                                            props.accessor.setValue(vals as any);
                                                        } else {
                                                            props.accessor.setValue(undefined);
                                                        }
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                    }} />
                                                </Show>
                                            </span>
                                        }
                                    </For>
                                }
                            </Match>
                        </Switch>
                    </div>
                    <IconExpandAll class={styles.expand} />
                </div>
            </Dropdown>
        </div>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
