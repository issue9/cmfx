// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, For, JSX, Match, mergeProps, Show, Switch } from 'solid-js';

import { renderElementProp } from '@/components/base';
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

    const ac = props.accessor;
    const [optionsVisible, setOptionsVisible] = createSignal(false);

    // multiple 为 false 时的输入框样式。
    const SingelActivator = () => {
        return <For each={props.options}>
            {(item) => (
                <Show when={ac.getValue().indexOf(item[0]) >= 0}>
                    {renderElementProp(item[1])}
                </Show>
            )}
        </For>;
    };

    // multiple 为 true 时的输入框样式。
    const MultipleActivator = () => {
        return <For each={props.options}>
            {(item) => (
                <Show when={ac.getValue().indexOf(item[0]) >= 0}>
                    <span class="chip">{renderElementProp(item[1])}</span>
                </Show>
            )}
        </For>;
    };

    const activator = <div class="field choice-activator">
        <label title={props.title} onClick={(e) => {
            e.preventDefault();
            if (!props.disabled) { setOptionsVisible(!optionsVisible()); }
            return false;
        }}>
            <Show when={props.label}>{renderElementProp(props.label)}</Show>

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
                {(item) => {
                    const selected = (): boolean => { return ac.getValue().indexOf(item[0]) >= 0; };
                    return <li aria-selected={selected()} role="option" classList={{'selected': selected()}} onClick={() => {
                        if (props.readonly || props.disabled) { return; }

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
                        {renderElementProp(item[1])}
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
    const SingleOptions = () => {
        return <>
            <For each={props.options}>
                {(item) => {
                    const selected = ()=>ac.getValue()[0] === item[0];
                    return <li role="option" aria-selected={selected()} classList={{'selected': selected()}} onClick={() => {
                        if (props.readonly || props.disabled) { return; }

                        if (!selected()) {
                            ac.setValue([item[0]]);
                            ac.setError();
                        }
                        setOptionsVisible(false);
                    }}>
                        {renderElementProp(item[1])}
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

    return <Dropdown tag="ul" role="listbox" wrapperClass='w-full' class="choice-options"
        setVisible={setOptionsVisible} palette={props.palette} pos='bottomleft' aria-multiselectable={props.multiple}
        visible={optionsVisible()} activator={activator}>
        <Switch>
            <Match when={props.multiple}><MultipleOptions /></Match>
            <Match when={!props.multiple}><SingleOptions /></Match>
        </Switch>
    </Dropdown>;
}
