// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Demo, paletteSelector } from '@/components/base/demo';
import Dialog, { Methods } from './dialog';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');

    let dlg: Methods;

    return <Demo settings={
        <>
            {paletteS}
        </>
    } stages={
        <>
            <button onClick={()=>dlg.showModal()} class="c--button c--button-fill">open</button>
            <Dialog palette={palette()} ref={(el)=>dlg=el}>
                <div class="p-5 bg-palette-bg border-2 border-palette-fg">
                    <h1>dialog</h1>
                    <div>line</div>
                </div>
            </Dialog>
        </>
    } />;
}
