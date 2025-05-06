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
            <Tour ref={el=>ref=el} steps={[
                { title: 'Step 1', content: 'Content for Step 1' },
                { title: 'Step 2222222', content: 'Content for Step 2' },
                { title: 'Step 3', content: 'Content for Step 3' },
            ]}></Tour>
            <Button onClick={() => ref.start()}>start</Button>
            <Button>2222</Button>
            <Button>3333</Button>
            <Button>4444</Button>
        </Stage>
        
    </Demo>;
}