// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog, DialogRef } from '@cmfx/components';

import { paletteSelector } from '../base';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    let dlg: DialogRef;

    return <div>
        {paletteS}

        <div>
            <Dialog class="min-w-5" movable palette={palette()} ref={el => dlg = el} header="header" actions={
                <>
                    <button value='submit' type="submit" class="me-8">submit</button>
                    <button value='reset' type="reset" class="me-8">reset</button>
                    <button value='button' type="button" onClick={() => dlg.element().close('close')}>close</button>
                </>
            }>
                content
            </Dialog>
            <Button onclick={() => dlg.element().show()} palette={palette()}>show</Button>
        </div>
    </div>;
}
