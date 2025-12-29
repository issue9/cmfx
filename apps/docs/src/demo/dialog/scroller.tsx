// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Button, Dialog, DialogRef, MountProps } from '@cmfx/components';
import { Portal } from 'solid-js/web';

import { paletteSelector } from '../base';

export default function(props: MountProps) {
    const [Palette, palette] = paletteSelector('primary');

    let dlg: DialogRef;

    return <div>
        <Portal mount={props.mount}>
            <Palette />
        </Portal>

        <Button onclick={() => dlg.root().showModal()} palette={palette()}>scrollable</Button>
        <Dialog palette={palette()} movable scrollable ref={(el) => dlg = el} header="header" actions="footer" class="h-80 w-80">
            <div>
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
                长内容<br />
            </div>
        </Dialog>
    </div>;
}
