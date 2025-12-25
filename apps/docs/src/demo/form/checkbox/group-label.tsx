// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, CheckboxGroup, fieldAccessor, FieldOptions, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, labelAlignSelector, layoutSelector } from '../../base';

export default function(props: MountProps) {
    const [Layout, layout] = layoutSelector('布局');
    const [ItemLayout, itemLayout] = layoutSelector('子项布局');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Block, block] = boolSelector('block');
    const [Rounded, rounded] = boolSelector('_d.demo.rounded');
    const [LabelAlign, labelAlign] = labelAlignSelector('start');

    const groupFA = fieldAccessor('checkbox', ['1']);
    const groupOptions: FieldOptions<string> = [
        { value: '1', label: <div>abc</div> },
        { value: '2', label: <div style="color:red">red</div> },
        { value: '3', label: <div style="color:red">red<br />red<br />red</div> },
    ];

    return <div>
        <Portal mount={props.mount}>
            <Readonly />
            <Disabled />
            <Block />
            <Rounded />
            <Layout />
            <ItemLayout />
            <LabelAlign />

            <Button palette="primary" onclick={() => groupFA.setError(groupFA.getError() ? undefined : 'error')}>toggle error</Button>
        </Portal>

        <div>
            <CheckboxGroup hasHelp help="help text" layout={layout()} itemLayout={itemLayout()} rounded={rounded()}
                block={block()} disabled={disabled()} readonly={readonly()} label="group" palette="primary"
                options={groupOptions} accessor={groupFA} labelAlign={labelAlign()} labelWidth='100px'
            />
            <pre>{groupFA.getValue().toString()}</pre>
        </div>
    </div>;
}
