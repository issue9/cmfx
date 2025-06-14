// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { Description } from '@cmfx/components';
import { JSX, createSignal, onMount } from 'solid-js';
import IconCalendar from '~icons/material-symbols/calendar-month';
import IconToday from '~icons/material-symbols/calendar-today';
import IconWeek from '~icons/material-symbols/calendar-view-week';
import IconGroup from '~icons/material-symbols/group';
import IconPersonChk from '~icons/material-symbols/person-check';
import IconRecord from '~icons/material-symbols/record-voice-over';

import { use, useLocale } from '@/context';
import styles from './style.module.css';

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

    return <div class={styles.memstatistic}>
        <Description class={styles.item} icon={IconGroup} title={l.t('_p.current.allMembers')}>
            <p class="text-5xl">{statistic().all}</p>
        </Description>
        <Description class={styles.item} icon={IconCalendar} title={l.t('_p.current.monthMembers')}>
            <p class="text-5xl">{statistic().month}</p>
        </Description>
        <Description class={styles.item} icon={IconWeek} title={l.t('_p.current.weekMembers')}>
            <p class="text-5xl">{statistic().week}</p>
        </Description>
        <Description class={styles.item} icon={IconToday} title={l.t('_p.current.dayMembers')}>
            <p class="text-5xl">{statistic().day}</p>
        </Description>
        <Description class={styles.item} icon={IconPersonChk} title={l.t('_p.current.activeMembers')}>
            <p class="text-5xl">{statistic().active}</p>
        </Description>
        <Description class={styles.item} icon={IconRecord} title={l.t('_p.current.onlineMembers')}>
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
