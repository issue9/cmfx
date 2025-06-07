// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { For, JSX, ParentProps, Show } from 'solid-js';
import IconPalette from '~icons/material-symbols/palette';
import IconExport from '~icons/tabler/table-export';

import { BaseProps, Contrast, Mode, Palette, Scheme, applyTheme, genScheme, palettes } from '@/base';
import { Button } from '@/button';
import { ThemeProvider, useLocale } from '@/context';
import { Dialog, DialogRef } from '@/dialog';
import { Divider } from '@/divider';
import { Accessor, FieldAccessor, FieldOptions, ObjectAccessor, RadioGroup, Range, translateEnums2Options } from '@/form';
import { MessagesKey } from '@/messages';
import { Label } from '@/typography';

export interface Ref {
    /**
     * 导出 Scheme 对象
     */
    export(): Scheme;

    /**
     * 重置对象
     */
    reset(): void;

    /**
     * 将当前主题应用到全局
     */
    apply(): void;
}

export interface Props extends BaseProps, ParentProps {
    ref?: { (el: Ref): void; };

    /**
     * 是否提供导出等操作按钮
     */
    actions?: boolean;
}

/**
 * 主题编辑组件
 */
export default function SchemeBuilder(props: Props): JSX.Element {
    const l = useLocale();
    const modeFA = FieldAccessor<Mode>('mode', 'dark');
    const schemeFA = new ObjectAccessor<Scheme>(genScheme(80));
    const contrastFA = FieldAccessor<Contrast>('contrast', 'nopreference');
    const modes: FieldOptions<Mode> = translateEnums2Options<Mode, MessagesKey>([
        ['dark', '_c.theme.dark'], ['light', '_c.theme.light']
    ], l);
    const contrasts: FieldOptions<Contrast> = translateEnums2Options<Contrast, MessagesKey>([
        ['nopreference', '_c.theme.nopreference'], ['more', '_c.theme.more'], ['less', '_c.theme.less']
    ], l);

    let dlg: DialogRef;

    const ref: Ref = {
        export: (): Scheme => {
            return schemeFA.object();
        },
        reset: () => {
            modeFA.reset();
            contrastFA.reset();
            schemeFA.reset();
        },
        apply: () => {
            applyTheme(document.documentElement, { scheme: schemeFA.object(), mode: modeFA.getValue(), contrast: contrastFA.getValue() });
        },
    };

    if (props.ref) {
        props.ref(ref);
    }

    return <ThemeProvider mode={modeFA.getValue()} contrast={contrastFA.getValue()} scheme={schemeFA.object()}>
        <div class="c--scheme-builder">
            <div class="content">
                <div class="toolbar">
                    <RadioGroup layout='horizontal' itemLayout='horizontal' accessor={modeFA} label={l.t('_c.theme.mode')} options={modes} />
                    <RadioGroup layout='horizontal' itemLayout='horizontal' accessor={contrastFA} label={l.t('_c.theme.contrast')} options={contrasts} />
                    <Show when={props.actions}>
                        <div class="last">
                            <Button palette='secondary' onClick={() => ref.reset()}>{l.t('_c.reset') }</Button>
                            <Button palette='primary' onClick={() => ref.apply()}>{ l.t('_c.theme.apply') }</Button>
                            <Button palette='primary' onClick={()=>dlg.showModal()}>{ l.t('_c.theme.export') }</Button>
                        </div>
                    </Show>
                    <Divider padding='8px' />
                </div>

                <For each={palettes}>
                    {(p) => { return paletteBlock(p, schemeFA.accessor(p)); }}
                </For>
            </div>

            {props.children}
        </div>
        <Dialog ref={el => dlg = el} header={<Label icon={IconExport}>{ l.t('_c.theme.export') }</Label>}>
            <pre>
                {JSON.stringify(schemeFA.object(), null, 4)}
            </pre>
        </Dialog>
    </ThemeProvider>;
}

function paletteBlock(p: Palette, a: Accessor<number>): JSX.Element {
    return <div>
        <Label class='text-xxl mt-4' icon={IconPalette}>{
            <>
                {p}
                <Range class='mx-2' min={0} max={360} accessor={a} />
                <span>{a.getValue()}</span>
            </>
        }</Label>
        <Divider padding='8px' />
        <div class="blocks">
            <div class="block">
                <span style={{ 'background': `var(--${p}-bg-low)` }}></span>
                {'--bg-low'}
            </div>
            <div class="block">
                <span style={{ 'background': `var(--${p}-bg)` }}></span>
                {'--bg'}
            </div>
            <div class="block">
                <span style={{ 'background': `var(--${p}-bg-high)` }}></span>
                {'--bg-high'}
            </div>

            <div class="block">
                <span style={{ 'background': `var(--${p}-fg-low)` }}></span>
                {'--fg-low'}
            </div>
            <div class="block">
                <span style={{ 'background': `var(--${p}-fg)` }}></span>
                {'--fg'}
            </div>
            <div class="block">
                <span style={{ 'background': `var(--${p}-fg-high)` }}></span>
                {'--fg-high'}
            </div>
        </div>
    </div>;
}