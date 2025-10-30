// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Timer, timerFields, TimerRef, MountProps } from '@cmfx/components';
import { createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, boolSelector } from '../../base';

export default function (props: MountProps) {
    const [unitS, unit] = boolSelector('unit');
    const [fieldS, field] = arraySelector('field', timerFields, 'minutes');
    const [msg, setMsg] = createSignal('');

    let ref: TimerRef;

    return <div>
        <Portal mount={props.mount}>
            {unitS}
            {fieldS}
        </Portal>

        <div class="flex flex-col gap-4">
            <div title="-1">
                <Timer unit={unit()} ref={el => ref = el} duration={'23m34s'} startField={field()} interval={-1} />
                <Button palette="primary" onclick={() => ref!.toggle()}>切换暂停和启动状态</Button>
            </div>

            <div title="event:-1">
                <Timer unit={unit()} onTick={() => setMsg('tick')} onComplete={() => setMsg('complete')} duration={'10s'} startField={field()} interval={-1} autoStart />
                <div>{msg()}</div>
            </div>

            <div title="+1">
                <Timer separator={<IconFace />} unit={unit()} duration={'23m34s'} startField={field()} interval={1} autoStart />
            </div>
        </div>
    </div>;
}
