// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Form } from './form';
import XTextArea from './textarea/textarea';
import XTextField from './textfield/textfiled';

export default function() {
    const f = new Form({
        f1: 'f1'
    });

    return <div>
        <p>text-field</p><br />
        <XTextField f={f} color='secondary' name="f1" />
        <XTextField label='label' color='tertiary' placeholder='placeholder' f={f} name="f1" />
        <XTextField label='disabled' disabled f={f} name="f1" />
        <XTextField label='readonly' readonly f={f} name="f1" />
        <XTextField label='icon' icon='face' f={f} name="f1" />

        <XTextArea label='textarea' f={f} name="f1" />
    </div>
}
