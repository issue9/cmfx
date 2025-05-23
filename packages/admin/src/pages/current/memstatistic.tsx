// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Description } from '@cmfx/components';
import { JSX, createSignal, onMount } from 'solid-js';

import { use, useLocale } from '@/context';

export function MemStatistic(): JSX.Element {
    const [statistic, setStatistic] = createSignal<Statistic>({
        online: 0,
        active: 0,
        all: 0,
        month: 0,
        week: 0,
        day: 0,
    });

    const l = useLocale();
    const [api, act] = use();
    
    onMount(async () => {
        const r = await api.get<Statistic>('/statistic/member');
        if (!r.ok) {
            await act.outputProblem(r.body);
            return;
        }
        setStatistic(r.body!);
    });
    
    return <div class="c--memstatistic">
        <Description class="item" icon='group' title={l.t('_i.current.allMembers')}>
            <p class="text-5xl">{statistic().all}</p>
        </Description>
        <Description class="item" icon='calendar_month' title={l.t('_i.current.monthMembers')}>
            <p class="text-5xl">{statistic().month}</p>
        </Description>
        <Description class="item" icon='calendar_view_week' title={l.t('_i.current.weekMembers')}>
            <p class="text-5xl">{statistic().week}</p>
        </Description>
        <Description class="item" icon='calendar_today' title={l.t('_i.current.dayMembers')}>
            <p class="text-5xl">{statistic().day}</p>
        </Description>
        <Description class="item" icon='person_check' title={l.t('_i.current.activeMembers')}>
            <p class="text-5xl">{statistic().active}</p>
        </Description>
        <Description class="item" icon='record_voice_over' title={l.t('_i.current.onlineMembers')}>
            <p class="text-5xl">{statistic().online}</p>
        </Description>
    </div>;
}

interface Statistic {
    online: number;
    active: number;
    all: number;
    month: number;
    week: number;
    day: number;
}
