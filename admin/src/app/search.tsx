// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX, onMount, Setter, Show } from 'solid-js';

import { Button, Dialog, DialogRef, FieldAccessor, Icon, Label, MenuItem, TextField, TextFieldRef, useApp, useOptions } from '@/components';
import { Locale } from '@/core';

interface Item {
    value: string;
    label: JSX.Element;
}

export interface Props {
    switch: Setter<string>;
}

/**
 * 顶部搜索框
 */
export function Search(props: Props): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();
    let dlgRef: DialogRef;
    let listRef: HTMLUListElement;
    const [items, setItems] = createSignal<Array<Item>>(buildItemsWithSearch(ctx.locale(), opt.menus, ''));

    const input = FieldAccessor('search', '', false);
    input.onChange((val: string) => {
        setItems(buildItemsWithSearch(ctx.locale(), opt.menus, val));
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

        currItem.classList.remove('selected');

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
            currItem.classList.add('selected');
            currItem.scrollIntoView({ block: 'center' });
        }

        e.stopPropagation();
    };

    let inputRef: TextFieldRef;
    onMount(() => {
        inputRef.onkeydown = handleKeyDown;
    });

    return <>
        <Dialog ref={el => dlgRef = el} class="app-search" actions={
            <div class="w-full">
                <div class="w-full text-left" innerHTML={ctx.locale().t('_i.app.keyDesc')}></div>
            </div>
        }>
            <TextField ref={el=>inputRef=el} class='mb-3 border-0' accessor={input} placeholder={ctx.locale().t('_i.app.searchAtSidebar')} suffix={
                <Show when={input.getValue() !== ''}>
                    <Icon icon='close' class="!flex !items-center cursor-pointer mr-1" onClick={() => input.setValue('')} />
                </Show>
            } prefix={
                <Icon icon='search' class="!flex !items-center ms-1" />
            } />

            <ul ref={el=>listRef=el} onKeyDown={handleKeyDown} tabindex={-1} class="list">
                <For each={items()}>{(item) => (
                    <li onClick={()=>{
                        props.switch(item.value);
                        ctx.navigate()(item.value);
                        dlgRef.close('');
                    }}>{ item.label }</li>
                )}</For>
            </ul>
        </Dialog>

        <Button icon type='button' kind='flat' rounded
            title={ctx.locale().t('_i.search')}
            onClick={showSearch}>search</Button>
    </>;
}

/**
* 根据搜索的内容生成一个平级的菜单列表
*
* @param l 本地化对象，所有菜单都将由此进行初始化；
* @param menus 所有菜单项，结果从此菜单中筛选；
* @param search 需要搜索的内容；
* @returns 包含搜索内容的所有菜单项；
*/
export function buildItemsWithSearch(l: Locale, menus: Array<MenuItem>, search: string) {
    const items: Array<Item> = [];

    if (!search) {
        return items;
    }

    menus.forEach((mi) => {
        switch (mi.type) {
        case 'divider':
            return;
        case 'group':
            const c = buildItemsWithSearch(l, mi.items, search);
            if (c.length > 0) {
                items.push(...c);
            }
            break;
        case 'item':
            if (mi.items && mi.items.length > 0) {
                const cc = buildItemsWithSearch(l, mi.items, search);
                if (cc.length > 0) {
                    items.push(...cc);
                }
            } else {
                const label = l.t(mi.label);
                if (label.includes(search)) {
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
