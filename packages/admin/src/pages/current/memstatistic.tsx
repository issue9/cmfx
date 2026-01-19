// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Statistic as XS, useLocale } from '@cmfx/components';
import { JSX, createSignal, onMount } from 'solid-js';
import IconCalendar from '~icons/material-symbols/calendar-month';
import IconToday from '~icons/material-symbols/calendar-today';
import IconWeek from '~icons/material-symbols/calendar-view-week';
import IconGroup from '~icons/material-symbols/group';
import IconPersonChk from '~icons/material-symbols/person-check';
import IconRecord from '~icons/material-symbols/record-voice-over';

import { handleProblem, useREST } from '@admin/app';
import styles from './style.module.css';

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
    const api = useREST();

    onMount(async () => {
        const r = await api.get<Statistic>('/statistic/member');
        if (!r.ok) {
            await handleProblem(r.body);
            return;
        }
        setStatistic(r.body!);
    });

    return <div class={styles.memstatistic}>
        <XS class={styles.item} label={l.t('_p.current.allMembers')} icon={<IconGroup />} value={s().all} />
        <XS class={styles.item} label={l.t('_p.current.monthMembers')} icon={<IconCalendar />} value={s().month} />
        <XS class={styles.item} label={l.t('_p.current.weekMembers')} icon={<IconWeek />} value={s().week} />
        <XS class={styles.item} label={l.t('_p.current.dayMembers')} icon={<IconToday />} value={s().day} />
        <XS class={styles.item} label={l.t('_p.current.activeMembers')} icon={<IconPersonChk />} value={s().active} />
        <XS class={styles.item} label={l.t('_p.current.onlineMembers')} icon={<IconRecord />} value={s().online} />
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
