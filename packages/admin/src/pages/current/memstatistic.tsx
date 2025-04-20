// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Description } from '@cmfx/components';
import { JSX, createSignal, onMount } from 'solid-js';

import { useAdmin } from '@admin/context';

export function MemStatistic(): JSX.Element {
    const [statistic, setStatistic] = createSignal<Statistic>({
        online: 0,
        active: 0,
        all: 0,
        month: 0,
        week: 0,
        day: 0,
    });
    
    const ctx = useAdmin();
    
    onMount(async () => {
        const r = await ctx.api.get<Statistic>('/statistic/member');
        if (!r.ok) {
            await ctx.outputProblem(r.body);
            return;
        }
        setStatistic(r.body!);
    });
    
    return <div class="c--memstatistic">
        <Description class="item" icon='group' title={ctx.locale().t('_i.page.current.allMembers')}>
            <p class="text-5xl">{statistic().all}</p>
        </Description>
        <Description class="item" icon='calendar_month' title={ctx.locale().t('_i.page.current.monthMembers')}>
            <p class="text-5xl">{statistic().month}</p>
        </Description>
        <Description class="item" icon='calendar_view_week' title={ctx.locale().t('_i.page.current.weekMembers')}>
            <p class="text-5xl">{statistic().week}</p>
        </Description>
        <Description class="item" icon='calendar_today' title={ctx.locale().t('_i.page.current.dayMembers')}>
            <p class="text-5xl">{statistic().day}</p>
        </Description>
        <Description class="item" icon='person_check' title={ctx.locale().t('_i.page.current.activeMembers')}>
            <p class="text-5xl">{statistic().active}</p>
        </Description>
        <Description class="item" icon='record_voice_over' title={ctx.locale().t('_i.page.current.onlineMembers')}>
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
