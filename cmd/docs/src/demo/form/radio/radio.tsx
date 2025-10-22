// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT


import { FieldOptions, Palette, Radio } from '@cmfx/components';

import { boolSelector, palettesWithUndefined } from '../../base';

export default function() {
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [blockS, block] = boolSelector('block');
    const [roundedS, rounded] = boolSelector('rounded');

    const options: FieldOptions<Palette | 'undefined'> = [];
    palettesWithUndefined.forEach(item => {
        if (item) {
            options.push({ value: item, label: item });
        } else {
            options.push({ value: 'undefined', label: 'undefined' });
        }
    });

    return <div>
        {readonlyS}
        {disabledS}
        {blockS}
        {roundedS}

        <div>
            <input type="radio" name="radio1" value="option1" tabindex={0} readonly={readonly()} disabled={disabled()} />
            <input type="radio" name="radio1" value="option2" tabindex={0} readonly={readonly()} disabled={disabled()} />
            <Radio name="radio1" label="Radio" block={block()} tabindex={0} rounded={rounded()} value="option3" readonly={readonly()} disabled={disabled()} />
        </div>
    </div>;
}
