// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Contrast, Mode, Scheme, Theme, UnitStyle } from '@cmfx/core';
import { JSX } from 'solid-js';

import { Choice, Description, Divider, FieldAccessor, Options, Page, RadioGroup, useApp, useOptions } from '@admin/components';

export function Settings(): JSX.Element {
    const ctx = useApp();
    const opt = useOptions();

    const modeFA = FieldAccessor<Mode>('mode', Theme.mode());
    modeFA.onChange((m) => { Theme.setMode(m); });

    const contrastFA = FieldAccessor<Contrast>('contrast', Theme.contrast());
    contrastFA.onChange((m) => { Theme.setContrast(m); });

    const schemesOptions: Options<number> = [];
    for (const s of opt.theme.schemes) {
        schemesOptions.push([s.primary, <ColorBlock s={s} />]);
    }
    const schemeFA = FieldAccessor<number>('scheme', Theme.scheme().primary);
    schemeFA.onChange((c) => {
        Theme.setScheme(opt.theme.schemes.find((s)=>s.primary===c)!);
    });

    const localeFA = FieldAccessor<string>('locale', ctx.locale().match(opt.locales.locales), false);
    localeFA.onChange((v) => { ctx.switchLocale(v); });

    const unitFA = FieldAccessor<UnitStyle>('unit', ctx.locale().unitStyle);
    unitFA.onChange((v) => { ctx.switchUnitStyle(v); });

    return <Page title='_i.page.current.settings' class="max-w-sm p--settings">
        <Description icon={/*@once*/'settings_night_sight'} title={ctx.locale().t('_i.theme.mode')!}>
            {ctx.locale().t('_i.theme.modeDesc')! }
        </Description>

        <RadioGroup itemHorizontal accessor={modeFA} block={/*@once*/false}
            options={/*@once*/[
                ['system', ctx.locale().t('_i.theme.system')],
                ['dark', ctx.locale().t('_i.theme.dark')],
                ['light', ctx.locale().t('_i.theme.light')]
            ]}
        />

        <Divider />

        <Description icon={/*@once*/'contrast'} title={ctx.locale().t('_i.theme.contrast')!}>
            {ctx.locale().t('_i.theme.contrastDesc')! }
        </Description>

        <RadioGroup itemHorizontal accessor={contrastFA} block={/*@once*/false}
            options={/*@once*/[
                ['more', ctx.locale().t('_i.theme.more')],
                ['nopreference', ctx.locale().t('_i.theme.nopreference')],
                ['less', ctx.locale().t('_i.theme.less')]
            ]}
        />

        <Divider />

        <Description icon={/*@once*/'palette'} title={ctx.locale().t('_i.theme.color')!}>
            {ctx.locale().t('_i.theme.colorDesc')! }
        </Description>

        <RadioGroup itemHorizontal accessor={schemeFA} block={/*@once*/true} options={/*@once*/schemesOptions}/>

        <Divider />

        <Description icon={/*@once*/'translate'} title={ctx.locale().t('_i.locale.locale')!}>
            {ctx.locale().t('_i.locale.localeDesc')! }
        </Description>

        <div class="w-60">
            <Choice accessor={localeFA} options={ctx.locale().locales} />
        </div>

        <Divider />

        <Description icon={/*@once*/'format_letter_spacing_2'} title={ctx.locale().t('_i.locale.unitStyle')!}>
            {ctx.locale().t('_i.locale.unitStyleDesc')! }
        </Description>

        <RadioGroup itemHorizontal accessor={unitFA} block={/*@once*/false} options={/*@once*/[
            ['narrow', ctx.locale().t('_i.locale.narrow')],
            ['short', ctx.locale().t('_i.locale.short')],
            ['full', ctx.locale().t('_i.locale.long')],
        ]}/>

        <div class="ml-1 pl-2 border-l-2 border-palette-bg-low">
            <p>{ ctx.locale().datetime(Date()) }</p>
            <p>{ ctx.locale().duration(1111111223245) }</p>
            <p>{ ctx.locale().bytes(1111223245) }</p>
        </div>
    </Page>;
}

function ColorBlock(props: {s: Scheme}): JSX.Element {
    // NOTE: 颜色的取值需与 core/theme/theme.css 中的设置相同。
    return <div class="color-block">
        <span style={{'background-color': `light-dark(oklch(var(--invert-l-low) .2 ${props.s.primary}), oklch(var(--l-low) .4 ${props.s.primary}))`}} />
        <span style={{'background-color': `light-dark(oklch(var(--invert-l-low) .2 ${props.s.secondary}), oklch(var(--l-low) .4 ${props.s.secondary}))`}} />
        <span style={{'background-color': `light-dark(oklch(var(--invert-l-low) .2 ${props.s.tertiary}), oklch(var(--l-low) .4 ${props.s.tertiary}))`}} />
        <span style={{'background-color': `light-dark(oklch(var(--invert-l-low) .1 ${props.s.surface}), oklch(var(--l-low) .3 ${props.s.surface}))`}} />
    </div>;
}
