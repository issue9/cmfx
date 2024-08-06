// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Demo, paletteSelector } from '@/components/base/demo';
import Dialog from './dialog';

export default function() {
    const [paletteS, palette] = paletteSelector('primary');

    let dlg: HTMLDialogElement;

    return <Demo settings={
        <>
            {paletteS}
        </>
    } stages={
        <>
            <div>
                <button onClick={()=>dlg.showModal()} class="c--button c--button-fill">open</button>
                <Dialog palette={palette()} ref={(el)=>dlg=el}>
                    <div class="p-5 bg-palette-bg border-2 border-palette-fg">
                        <h1>dialog</h1>
                        <div class="py-3">content</div>

                        <div class="flex">
                            <button value='submit' type="submit" class="mr-8">submit</button>
                            <button value='reset' type="reset" class="mr-8">reset</button>
                            <button value='button' type="button">button</button>
                        </div>
                    </div>
                </Dialog>
            </div>

            <div>
                <button onClick={()=>dlg.showModal()} class="c--button c--button-fill">with form</button>
                <Dialog palette={palette()} ref={(el)=>dlg=el}>
                    <form method='dialog'>
                        <div class="p-5 bg-palette-bg border-2 border-palette-fg">
                            <h1>dialog</h1>
                            <div class="py-3">content</div>

                            <div class="flex">
                                <button value='submit' type="submit" class="mr-8">submit</button>
                                <button value='reset' type="reset" class="mr-8">reset</button>
                                <button value='button' type="button">button</button>
                            </div>
                        </div>
                    </form>
                </Dialog>
            </div>
        </>
    } />;
}
