// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Match, onCleanup, onMount, Show, Switch } from 'solid-js';

import { cloneElement } from '@/components/base';
import { Accessor, FieldBaseProps, Options } from '@/components/form';
import { Icon } from '@/components/icon';
import { calcPopoverPos } from '@/components/utils';

type Value = string | number | undefined;

export interface Props<T extends Value, M extends boolean> extends FieldBaseProps {
    placeholder?: string;
    rounded?: boolean;
    options: Options<T>;
    multiple?: M;
    accessor: M extends true ? Accessor<Array<T>> : Accessor<T>;
}

/**
 * 用以替代 select 组件
 */
export default function <T extends Value, M extends boolean>(props: Props<T, M>): JSX.Element {
    let pop: HTMLUListElement;

    // multiple 为 false 时的输入框样式。
    const SingleActivator = (p: {access: Accessor<T>}) => {
        return <For each={props.options}>
            {(item) => (
                <Show when={p.access.getValue() === item[0]}>
                    {cloneElement(item[1])}
                </Show>
            )}
        </For>;
    };

    // multiple 为 true 时的输入框样式。
    const MultipleActivator = (p: {access: Accessor<Array<T>>}) => {
        return <For each={props.options}>
            {(item) => (
                <Show when={p.access.getValue().indexOf(item[0]) >= 0}>
                    <span class="chip">{cloneElement(item[1])}</span>
                </Show>
            )}
        </For>;
    };

    let labelRef: HTMLLabelElement;

    const handleClick = (e: MouseEvent) => {
        if (!pop.contains(e.target as Node) && !labelRef.contains(e.target as Node)) {
            pop.hidePopover();
        }
    };
    onMount(() => {
        document.body.addEventListener('click', handleClick);
    });
    onCleanup(() => {
        document.body.removeEventListener('click', handleClick);
    });

    const calcPos = () => {
        const ab = labelRef.getBoundingClientRect();
        pop.style.minWidth = ab.width + 'px';
        pop.style.width = ab.width + 'px';
        calcPopoverPos(pop, DOMRect.fromRect(ab), '2px');
    };

    const activator = <div class={props.class} classList={{
        ...props.classList,
        'c--field': true,
        'c--choice-activator': true,
        [`palette--${props.palette}`]: !!props.palette,
    }} aria-haspopup>
        <label ref={el => labelRef = el} title={props.title} onClick={(e) => {
            e.preventDefault();
            if (pop.togglePopover()) {
                calcPos();
                scrollIntoView();
            }
        }}>
            <Show when={props.label}>{props.label}</Show>

            <div accessKey={props.accessKey} tabIndex={props.tabindex} classList={{
                'activator-container': true,
                'rounded': props.rounded
            }}>
                <input tabIndex={props.tabindex} class="hidden peer" disabled={props.disabled} readOnly={props.readonly} />
                <div class="input">
                    <Switch>
                        <Match when={props.accessor.getValue() === undefined || (props.multiple && (props.accessor.getValue() as Array<T>).length === 0)}>
                            <span class="placeholder" innerHTML={props.placeholder ?? '&#160;'} />
                        </Match>
                        <Match when={props.multiple && (props.accessor.getValue() as Array<T>).length > 0}>
                            <MultipleActivator access={props.accessor as Accessor<Array<T>>} />
                        </Match>
                        <Match when={!props.multiple}><SingleActivator access={props.accessor as Accessor<T>} /></Match>
                    </Switch>
                </div>
                <Icon class="expand" icon="expand_all" />
            </div>
        </label>
        <Show when={props.accessor.hasError()}>
            <p class="field_error" role="alert">{props.accessor.getError()}</p>
        </Show>
    </div>;

    let li: Array<HTMLLIElement> = new Array<HTMLLIElement>(props.options.length);
    const scrollIntoView = () => {
        for (var i = 0; i < props.options.length; i++) {
            const elem = li[i];
            if (elem && elem.ariaSelected === 'true') {
                elem.scrollIntoView();
                return;
            }
        }
    };

    // multiple 为 true 时的候选框的组件
    const MultipleOptions = (p:{ac:Accessor<Array<T>>}) => {
        return <>
            <For each={props.options}>
                {(item, i) => {
                    const selected = (): boolean => { return p.ac.getValue().indexOf(item[0]) >= 0; };
                    return <li aria-selected={selected()} role="option" classList={{'selected': selected()}} ref={el=>{
                        if (i()>=props.options.length) {
                            li.push(el);
                        }else{
                            li[i()] = el;
                        }
                    }}
                    onClick={() => {
                        if (props.readonly || props.disabled) { return; }

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
                    }}>
                        {cloneElement(item[1])}
                        <Icon icon="check" classList={{
                            'tail': true,
                            'hidden': !selected()
                        }} />
                    </li>;
                }}
            </For>
        </>;
    };

    // multiple 为 false 时的候选框的组件
    const SingleOptions = (p:{ac:Accessor<T>}) => {
        return <>
            <For each={props.options}>
                {(item, i) => {
                    const selected = ()=>p.ac.getValue() === item[0];
                    return <li role="option" aria-selected={selected()} classList={{ 'selected': selected() }} ref={el => {
                        if (i() >= props.options.length) {
                            li.push(el);
                        } else {
                            li[i()] = el;
                        }
                    }}
                    onClick={() => {
                        if (props.readonly || props.disabled) { return; }

                        if (!selected()) {
                            p.ac.setValue(item[0]);
                            p.ac.setError();
                        }
                        pop.hidePopover();
                    }}>
                        {cloneElement(item[1])}
                        <Icon icon='check' classList={{
                            'hidden': !selected(),
                            'tail': true,
                        }} />
                    </li>;
                }}
            </For>
        </>;
    };

    return <>
        {activator}
        <ul popover="manual" ref={el => pop = el} classList={{
            'c--choice-options': true,
            [`palette--${props.palette}`]: !!props.palette,
        }}>
            <Switch>
                <Match when={props.multiple}><MultipleOptions ac={props.accessor as Accessor<Array<T>>} /></Match>
                <Match when={!props.multiple}><SingleOptions ac={props.accessor as Accessor<T>} /></Match>
            </Switch>
        </ul>
    </>;
}
