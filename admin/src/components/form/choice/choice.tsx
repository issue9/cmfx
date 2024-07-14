// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX, Match, mergeProps, onCleanup, onMount, Show, Switch } from 'solid-js';

import { cloneElement } from '@/components/base';
import { Dropdown } from '@/components/dropdown';
import { Accessor, FieldBaseProps, Options } from '@/components/form';

type Value = string | number;

export interface Props<T extends Value> extends FieldBaseProps {
    placeholder?: string;
    rounded?: boolean;
    options: Options<T>;
    multiple?: boolean;

    /**
     * 尾部表示展开下拉框的图标，默认为 expand_all
     */
    expandIcon?: string;

    /**
     * NOTE: 无论 multiple 是否为 true，值的类型始终是数组。
     */
    accessor: Accessor<Array<T>>;
};

/**
 * 用以替代 select 组件
 */
export default function <T extends Value>(props: Props<T>): JSX.Element {
    props = mergeProps({ expandIcon: 'expand_all' }, props);
    let optRef: HTMLUListElement;
    let actRef: HTMLDivElement;

    const ac = props.accessor;
    const [optionsVisible, setOptionsVisible] = createSignal(false);

    const handleClick = (e: MouseEvent) => {
        if (!optRef.contains(e.target as Node) && !actRef.contains(e.target as Node)) {
            setOptionsVisible(false);
        }
    };
    onMount(() => {
        document.body.addEventListener('click', handleClick);
    });
    onCleanup(() => {
        document.body.removeEventListener('click', handleClick);
    });

    // multiple 为 false 时的输入框样式。
    const SingelActivator = () => {
        return <For each={props.options}>
            {(item) => (
                <Show when={ac.getValue().indexOf(item[0]) >= 0}>
                    {cloneElement(item[1])}
                </Show>
            )}
        </For>;
    };

    // multiple 为 true 时的输入框样式。
    const MultipleActivator = () => {
        return <For each={props.options}>
            {(item) => (
                <Show when={ac.getValue().indexOf(item[0]) >= 0}>
                    <span class="chip">{cloneElement(item[1])}</span>
                </Show>
            )}
        </For>;
    };

    const activator = <div ref={(el) => actRef = el} class="field choice-activator">
        <label title={props.title} onClick={(e) => {
            if (!props.disabled) { setOptionsVisible(!optionsVisible()); e.preventDefault(); }
        }}>
            <Show when={props.label}>{props.label}</Show>

            <div classList={{
                'activator-container': true,
                'rounded': props.rounded
            }}>
                <input class="hidden peer" disabled={props.disabled} readOnly={props.readonly} />
                <div class="input">
                    <Switch>
                        <Match when={ac.getValue().length === 0}>
                            <span class="placeholder">{props.placeholder}</span>
                        </Match>
                        <Match when={props.multiple && ac.getValue().length > 0}><MultipleActivator /></Match>
                        <Match when={!props.multiple && ac.getValue().length > 0}><SingelActivator /></Match>
                    </Switch>
                </div>
                <span class="material-symbols-outlined tail">{props.expandIcon}</span>
            </div>
        </label>
        <Show when={ac.hasError()}>
            <p class="field_error" role="alert">{ac.getError()}</p>
        </Show>
    </div>;

    // multiple 为 true 时的候选框的组件
    const MultipleOptions = () => {
        return <>
            <For each={props.options}>
                {(item) => (
                    <li onClick={() => {
                        if (props.readonly) { return; }

                        let items = [...ac.getValue()];
                        const index = items.indexOf(item[0]);
                        if (index < 0) { // 不存在则添加
                            items.push(item[0]);
                        } else { // 已存在则删除
                            items.splice(index, 1);
                        }
                        ac.setValue(items);
                        ac.setError();
                    }}>
                        {item[1]}
                        <span classList={{
                            'material-symbols-outlined': true,
                            'tail': true,
                            'hidden': ac.getValue().indexOf(item[0]) < 0
                        }}>check</span>
                    </li>
                )}
            </For>
        </>;
    };

    // multiple 为 true 时的候选框的组件
    const SingleOptions = () => {
        return <>
            <For each={props.options}>
                {(item) => (
                    <li classList={{
                        'selected': ac.getValue()[0] === item[0]
                    }} onClick={() => {
                        if (props.readonly) { return; }

                        if (item[0] !== ac.getValue()[0]) {
                            ac.setValue([item[0]]);
                            ac.setError();
                        }
                        setOptionsVisible(false);
                    }}>
                        {item[1]}
                        <span classList={{
                            'material-symbols-outlined': true,
                            'tail': true,
                            'hidden': ac.getValue()[0] !== item[0]
                        }}>check</span>
                    </li>
                )}
            </For>
        </>;
    };

    const options = <ul class="choice-options" ref={(el)=>optRef=el}>
        <Switch>
            <Match when={props.multiple}><MultipleOptions /></Match>
            <Match when={!props.multiple}><SingleOptions /></Match>
        </Switch>
    </ul>;

    return <Dropdown scheme={props.scheme} pos='bottomleft' visible={optionsVisible()} activator={activator}>{ options }</Dropdown>;
}
