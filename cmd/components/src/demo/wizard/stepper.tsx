// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Stepper, StepperRef } from '@cmfx/components';
import { JSX } from 'solid-js';
import IconChat from '~icons/material-symbols/chat';
import IconCheck from '~icons/material-symbols/check';
import IconPersion from '~icons/material-symbols/person';

import { Demo, Stage } from '../base';

export default function(): JSX.Element {
    let ref1: StepperRef;
    let ref2: StepperRef;
    let ref3: StepperRef;

    return <Demo>
        <Stage title='icon=dot' class='w-full'>
            <Stepper ref={el => ref1 = el} accentPalette='primary' steps={[
                { title: 'Step 1', content: 'Content for Step 1' },
                { title: 'Step 2222222', content: 'Content for Step 2' },
                { title: 'Step 3', content: 'Content for Step 3' },
            ]} />

            <Button onclick={() => ref1.prev()}>prev</Button>
            <Button onclick={() => ref1.next()}>next</Button>
        </Stage>

        <Stage title='icon=icon' class='w-full'>
            <Stepper ref={el => ref2 = el} accentPalette='primary' steps={[
                { title: 'Step 1', content: 'Content for Step 1', icon: IconPersion },
                { title: 'Step 2222222', content: 'Content for Step 2', icon: IconChat },
                { title: 'Step 3', content: 'Content for Step 3', icon: IconCheck },
            ]} />

            <Button onclick={() => ref2.prev()}>prev</Button>
            <Button onclick={() => ref2.next()}>next</Button>
        </Stage>

        <Stage title='icon=true' class='w-full'>
            <Stepper ref={el => ref3 = el} accentPalette='primary' steps={[
                { title: 'Step 1', content: 'Content for Step 1', icon: (c?: boolean)=> c ? IconCheck : true },
                { title: 'Step 2', content: 'Content for Step 2', icon: (c?: boolean)=> c ? IconCheck : true },
                { title: 'Step 3', content: 'Content for Step 3', icon: true },
            ]} />

            <Button onclick={() => ref3.prev()}>prev</Button>
            <Button onclick={() => ref3.next()}>next</Button>
        </Stage>
    </Demo>;
}
