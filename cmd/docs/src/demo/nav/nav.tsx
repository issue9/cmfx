// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Nav } from '@cmfx/components';
import { For, JSX } from 'solid-js';

import { paletteSelector } from '../base';

function lines(num: number, text: string): JSX.Element {
    return <>
        <For each={Array(num).fill(text)}>
            {item => <p>{item}</p>}
        </For>
    </>;
}

export default function() {
    const [paletteS, palette] = paletteSelector('primary');
    let ref: HTMLElement;

    return <div>
        {paletteS}

        <div class="flex justify-between h-30 overflow-y-scroll">
            <article ref={el => ref = el} class="flex-1">
                <h2>1-h2</h2>
                <section>
                    <h3>1-1-h3</h3>
                    {lines(10, '1-1-h3')}
                </section>
                <section>
                    <h3>1-2-h3</h3>
                    {lines(10, '1-2-h3')}
                </section>
                <h2>2-h2</h2>
                <section>
                    <h3>2-1-h3</h3>
                    {lines(10, '2-1-h3')}
                </section>
                <section>
                    <h3>2-2-h3</h3>
                    {lines(10, '2-2-h3')}
                </section>
            </article>
            <Nav palette={palette()} target={ref!} />
        </div>
    </div>;
}
