// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { JSX, onMount, createSignal, Match, mergeProps, Switch, onCleanup } from 'solid-js';
import IconSearch from '~icons/material-symbols/search';
import IconClear from '~icons/material-symbols/close';

import { BaseProps, joinClass } from '@/base';
import { MenuItemItem, DropdownRef, Dropdown, DropdownProps } from '@/menu';
import { fieldAccessor, InputMode, TextField, TextFieldRef } from '@/form';
import styles from './style.module.css';
import { useLocale } from '@/context';

export interface Props extends BaseProps {
    hotkey?: Hotkey;

    /**
     * 搜索框的图标
     *
     * @reactive
     */
    icon?: boolean;

    /**
     * 搜索框的清除图标
     *
     * @reactive
     */
    clear?: boolean;

    /**
     * placeholder
     *
     * @reactive
     */
    placeholder?: string;

    /**
     * 键盘的输入模式
     *
     * @reactive
     */
    inputMode?: InputMode;

    onSearch: { (text: string): Promise<Array<MenuItemItem<string>>>; };

    /**
     * 选择弹出项时触发的事件
     */
    onSelect?: DropdownProps['onChange'];
}

/**
 * 搜索框
 *
 * @remarks 这本质上是对 {@link Dropdown} 的封装。与 {@link TextField} 相比，
 * 提供了更多的选项，且 onSearch 返回的也不再是纯文本。
 */
export default function Search(props: Props): JSX.Element {
    const l = useLocale();
    props = mergeProps({ placeholder: l.t('_c.search') } as Props, props);

    let dropdownRef: DropdownRef;
    const fa = fieldAccessor('search', '');
    const [candidate, setCandidate] = createSignal<Array<MenuItemItem<string>>>([]);

    let textfieldRef: TextFieldRef;

    onMount(() => { // 绑定快捷键
        if (props.hotkey) { Hotkey.bind(props.hotkey, () => textfieldRef.input().focus()); }
    });
    onCleanup(()=>{
        if (props.hotkey) { Hotkey.unbind(props.hotkey); }
    });

    fa.onChange(async (value) => {
        setCandidate(await props.onSearch(value));
        dropdownRef.show();
    });

    return <Dropdown palette={props.palette} class={joinClass(undefined, styles.dropdown, props.class)}
        trigger='custom' items={candidate()} ref={el => {
            dropdownRef = el;
            dropdownRef.menu().element().style.height = '240px';
            dropdownRef.menu().element().style.overflowY = 'auto';
        }} onPopover={visible => {
            if (visible) {
                dropdownRef.menu().element().style.width
                    = dropdownRef.element().getBoundingClientRect().width + 'px';
            }
            return false;
        }} onChange={(val,old)=>{
            if (props.onSelect) { props.onSelect(val, old); }
            (document.activeElement as any).blur();
        }}
    >
        <TextField palette={props.palette} inputMode={props.inputMode} type='search' autocomplete='off' accessor={fa}
            placeholder={l.t('_c.search')} prefix={props.icon ? <IconSearch class={styles.icon} /> : undefined} suffix={
                <Switch>
                    <Match when={!fa.getValue() && props.hotkey ? props.hotkey : undefined}>
                        {hk => <kbd>{hk().toString(true)}</kbd>}
                    </Match>
                    <Match when={fa.getValue() && props.clear}>
                        <IconClear class={styles.clear} onclick={() => {
                            fa.setValue('');
                            textfieldRef.input().focus();
                        }} />
                    </Match>
                </Switch>
            } ref={el => {
                textfieldRef = el;
                el.input().onfocus = async () => {
                    setCandidate(await props.onSearch(fa.getValue()));
                    dropdownRef.show();
                };
                el.input().onclick = () => dropdownRef.show(); // 解决 onfocus 自动关闭 dropdown 的问题
            }}
        />
    </Dropdown>;
}
