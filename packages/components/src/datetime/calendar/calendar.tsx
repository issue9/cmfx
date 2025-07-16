// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, createSignal, mergeProps } from 'solid-js';
import IconPrevMonth from '~icons/material-symbols/chevron-left';
import IconNextMonth from '~icons/material-symbols/chevron-right';
import IconPrevYear from '~icons/material-symbols/keyboard-double-arrow-left';
import IconNextYear from '~icons/material-symbols/keyboard-double-arrow-right';

import { BaseProps, joinClass } from '@/base';
import { Button, ButtonGroup } from '@/button';
import { useLocale } from '@/context';
import { DateView, DateViewRef } from '@/datetime/dateview';
import { DatetimePlugin } from '@/datetime/plugin';
import { Week } from '@/datetime/utils';
import styles from './style.module.css';

/**
 * 日历 {@link Calendar} 的属性值
 */
export interface Props extends BaseProps {
    /**
     * 允许的最小日期
     */
    min?: Date;

    /**
     * 允许的最大日期
     */
    max?: Date;

    /**
     * 一周的开始，默认为 0，即周日。
     */
    weekBase?: Week;

    /**
     * 当前显示的月份
     */
    current?: Date;

    /**
     * 选中项
     */
    selected?: Date;

    /**
     * 用户改变选中项时触发的事件
     */
    onSelected?: { (val: Date, old?: Date): void; };

    /**
     * 插件列表
     *
     * NOTE: 这是一个非响应式的属性。
     */
    plugins?: Array<DatetimePlugin>;

    /**
     * 是否高亮周末的列
     */
    weekend?: boolean;

    class?: string;
    style?: JSX.HTMLAttributes<HTMLElement>['style'];
}

const presetProps: Props = {
    weekBase: 0,
} as const;

/**
 * 日历组件
 */
export default function Calendar(props: Props): JSX.Element {
    props = mergeProps(presetProps, props);

    const l = useLocale();
    const [ref, setRef] = createSignal<DateViewRef>();
    const [selected, setSelected] = createSignal<Date>();

    return <div style={props.style} class={joinClass(styles.calendar, props.class, props.palette ? `palette--${props.palette}` : undefined)}>
        <header>
            <p class={styles.title}>{ref()?.Title()}</p>
            <div>
                <ButtonGroup kind='fill'>
                    <Button title={l.t('_c.date.prevYear')} square disabled={!ref()?.canOffset(-1, 0)}
                        onClick={() => ref()?.offset(-1, 0)}><IconPrevYear /></Button>
                    <Button title={l.t('_c.date.prevMonth')} square disabled={!ref()?.canOffset(0, -1)}
                        onClick={() => ref()?.offset(0, -1)}><IconPrevMonth /></Button>
                    <Button onClick={() => ref()?.jump(new Date())}>{l.t('_c.date.today')}</Button>
                    <Button title={l.t('_c.date.followingMonth')} square disabled={!ref()?.canOffset(0, 1)}
                        onClick={() => ref()?.offset(0, 1)}><IconNextMonth /></Button>
                    <Button title={l.t('_c.date.followingYear')} square disabled={!ref()?.canOffset(1, 0)}
                        onClick={() => ref()?.offset(1, 0)}><IconNextYear /></Button>
                </ButtonGroup>
            </div>
        </header>

        <div class={styles.table}>
            <DateView ref={el => setRef(el)} initValue={props.current ?? new Date()} min={props.min} max={props.max} plugins={props.plugins}
                weekend={props.weekend} weekBase={props.weekBase} weekName='long'
                todayClass={styles.today} selectedClass={styles.selected} coveredClass={styles.covered} disabledClass={styles.disabled}
                onClick={(d, disabled) => {
                    if (disabled) return;

                    const old = selected();
                    if (old) { ref()?.unselect(old); }
                    ref()?.select(d);
                    setSelected(d);

                    if (props.onSelected) {
                        props.onSelected(d, old);
                    }
                }}
            />
        </div>
    </div>;
}
