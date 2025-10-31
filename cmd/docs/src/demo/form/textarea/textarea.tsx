// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { fieldAccessor, TextArea, MountProps, Button } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector } from '../../base';

export default function(props: MountProps) {
    const f = fieldAccessor('name', '5');
    const [disabledS, disabled] = boolSelector('disabled');
    const [readonlyS, readonly] = boolSelector('readonly');
    const [layoutS, layout] = layoutSelector('布局', 'horizontal');

    return <div>
        <Portal mount={props.mount}>
            {readonlyS}
            {disabledS}
            {layoutS}
            <Button palette="primary" onclick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</Button>
        </Portal>
        <TextArea hasHelp layout={layout()} palette='primary' label='primary' title='primary'
            disabled={disabled()} readonly={readonly()} accessor={f} />
        <TextArea hasHelp layout={layout()} palette='error' label='error' title='error'
            disabled={disabled()} readonly={readonly()} accessor={f} />
    </div>;
}
