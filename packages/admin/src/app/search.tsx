// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog, DialogRef, fieldAccessor, Label, Locale, TextField, TextFieldRef } from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import { useNavigate } from '@solidjs/router';
import { createSignal, For, JSX, onMount, Setter, Show } from 'solid-js';
import IconClose from '~icons/material-symbols/close';
import IconSearch from '~icons/material-symbols/search';

import { useAdmin, useLocale } from '@/context';
import { MenuItem } from '@/options';
import styles from './style.module.css';

interface Item {
    value: string;
    label: JSX.Element;
}

export interface Props {
    switch: Setter<string>;
    hotkey?: Hotkey;
}

/**
 * 顶部搜索框
 */
export function Search(props: Props): JSX.Element {
    const l = useLocale();
    const [, , opt] = useAdmin();
    let dlgRef: DialogRef;
    let listRef: HTMLUListElement;
    const [items, setItems] = createSignal<Array<Item>>(buildItemsWithSearch(l.t, opt.aside.menus, ''));

    const input = fieldAccessor('search', '');
    input.onChange((val: string) => {
        setItems(buildItemsWithSearch(l.t, opt.aside.menus, val));
    });

    const showSearch = () => {
        input.setValue('');
        dlgRef.showModal();
    };

    let currItem: HTMLElement; // 表示搜索框中当前选中的框

    // 处理键盘事件
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!currItem) { currItem = listRef.firstChild as HTMLElement; }
        if (!currItem) { return; } // 不存在符合条件的元素，直接返回。

        currItem.classList.remove(styles.selected);

        switch (e.key) {
        case 'ArrowDown':
            currItem = (currItem.nextSibling ?? listRef.firstChild) as HTMLElement;
            e.preventDefault();
            break;
        case 'ArrowUp':
            currItem = (currItem.previousSibling ?? listRef.lastChild) as HTMLElement;
            e.preventDefault();
            break;
        case 'Enter':
            currItem.click();
            e.preventDefault();
            break;
        }

        if (currItem) { // 如果没有候选项的话，currItem 此时为空。
            currItem.classList.add(styles.selected);
            currItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }

        e.stopPropagation();
    };

    let inputRef: TextFieldRef;
    onMount(() => {
        inputRef.onkeydown = handleKeyDown;
    });

    const nav = useNavigate();
    return <>
        <Dialog ref={el => dlgRef = el} class={styles.search} actions={
            <div class="w-full">
                <div class="w-full text-left" innerHTML={l.t('_p.app.keyDesc')}></div>
            </div>
        }>
            <TextField ref={el=>inputRef=el} class='mb-3 border-0' accessor={input} placeholder={l.t('_p.app.searchAtSidebar')} suffix={
                <Show when={input.getValue() !== ''}>
                    <IconClose class="!flex !items-center cursor-pointer me-1" onClick={() => input.setValue('')} />
                </Show>
            } prefix={<IconSearch class="ms-1 self-center w-auto" />}
            />

            <ul ref={el => listRef = el} onKeyDown={handleKeyDown} tabindex={-1} class={styles.list}>
                <For each={items()}>{(item) => (
                    <li onClick={()=>{
                        props.switch(item.value);
                        nav(item.value);
                        dlgRef.close('');
                    }}>{ item.label }</li>
                )}</For>
            </ul>
        </Dialog>

        <Button square type='button' kind='flat' rounded hotkey={props.hotkey}
            title={l.t('_c.search')}
            onClick={showSearch}><IconSearch /></Button>
    </>;
}

/**
* 根据搜索的内容生成一个平级的菜单列表
*
* @param t - 本地化对象，所有菜单都将由此进行初始化；
* @param menus - 所有菜单项，结果从此菜单中筛选；
* @param search - 需要搜索的内容；
* @returns 包含搜索内容的所有菜单项；
*/
export function buildItemsWithSearch(t: Locale['t'], menus: Array<MenuItem>, search: string) {
    const items: Array<Item> = [];

    if (!search) {
        return items;
    }

    menus.forEach((mi) => {
        switch (mi.type) {
        case 'divider':
            return;
        case 'group':
            const c = buildItemsWithSearch(t, mi.items, search);
            if (c.length > 0) { items.push(...c); }
            break;
        case 'item':
            if (mi.items && mi.items.length > 0) {
                const cc = buildItemsWithSearch(t, mi.items, search);
                if (cc.length > 0) { items.push(...cc); }
            } else {
                const label = t(mi.label);
                if (label.toLowerCase().includes(search.toLowerCase())) {
                    items.push({
                        label: <Label icon={mi.icon}>{label}</Label>,
                        value: mi.path!,
                    });
                }
            }
            break;
        }
    });

    return items;
}
