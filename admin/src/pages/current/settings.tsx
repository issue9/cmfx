// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Divider, Options, Choice, Label, FieldAccessor, RadioGroup, Page, Description } from '@/components';
import { Mode, Scheme, Theme, Contrast, UnitStyle } from '@/core';
import { useOptions, useApp } from '@/app/context';

export default function(): JSX.Element {
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

    return <Page title='_i.page.current.settings' class="max-w-sm">
        <Description icon={/*@once*/'settings_night_sight'} title={ctx.locale().t('_i.theme.mode')!}>
            {ctx.locale().t('_i.theme.modeDesc')! }
        </Description>

        <RadioGroup accessor={modeFA} block={/*@once*/false}
            options={/*@once*/[
                ['system', <Label icon={/*@once*/'brightness_6'}>{ctx.locale().t('_i.theme.system')}</Label>],
                ['dark', <Label icon={/*@once*/'dark_mode'}>{ctx.locale().t('_i.theme.dark')}</Label>],
                ['light', <Label icon={/*@once*/'brightness_6'}>{ctx.locale().t('_i.theme.light')}</Label>]
            ]}
        />

        <Divider />

        <Description icon={/*@once*/'contrast'} title={ctx.locale().t('_i.theme.contrast')!}>
            {ctx.locale().t('_i.theme.contrastDesc')! }
        </Description>

        <RadioGroup accessor={contrastFA} block={/*@once*/false}
            options={/*@once*/[
                ['more', <Label icon={/*@once*/'exposure_plus_1'}>{ctx.locale().t('_i.theme.more')}</Label>],
                ['nopreference', <Label icon={/*@once*/'exposure_zero'}>{ctx.locale().t('_i.theme.nopreference')}</Label>],
                ['less', <Label icon={/*@once*/'exposure_neg_1'}>{ctx.locale().t('_i.theme.less')}</Label>]
            ]}
        />

        <Divider />

        <Description icon={/*@once*/'palette'} title={ctx.locale().t('_i.theme.color')!}>
            {ctx.locale().t('_i.theme.colorDesc')! }
        </Description>

        <RadioGroup accessor={schemeFA} block={/*@once*/true} options={/*@once*/schemesOptions}/>

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

        <RadioGroup accessor={unitFA} block={/*@once*/false} options={/*@once*/[
            ['narrow', <Label icon={/*@once*/'format_letter_spacing_standard'}>{ctx.locale().t('_i.locale.narrow')}</Label>],
            ['short', <Label icon={/*@once*/'format_letter_spacing_wide'}>{ctx.locale().t('_i.locale.short')}</Label>],
            ['full', <Label icon={/*@once*/'format_letter_spacing_wider'}>{ctx.locale().t('_i.locale.long')}</Label>],
        ]}/>

        <div class="ml-1 pl-2 border-l-2 border-palette-bg-low">
            <p>{ ctx.locale().datetime(Date()) }</p>
            <p>{ ctx.locale().duration(1111111223245) }</p>
            <p>{ ctx.locale().bytes(1111223245) }</p>
        </div>
    </Page>;
}

function ColorBlock(props: {s: Scheme}) {
    // NOTE: 颜色的取值需与 core/theme/theme.css 中的设置相同。
    return <div class="flex flex-wrap w-10">
        <span class="w-5 h-5" style={{'background-color': `light-dark(lch(var(--invert-luminance-low) 50 ${props.s.primary}), lch(var(--luminance-low) 100 ${props.s.primary}))`}} />
        <span class="w-5 h-5" style={{'background-color': `light-dark(lch(var(--invert-luminance-low) 50 ${props.s.secondary}), lch(var(--luminance-low) 100 ${props.s.secondary}))`}} />
        <span class="w-5 h-5" style={{'background-color': `light-dark(lch(var(--invert-luminance-low) 50 ${props.s.tertiary}), lch(var(--luminance-low) 100 ${props.s.tertiary}))`}} />
        <span class="w-5 h-5" style={{'background-color': `light-dark(lch(var(--invert-luminance-low) 10 ${props.s.surface}), lch(var(--luminance-low) 100 ${props.s.surface}))`}} />
    </div>;
}
