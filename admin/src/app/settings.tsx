// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Choice, Divider, FieldAccessor, Options, RadioGroup } from '@/components';
import { changeContrast, changeMode, changeScheme, Contrast, genScheme, getContrast, getMode, getScheme, Mode } from '@/core/theme';
import { useApp } from './context';

const schemesSize = 15;

export default function() {
    const ctx = useApp();

    const modeFA = FieldAccessor<Mode>('mode', getMode('system'));
    modeFA.onChange((m) => { changeMode(m); });

    const contrastFA = FieldAccessor<Contrast>('contrast', getContrast('nopreference'));
    contrastFA.onChange((m) => { changeContrast(m); });

    const localeFA = FieldAccessor<string>('locale', ctx.locale.toString(), false);
    localeFA.onChange((v) => { ctx.locale().switch(v); });

    const schemesOptions: Options<number> = [];
    for (let i = 0; i < schemesSize; i++) {
        const color = i * 48;
        schemesOptions.push([color, <ColorBlock color={color} />]);
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
            label={ <Label icon="settings_night_sight" title={ ctx.t('_i.theme.mode')! } desc={ ctx.t('_i.theme.modeDesc')! } /> }
            options={[
                ['system', <><span class="c--icon mr-2">brightness_6</span>{ctx.t('_i.theme.system')}</>],
                ['dark', <><span class="c--icon mr-2">dark_mode</span>{ctx.t('_i.theme.dark')}</>],
                ['light', <><span class="c--icon mr-2">light_mode</span>{ctx.t('_i.theme.light')}</>]
            ]}
        />

        <Divider />

        <RadioGroup vertical accessor={contrastFA}
            label={ <Label icon="contrast" title={ ctx.t('_i.theme.contrast')! } desc={ ctx.t('_i.theme.contrastDesc')! } /> }
            options={[
                ['more', <><span class="c--icon mr-2">exposure_plus_1</span>{ctx.t('_i.theme.more')}</>],
                ['nopreference', <><span class="c--icon mr-2">exposure_zero</span>{ctx.t('_i.theme.nopreference')}</>],
                ['less', <><span class="c--icon mr-2">exposure_neg_1</span>{ctx.t('_i.theme.less')}</>]
            ]}
        />

        <Divider />

        <RadioGroup accessor={schemeFA} icon = {false} options={schemesOptions}
            label={ <Label icon="palette" title={ ctx.t('_i.theme.color')! } desc={ ctx.t('_i.theme.colorDesc')! } /> }
        />

        <Divider />

        <fieldset>
            <legend>
                <Label icon="translate" title={ ctx.t('_i.locale.locale')! } desc={ ctx.t('_i.locale.localeDesc')! } />
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

function ColorBlock(props: {color: number}) {
    const s = genScheme(props.color);

    return <div class="flex flex-wrap w-6">
        <span class="w-3 h-3" style={{'background-color': `lch(50 100 ${s.primary}`}} />
        <span class="w-3 h-3" style={{'background-color': `lch(50 100 ${s.secondary}`}} />
        <span class="w-3 h-3" style={{'background-color': `lch(50 100 ${s.tertiary}`}} />
        <span class="w-3 h-3" style={{'background-color': `lch(50 100 ${s.surface}`}} />
    </div>;
}
