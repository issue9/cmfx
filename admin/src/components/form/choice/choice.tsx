// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX, Match, mergeProps, Show, Switch } from 'solid-js';

import { cloneElement } from '@/components/base';
import { Dropdown } from '@/components/dropdown';
import { Accessor, FieldBaseProps, Options } from '@/components/form';

type Value = string | number | undefined;

interface BaseProps<T extends Value> extends FieldBaseProps {
    placeholder?: string;
    rounded?: boolean;
    options: Options<T>;

    /**
     * 尾部表示展开下拉框的图标，默认为 expand_all
     */
    expandIcon?: string;
};

export type Props<T extends Value> = BaseProps<T> & {
    multiple: true;
    accessor: Accessor<Array<T>>;
} | BaseProps<T> & {
    multiple?: false;
    accessor: Accessor<T>;
};

/**
 * 用以替代 select 组件
 */
export default function <T extends Value>(props: Props<T>): JSX.Element {
    props = mergeProps({ expandIcon: 'expand_all' }, props);

    const [optionsVisible, setOptionsVisible] = createSignal(false);

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

    const activator = <div class="c--field c--choice-activator">
        <label title={props.title} onClick={(e) => {
            e.preventDefault();
            if (!props.disabled) { setOptionsVisible(!optionsVisible()); }
            return false;
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
                <span class="material-symbols-outlined expand">{props.expandIcon}</span>
            </div>
        </label>
        <Show when={props.accessor.hasError()}>
            <p class="field_error" role="alert">{props.accessor.getError()}</p>
        </Show>
    </div>;

    // multiple 为 true 时的候选框的组件
    const MultipleOptions = (p:{ac:Accessor<Array<T>>}) => {
        return <>
            <For each={props.options}>
                {(item) => {
                    const selected = (): boolean => { return p.ac.getValue().indexOf(item[0]) >= 0; };
                    return <li aria-selected={selected()} role="option" classList={{'selected': selected()}} onClick={() => {
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
                            'material-symbols-outlined': true,
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
                {(item) => {
                    const selected = ()=>p.ac.getValue() === item[0];
                    return <li role="option" aria-selected={selected()} classList={{'selected': selected()}} onClick={() => {
                        if (props.readonly || props.disabled) { return; }

                        if (!selected()) {
                            p.ac.setValue(item[0]);
                            p.ac.setError();
                        }
                        setOptionsVisible(false);
                    }}>
                        {cloneElement(item[1])}
                        <span classList={{
                            'hidden': !selected(),
                            'material-symbols-outlined': true,
                            'tail': true,
                        }}>check</span>
                    </li>;
                }}
            </For>
        </>;
    };

    return <Dropdown tag="ul" wrapperClass='w-full' class="c--choice-options"
        setVisible={setOptionsVisible} palette={props.palette} pos='bottomleft' aria-multiselectable={props.multiple}
        visible={optionsVisible()} activator={activator}>
        <Switch>
            <Match when={props.multiple}><MultipleOptions ac={props.accessor as Accessor<Array<T>>} /></Match>
            <Match when={!props.multiple}><SingleOptions ac={props.accessor as Accessor<T>} /></Match>
        </Switch>
    </Dropdown>;
}
