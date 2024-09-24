// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, Divider, FieldAccessor, Options, RadioGroup } from '@/components';
import { changeContrast, changeMode, changeScheme, Contrast, genScheme, getContrast, getMode, getScheme, Mode, Scheme } from '@/core/theme';
import { useApp, useOptions } from './context';

export default function() {
    const ctx = useApp();
    const opt = useOptions();

    const modeFA = FieldAccessor<Mode>('mode', getMode('system'));
    modeFA.onChange((m) => { changeMode(m); });

    const contrastFA = FieldAccessor<Contrast>('contrast', getContrast('nopreference'));
    contrastFA.onChange((m) => { changeContrast(m); });

    const localeFA = FieldAccessor<string>('locale', ctx.locale().match(opt.locales.locales), false);
    localeFA.onChange((v) => { ctx.switchLocale(v); });

    const schemesOptions: Options<number> = [];
    for (const s of opt.theme.schemes) {
        schemesOptions.push([s.primary, <ColorBlock s={s} />]);
    }

    let scheme: number;
    const s = getScheme(schemesOptions[0][0]);
    if (typeof s === 'number') {
        scheme = s;
    } else {
        scheme = s.primary;
    }
    const schemeFA = FieldAccessor<number>('scheme', scheme);
    schemeFA.onChange((c) => { changeScheme(c!); });

    return <div class="app-settings">
        <RadioGroup vertical accessor={modeFA}
            label={ <Label icon="settings_night_sight" title={ ctx.locale().t('_i.theme.mode')! } desc={ ctx.locale().t('_i.theme.modeDesc')! } /> }
            options={[
                ['system', <><span class="c--icon mr-2">brightness_6</span>{ctx.locale().t('_i.theme.system')}</>],
                ['dark', <><span class="c--icon mr-2">dark_mode</span>{ctx.locale().t('_i.theme.dark')}</>],
                ['light', <><span class="c--icon mr-2">light_mode</span>{ctx.locale().t('_i.theme.light')}</>]
            ]}
        />

        <Divider />

        <RadioGroup vertical accessor={contrastFA}
            label={ <Label icon="contrast" title={ ctx.locale().t('_i.theme.contrast')! } desc={ ctx.locale().t('_i.theme.contrastDesc')! } /> }
            options={[
                ['more', <><span class="c--icon mr-2">exposure_plus_1</span>{ctx.locale().t('_i.theme.more')}</>],
                ['nopreference', <><span class="c--icon mr-2">exposure_zero</span>{ctx.locale().t('_i.theme.nopreference')}</>],
                ['less', <><span class="c--icon mr-2">exposure_neg_1</span>{ctx.locale().t('_i.theme.less')}</>]
            ]}
        />

        <Divider />

        <RadioGroup accessor={schemeFA} icon = {false} options={schemesOptions}
            label={ <Label icon="palette" title={ ctx.locale().t('_i.theme.color')! } desc={ ctx.locale().t('_i.theme.colorDesc')! } /> }
        />

        <Divider />

        <fieldset>
            <legend>
                <Label icon="translate" title={ ctx.locale().t('_i.locale.locale')! } desc={ ctx.locale().t('_i.locale.localeDesc')! } />
            </legend>
            <Choice accessor={localeFA} options={ctx.locale().locales} />
        </fieldset>
    </div>;
}

function Label(props: {icon: string, title: string, desc: string}) {
    return <div class="flex flex-col mb-1">
        <p class="c--icon-container"><span class="c--icon mr-2">{ props.icon }</span>{props.title}</p>
        <span class="text-sm text-left">{props.desc}</span>
    </div>;
}

function ColorBlock(props: {s: Scheme}) {
    return <div class="flex flex-wrap w-6">
        <span class="w-3 h-3" style={{'background-color': `lch(50 100 ${props.s.primary}`}} />
        <span class="w-3 h-3" style={{'background-color': `lch(50 100 ${props.s.secondary}`}} />
        <span class="w-3 h-3" style={{'background-color': `lch(50 100 ${props.s.tertiary}`}} />
        <span class="w-3 h-3" style={{'background-color': `lch(50 100 ${props.s.surface}`}} />
    </div>;
}
