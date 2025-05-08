// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Mode, Scheme, Theme } from '@cmfx/core';
import { For, JSX } from 'solid-js';

import { BaseProps, palettes } from '@/base';
import { ThemeProvider } from '@/context';
import { Divider } from '@/divider';
import { FieldAccessor, FieldOptions, RadioGroup } from '@/form';
import { Label } from '@/typography';
import { createStore } from 'solid-js/store';

export interface Ref {
    export(): Scheme;

    apply(): void;
}

export interface Props extends BaseProps {
    ref?: { (el: Ref): void; };
}

export default function(props: Props): JSX.Element {
    const mf = FieldAccessor<Mode>('mode', 'dark');
    const options: FieldOptions<Mode> = [['dark', 'dark'], ['light', 'light']];
    const [scheme, setScheme] = createStore<Scheme>(Theme.genScheme(80));
    
    if (props.ref) {
        props.ref({
            export: (): Scheme => {
                // TODO
                return null;
            },
            apply: () => {
                // TODO
            },
        });
    }

    return <div class="c--scheme-builder">
        <ThemeProvider mode={mf.getValue()} scheme={scheme}>
            <RadioGroup horizontal itemHorizontal accessor={mf} label='mode' options={options} />
            <Divider padding='8px' />

            <For each={palettes}>
                {(p) => (
                    <>
                        <Label class='text-xxl' icon="palette">{p}</Label>
                        <Divider padding='8px' />
                        <div class="blocks">
                            <div class="block">
                                <span style={{ 'background': `var(--${p}-bg-low)` }}></span>
                                {`--${p}-bg-low`}
                            </div>
                            <div class="block">
                                <span style={{ 'background': `var(--${p}-fg-low)` }}></span>
                                {`--${p}-fg-low`}
                            </div>

                            <div class="block">
                                <span style={{ 'background': `var(--${p}-bg)` }}></span>
                                {`--${p}-bg`}
                            </div>

                            <div class="block">
                                <span style={{ 'background': `var(--${p}-fg)` }}></span>
                                {`--${p}-fg`}
                            </div>

                            <div class="block">
                                <span style={{ 'background': `var(--${p}-bg-high)` }}></span>
                                {`--${p}-bg-high`}
                            </div>
                            <div class="block">
                                <span style={{ 'background': `var(--${p}-fg-high)` }}></span>
                                {`--${p}-fg-high`}
                            </div>
                        </div>
                        <br />
                    </>
                )}
            </For>

            <Label class='text-xxl'>demo</Label>
            <Divider />
        </ThemeProvider>
    </div>;
}