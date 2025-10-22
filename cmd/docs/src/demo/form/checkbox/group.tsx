// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { CheckboxGroup, fieldAccessor, FieldOptions } from '@cmfx/components';

import { boolSelector, layoutSelector } from '../../base';

export default function() {
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');
    const [itemLayoutS, itemLayout] = layoutSelector('子项布局', 'horizontal');
    const [blockS, block] = boolSelector('block');
    const [roundedS, rounded] = boolSelector('rounded');

    const groupFA = fieldAccessor('checkbox', ['1']);
    const groupOptions: FieldOptions<string> = [
        { value: '1', label: <div>abc</div> },
        { value: '2', label: <div style="color:red">red</div> },
        { value: '3', label: <div style="color:red">red<br />red<br />red</div> },
    ];

    return <div>
        {readonlyS}
        {disabledS}
        {layoutS}
        {itemLayoutS}
        {blockS}
        {roundedS}

        <button class="palette--primary" onClick={() => groupFA.setError(groupFA.getError() ? undefined : 'error')}>toggle error</button>

        <div>
            <CheckboxGroup hasHelp help="help text" layout={layout()} itemLayout={itemLayout()} rounded={rounded()}
                block={block()} disabled={disabled()} readonly={readonly()} label="group" palette="primary"
                options={groupOptions} accessor={groupFA}
            />
            <pre>{groupFA.getValue().toString()}</pre>
        </div>
    </div>;
}
