// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Button, fieldAccessor, MountProps, TextArea } from '@cmfx/components';
import { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { boolSelector, layoutSelector } from '@docs/components/base';

export default function(props: MountProps): JSX.Element {
    const f = fieldAccessor('name', '5');
    const [Disabled, disabled] = boolSelector('_d.demo.disabled');
    const [Readonly, readonly] = boolSelector('_d.demo.readonly');
    const [Layout, layout] = layoutSelector('_d.demo.componentLayout', 'horizontal');
    const [Count, count] = boolSelector('_d.demo.charCount', false);

    return <div>
        <Portal mount={props.mount}>
            <Readonly />
            <Disabled />
            <Layout />
            <Count />
            <Button palette="primary" onclick={() => f.setError(f.getError() ? undefined : 'error')}>toggle error</Button>
        </Portal>
        <TextArea count={count()} hasHelp layout={layout()} palette='primary' label='primary' title='primary'
            disabled={disabled()} readonly={readonly()} accessor={f} />
        <TextArea count={count()} hasHelp layout={layout()} palette='error' label='error' title='error'
            disabled={disabled()} readonly={readonly()} accessor={f} />
    </div>;
}
