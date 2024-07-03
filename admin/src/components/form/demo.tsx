// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { createSignal } from 'solid-js';

import { Form } from './form';
import XTextArea from './textarea/textarea';
import XTextField from './textfield/textfiled';

export default function() {
    const f = new Form({
        f1: 'f1',
        textarea: 'textarea',
    });

    const [obj, setObj] = createSignal('');

    return <div>
        <div class="w-60">
            <p>text-field</p><br />
            <XTextField f={f} color='secondary' name="f1" />
            <XTextField label='label' color='tertiary' placeholder='placeholder' f={f} name="f1" />
            <XTextField label='disabled' disabled f={f} name="f1" />
            <XTextField label='readonly' readonly f={f} name="f1" />
            <XTextField label='icon' icon='face' f={f} name="f1" />
            <XTextField label='password' type="password" icon='face' f={f} name="f1" />
            <XTextField label='number' type="number" icon='face' f={f} name="f1" />
            <XTextField label='date' type="date" icon='face' f={f} name="f1" />
            <XTextArea label='date' f={f} name="textarea" />
            <button class="button--filled" onClick={()=>setObj(JSON.stringify(f.object()))}> object </button  >
            <pre>
                {obj()}
            </pre>
        </div>
    </div>;
}
