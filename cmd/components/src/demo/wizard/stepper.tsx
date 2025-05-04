// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Stepper, StepRef } from '@cmfx/components';
import { JSX } from 'solid-js';

import { Demo, Stage } from '../base';

export default function(): JSX.Element {
    let ref1: StepRef;
    let ref2: StepRef;
    let ref3: StepRef;

    return <Demo>
        <Stage title='icon=dot' class='w-full'>
            <Stepper ref={el => ref1 = el} accentPalette='primary' steps={[
                { title: 'Step 1', content: 'Content for Step 1' },
                { title: 'Step 2', content: 'Content for Step 2' },
                { title: 'Step 3', content: 'Content for Step 3' },
            ]} />
            
            <Button onclick={() => ref1.prev()}>prev</Button>
            <Button onclick={() => ref1.next()}>next</Button>
        </Stage>

        <Stage title='icon=icon' class='w-full'>
            <Stepper ref={el => ref2 = el} accentPalette='primary' steps={[
                { title: 'Step 1', content: 'Content for Step 1', icon: 'person' },
                { title: 'Step 2', content: 'Content for Step 2', icon: 'chat' },
                { title: 'Step 3', content: 'Content for Step 3', icon: 'check' },
            ]} />
            
            <Button onclick={() => ref2.prev()}>prev</Button>
            <Button onclick={() => ref2.next()}>next</Button>
        </Stage>

        <Stage title='icon=true' class='w-full'>
            <Stepper ref={el => ref3 = el} accentPalette='primary' steps={[
                { title: 'Step 1', content: 'Content for Step 1', icon: true },
                { title: 'Step 2', content: 'Content for Step 2', icon: true },
                { title: 'Step 3', content: 'Content for Step 3', icon: true },
            ]} />
            
            <Button onclick={() => ref3.prev()}>prev</Button>
            <Button onclick={() => ref3.next()}>next</Button>
        </Stage>
    </Demo>;
}
