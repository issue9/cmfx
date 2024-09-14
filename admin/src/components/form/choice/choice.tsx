// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, Match, Show, Switch } from 'solid-js';

import { cloneElement } from '@/components/base';
import { Accessor, FieldBaseProps, Options } from '@/components/form';

type Value = string | number | undefined;

interface BaseProps<T extends Value> extends FieldBaseProps {
    placeholder?: string;
    rounded?: boolean;
    options: Options<T>;
}

export type Props<T extends Value> = BaseProps<T> & {
    multiple: true;
    accessor: Accessor<Array<T>>;
} | BaseProps<T> & {
    multiple?: false;
    accessor: Accessor<T>;
};

function togglePop(anchor: Element, pop: HTMLUListElement): boolean {
    const ret = pop.togglePopover(); // 必须要先显示，后面的调整大小才有效果。

    // [CSS anchor](https://caniuse.com/?search=anchor) 支持全面的话，可以用 CSS 代替。

    const ab = anchor.getBoundingClientRect();
    pop.style.minWidth = ab.width + 'px';
    pop.style.width = ab.width + 'px';
    pop.style.top = ab.bottom + 'px';
    pop.style.left = ab.left + 'px';

    return ret;
}

/**
 * 用以替代 select 组件
 */
export default function <T extends Value>(props: Props<T>): JSX.Element {
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
    const activator = <div class="c--field c--choice-activator" aria-haspopup>
        <label ref={el=>labelRef=el} title={props.title} onClick={(e) => {
            e.preventDefault();
            if (togglePop(labelRef, pop)) {
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
                        <Match when={props.accessor.getValue() === undefined || (props.multiple && props.accessor.getValue().length === 0)}>
                            <span class="placeholder">{props.placeholder}</span>
                        </Match>
                        <Match when={props.multiple && props.accessor.getValue().length > 0}><MultipleActivator access={props.accessor as Accessor<Array<T>>} /></Match>
                        <Match when={!props.multiple}><SingleActivator access={props.accessor as Accessor<T>} /></Match>
                    </Switch>
                </div>
                <span class="c--icon expand">expand_all</span>
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
                        p.ac.setError();
                    }}>
                        {cloneElement(item[1])}
                        <span classList={{
                            'c--icon': true,
                            'tail': true,
                            'hidden': !selected()
                        }}>check</span>
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
                        <span classList={{
                            'hidden': !selected(),
                            'c--icon': true,
                            'tail': true,
                        }}>check</span>
                    </li>;
                }}
            </For>
        </>;
    };

    return <>
        {activator}
        <ul popover="auto" ref={el=>pop=el} class="c--choice-options">
            <Switch>
                <Match when={props.multiple}><MultipleOptions ac={props.accessor as Accessor<Array<T>>} /></Match>
                <Match when={!props.multiple}><SingleOptions ac={props.accessor as Accessor<T>} /></Match>
            </Switch>
        </ul>
    </>;
}
