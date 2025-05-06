// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Tour, TourRef } from '@cmfx/components';
import { JSX } from 'solid-js';

import { Demo, Stage } from '../base';

export default function(): JSX.Element {
    let ref: TourRef;
    return <Demo>
        <Stage title='tour'>
            <Tour ref={el=>ref=el} accentPalette='primary' steps={[
                { title: 'Step 1', content: 'Content for Step 1', icon: 'person', id: 'b1' },
                { title: 'Step 2222222', content: 'Content for Step 2', id: 'b2' },
                { title: 'Step 3', content: 'Content for Step 3', id: 'b3' },
            ]}></Tour>
            <Button id="b1" onClick={() => ref.start()}>start</Button>
            <Button id="b2">2222</Button>
            <Button id="b3">3333</Button>
            <Button id="b4">4444</Button>
        </Stage>
        
    </Demo>;
}