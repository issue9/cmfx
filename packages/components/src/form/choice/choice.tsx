// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { createMemo, createUniqueId, For, JSX, Match, mergeProps, Show, Switch } from 'solid-js';
import IconExpandAll from '~icons/material-symbols/expand-all';

import { AvailableEnumType, cloneElement, joinClass, transitionDuration } from '@/base';
import {
    Accessor, calcLayoutFieldAreas, Field, fieldArea2Style, FieldBaseProps, FieldHelpArea, useForm
} from '@/form/field';
import { Dropdown, DropdownRef, MenuItem, MenuItemItem } from '@/menu';
import { sleep } from '@cmfx/core';
import styles from './style.module.css';

/**
 * 单个选择项的类型
 *
 * @remarks 直接采用了与 {@link MenuItem | 菜单项} 相同的类型，但是对为 type 为 a 的项是忽略处理的。
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
     * NOTE: 非响应式属性
     */
    accessor: M extends true ? Accessor<Array<T> | undefined> : Accessor<T | undefined>;
}

/**
 * 用以替代 select 组件
 */
export function Choice<T extends AvailableEnumType = string, M extends boolean = false>(props: Props<T, M>): JSX.Element {
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

    const getSingleItem = (val: T): MenuItemItem<T> | undefined => {
        let item: MenuItemItem<T> | undefined = undefined;
        wlak(i => { if (i.value === val) { item = i; } }, props.options);
        return item;
    };

    const getMultipleItems = (vals: Array<T>): Array<MenuItemItem<T>> => {
        let items: Array<MenuItemItem<T>> = [];
        wlak(i => { if (vals.includes(i.value!)) { items.push(i); } }, props.options);
        return items;
    };

    let liList: NodeListOf<HTMLLIElement>;
    const scrollIntoView = () => { // 滚动到第一个选中项，如果选中项是子菜单，则无效。
        for (const li of liList) {
            if (li && li.ariaSelected === 'true') {
                li.scrollIntoView({ block: 'center', behavior: 'smooth' });
                return;
            }
        }
    };

    const areas = createMemo(() => calcLayoutFieldAreas(props.layout!, props.hasHelp, !!props.label));

    const value = createMemo(() => { // 生成下拉菜单的选中项
        const v = props.accessor.getValue();
        return v ? (Array.isArray(v) ? v : [v]) : undefined;
    });

    const id = createUniqueId();
    let dropdownRef: DropdownRef;
    return <Field class={joinClass(undefined, styles.activator, props.class)}
        title={props.title} palette={props.palette} aria-haspopup
    >
        <Show when={areas().labelArea}>
            {area => <label style={fieldArea2Style(area())} for={id}>{props.label}</label>}
        </Show>

        <Dropdown value={value()} items={props.options} multiple={props.multiple} ref={el => {
            const s = el.menu().element().style;
            s.maxHeight = '240px';
            s.overflowY = 'auto';

            liList = el.menu().element().querySelectorAll('li');

            dropdownRef = el;
        }} onPopover={e => {
            if (props.disabled) { return true; } // disabled 模式下不弹出菜单

            if (e) {
                sleep(transitionDuration(dropdownRef.element())).then(() => { scrollIntoView(); });
            }
            return false;
        }} onChange={e => {
            if (props.readonly || props.disabled) { return; }

            props.accessor.setValue(e as any);
        }}>
            <div style={fieldArea2Style(areas().inputArea)} tabIndex={props.tabindex}
                class={joinClass(undefined, styles['activator-container'], props.rounded ? 'rounded-full' : '')}>
                <input id={id} tabIndex={props.tabindex} class="hidden peer"
                    disabled={props.disabled} readOnly={props.readonly}
                />
                <div class={styles.input}>
                    <Switch fallback={<span class={styles.placeholder} innerHTML={props.placeholder ?? '&#160;'} />}>
                        <Match when={props.multiple ? (value() && value()!.length > 0 ? value() : undefined) : undefined}>
                            {val =>
                                <For each={getMultipleItems(val())}>
                                    {item =>
                                        <span class={styles.chip}>{cloneElement(item.label)}</span>
                                    }
                                </For>
                            }
                        </Match>
                        <Match when={!props.multiple ? (value() && value()!.length > 0 ? value()![0] : undefined) : undefined}>
                            {val => <>{cloneElement(getSingleItem(val())?.label)}</>}
                        </Match>
                    </Switch>
                </div>
                <IconExpandAll class={styles.expand} />
            </div>
        </Dropdown>

        <Show when={areas().helpArea}>
            {area => <FieldHelpArea area={area()} getError={props.accessor.getError} help={props.help} />}
        </Show>
    </Field>;
}
