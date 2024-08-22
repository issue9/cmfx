// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal, mergeProps, Show, splitProps } from 'solid-js';

import { Dropdown } from '@/components/dropdown';
import { default as Panel, Props as PanelProps } from './panel';
import { formatDate } from './utils';

export interface Props extends PanelProps {
    placeholder?: string;

    rounded?: boolean;

    // TODO min, max, range

    /**
     * 尾部表示展开下拉框的图标，默认为 expand_all
     */
    expandIcon?: string;
}

const defaultProps: Partial<Props> = {
    weekBase: 0,
    expandIcon: 'expand_all'
};

export default function(props: Props) {
    props = mergeProps(defaultProps, props);
    const [panelProps, _] = splitProps(props, ['time', 'weekBase', 'accessor', 'weekend', 'disabled', 'readonly']);

    const [panelVisible, setPanelVisible] = createSignal(false);
    const ac = props.accessor;

    const activator = <div accessKey={props.accessKey} class="c--field c--date-activator">
        <label title={props.title} onClick={(e) => {
            e.preventDefault();
            if (!props.disabled) {  setPanelVisible(!panelVisible()); }
        }}>
            <Show when={props.label}>{props.label}</Show>
            <div tabIndex={props.tabindex} classList={{
                'activator-container': true,
                'rounded': props.rounded
            }}>
                <input class="hidden peer" disabled={props.disabled} readOnly={props.readonly} />
                <div class="input">
                    { formatDate(new Date(ac.getValue()), props.time) }
                </div>
                <span class="c--icon tail">{props.expandIcon}</span>
            </div>
        </label>
        <Show when={ac.hasError()}>
            <p class="field_error" role="alert">{ac.getError()}</p>
        </Show>
    </div>;

    return <Dropdown setVisible={setPanelVisible} wrapperClass="w-full" palette={props.palette} activator={ activator } visible={panelVisible()}>
        <Panel {...panelProps} />
    </Dropdown>;
}
