// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Statistics } from '@cmfx/components';
import { JSX, createSignal, onMount } from 'solid-js';
import IconCalendar from '~icons/material-symbols/calendar-month';
import IconToday from '~icons/material-symbols/calendar-today';
import IconWeek from '~icons/material-symbols/calendar-view-week';
import IconGroup from '~icons/material-symbols/group';
import IconPersonChk from '~icons/material-symbols/person-check';
import IconRecord from '~icons/material-symbols/record-voice-over';

import { useAdmin, useLocale } from '@/context';

export function MemStatistic(): JSX.Element {
    const [s, setStatistic] = createSignal<Statistic>({
        online: 0,
        active: 0,
        all: 0,
        month: 0,
        week: 0,
        day: 0,
    });

    const l = useLocale();
    const [api, act] = useAdmin();

    onMount(async () => {
        const r = await api.get<Statistic>('/statistic/member');
        if (!r.ok) {
            await act.outputProblem(r.body);
            return;
        }
        setStatistic(r.body!);
    });

    return <Statistics items={[
        [l.t('_p.current.allMembers'), s().all, IconGroup],
        [l.t('_p.current.monthMembers'), s().month, IconCalendar],
        [l.t('_p.current.weekMembers'), s().week, IconWeek],
        [l.t('_p.current.dayMembers'), s().day, IconToday],
        [l.t('_p.current.activeMembers'), s().active, IconPersonChk],
        [l.t('_p.current.onlineMembers'), s().online, IconRecord],
    ]} />;
}

interface Statistic {
    online: number;
    active: number;
    all: number;
    month: number;
    week: number;
    day: number;
}
