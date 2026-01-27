// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { createSignal, JSX, Match, mergeProps, onCleanup, onMount, Switch } from 'solid-js';
import IconClear from '~icons/material-symbols/close';
import IconSearch from '~icons/material-symbols/search';

import { BaseProps, joinClass } from '@components/base';
import { useLocale } from '@components/context';
import { Input, InputRef } from '@components/input';
import { TextProps } from '@components/input/input';
import { Dropdown, DropdownProps, DropdownRef, MenuItemItem } from '@components/menu';
import styles from './style.module.css';

export interface Props extends BaseProps {
    hotkey?: Hotkey;

    /**
     * 圆角
     *
     * @reactive
     */
    rounded?: boolean;

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
    inputMode: TextProps['inputMode'];

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
    const [candidate, setCandidate] = createSignal<Array<MenuItemItem<string>>>([]);

    const [value, setValue] = createSignal('');

    let inputRef: InputRef;

    const click = (e: MouseEvent) => {
        if (!dropdownRef.root().contains(e.target as HTMLElement)) {
            dropdownRef.hide();
        }
    };

    onMount(() => { // 绑定快捷键
        if (props.hotkey) { Hotkey.bind(props.hotkey, () => inputRef.input().focus()); }
        document.addEventListener('click', click);
    });
    onCleanup(()=>{
        if (props.hotkey) { Hotkey.unbind(props.hotkey); }
        document.removeEventListener('click', click);
    });

    return <Dropdown palette={props.palette} class={joinClass(undefined, styles.dropdown, props.class)}
        style={props.style} trigger='custom' items={candidate()} ref={el => {
            dropdownRef = el;
            dropdownRef.menu().root().style.height = '240px';
            dropdownRef.menu().root().style.overflowY = 'auto';
        }} onPopover={visible => {
            if (visible) {
                dropdownRef.menu().root().style.width
                    = dropdownRef.root().getBoundingClientRect().width + 'px';
            }
            return false;
        }} onChange={(val, old) => {
            if (props.onSelect) { props.onSelect(val, old); }
            (document.activeElement as any).blur();
        }}
    >
        <Input rounded={props.rounded} inputMode={props.inputMode} type='search' autocomplete='off'
            placeholder={l.t('_c.search')} prefix={props.icon ? <IconSearch class={styles.icon} /> : undefined} suffix={
                <Switch>
                    <Match when={!value() && props.hotkey ? props.hotkey : undefined}>
                        {hk => <kbd>{hk().toString(true)}</kbd>}
                    </Match>
                    <Match when={value() && props.clear}>
                        <IconClear class={styles.clear} onclick={() => {
                            setValue('');
                            inputRef.input().focus();
                        }} />
                    </Match>
                </Switch>
            } ref={el => {
                inputRef = el;
                el.input().onfocus = async () => {
                    setCandidate(await props.onSearch(value()));
                    dropdownRef.show();
                };
                el.input().onclick = () => dropdownRef.show(); // 解决 onfocus 自动关闭 dropdown 的问题
            }} value={value()} onChange={async (v) => {
                setCandidate(await props.onSearch(v ?? ''));
                setValue(v ?? '');
                dropdownRef.show();
            }}
        />
    </Dropdown>;
}
