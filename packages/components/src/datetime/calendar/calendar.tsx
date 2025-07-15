// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX, createMemo, createSignal, mergeProps } from 'solid-js';
import IconChevronLeft from '~icons/material-symbols/chevron-left';
import IconChevronRight from '~icons/material-symbols/chevron-right';
import IconArrowLeft from '~icons/material-symbols/keyboard-double-arrow-left';
import IconArrowRight from '~icons/material-symbols/keyboard-double-arrow-right';

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
    let ref: DateViewRef;

    const l = useLocale();
    const [panelValue, setPanelValue] = createSignal(props.current ?? new Date());
    const [selected, setSelected] = createSignal<Date>();

    const titleFormat = createMemo(() => {
        return l.datetimeFormat({ year: 'numeric', month: '2-digit' }).format(panelValue());
    });

    return <div style={props.style} class={joinClass(styles.calendar, props.class, props.palette ? `palette--${props.palette}` : undefined)}>
        <header>
            <p class={styles.title}>{titleFormat()}</p>
            <div>
                <ButtonGroup kind='fill'>
                    <Button title={l.t('_c.date.prevYear')} square onClick={() => setPanelValue(new Date(panelValue().getFullYear() - 1, panelValue().getMonth(), 1))}><IconArrowLeft /></Button>
                    <Button title={l.t('_c.date.prevMonth')} square onClick={() => setPanelValue(new Date(panelValue().getFullYear(), panelValue().getMonth() - 1, 1))}><IconChevronLeft /></Button>
                    <Button onClick={() => setPanelValue(new Date())}>{l.t('_c.date.today')}</Button>
                    <Button title={l.t('_c.date.followingMonth')} square onClick={() => setPanelValue(new Date(panelValue().getFullYear(), panelValue().getMonth() + 1, 1))}><IconChevronRight /></Button>
                    <Button title={l.t('_c.date.followingYear')} square onClick={() => setPanelValue(new Date(panelValue().getFullYear() + 1, panelValue().getMonth(), 1))}><IconArrowRight /></Button>
                </ButtonGroup>
            </div>
        </header>

        <div class={styles.table}>
            <DateView ref={el => ref = el} value={panelValue} min={props.min} max={props.max} plugins={props.plugins}
                weekend={props.weekend} weekBase={props.weekBase} weekName='long'
                todayClass={styles.today} selectedClass={styles.selected} coveredClass={styles.covered} disabledClass={styles.disabled}
                onClick={(d, disabled) => {
                    if (disabled) return;

                    const old = selected();
                    if (old) { ref.unselect(old); }
                    ref.select(d);
                    setSelected(d);

                    if (props.onSelected) {
                        props.onSelected(d, old);
                    }
                }}
            />
        </div>
    </div>;
}
