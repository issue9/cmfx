// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { DisplayStyle } from '@cmfx/core';
import { formatDuration, I18n } from '@cmfx/core';
import type { JSX, ParentProps } from 'solid-js';
import { Show } from 'solid-js';
import IconTransitionDuration from '~icons/material-symbols/animated-images-rounded';
import IconFormat from '~icons/material-symbols/format-letter-spacing-2';
import IconNotify from '~icons/material-symbols/notifications-active-rounded';
import IconPalette from '~icons/material-symbols/palette';
import IconReset from '~icons/material-symbols/reset-settings-outline-rounded';
import IconMode from '~icons/material-symbols/settings-night-sight';
import IconTranslate from '~icons/material-symbols/translate';
import IconTimezone from '~icons/mdi/timezone';
import IconFontSize from '~icons/mingcute/font-size-fill';

import type { BaseProps, BaseRef, Mode, RefProps } from '@components/base';
import { isReducedMotion, joinClass } from '@components/base';
import { Button } from '@components/button';
import { useLocale, useOptions } from '@components/context';
import { Timezone } from '@components/datetime';
import { Description } from '@components/description';
import { Divider } from '@components/divider';
import { Choice, Form, Numeric, RadioGroup, Slider } from '@components/form';
import { Formatter } from '@components/formatter';
import { Label } from '@components/label';
import { SchemeSelector } from '@components/theme';
import styles from './style.module.css';

export type Ref = BaseRef<HTMLDivElement>;

/**
 * 设置项的属性
 */
export interface ItemProps extends ParentProps {
	/**
	 * 图标
	 *
	 * @reactive
	 */
	icon: JSX.Element;

	/**
	 * 标题
	 *
	 * @reactive
	 */
	title: string;

	/**
	 * 设置内容的详细描述
	 *
	 * @reactive
	 */
	desc?: string;
}

/**
 * 设置页面每个设置项的组件
 */
export function Item(props: ItemProps): JSX.Element {
	return (
		<>
			<Show when={props.desc}>
				<Description.Root icon={props.icon} title={props.title}>
					<div innerHTML={props.desc} />
				</Description.Root>
			</Show>
			<Show when={!props.desc}>
				<Label.Root icon={props.icon}>{props.title}</Label.Root>
			</Show>

			{props.children}
		</>
	);
}

/**
 * 设置页面每个设置项之间的分隔线
 */
export function Separator(): JSX.Element {
	return <Divider.Root padding="16px 8px" />;
}

export interface Props extends BaseProps, ParentProps, RefProps<Ref> {
	/**
	 * 重置事件
	 */
	onReset?: () => void;
}

/**
 * 提供了整个项目页可设置的选项
 *
 * @remarks
 * 这是对 {@link useOptions} 中部分选项的设置。
 */
export function Root(props: Props) {
	const [accessor, origin] = useOptions();
	const l = useLocale();

	const fontSizeFA = Form.fieldAccessor<number>('fontSize', parseInt(accessor.getFontSize().slice(0, -2), 10));
	fontSizeFA.onChange(v => accessor.setFontSize(`${v}px`));

	const modeFA = Form.fieldAccessor<Mode>('mode', accessor.getMode());
	modeFA.onChange(m => accessor.setMode(m));

	const localeFA = Form.fieldAccessor<string>('locale', I18n.matchLanguage(accessor.getLocale()));
	localeFA.onChange(v => accessor.setLocale(v));

	const unitFA = Form.fieldAccessor<DisplayStyle>('unit', accessor.getDisplayStyle());
	unitFA.onChange(v => accessor.setDisplayStyle(v));

	const staysFA = Form.fieldAccessor<number>('stays', accessor.getStays());
	staysFA.onChange(v => accessor.setStays(v));

	const transitionDurationFA = Form.fieldAccessor<number>('transitionDuration', accessor.getTransitionDuration());
	transitionDurationFA.onChange(v => accessor.setTransitionDuration(v));

	return (
		<div
			class={joinClass(props.palette, styles.settings, props.class)}
			style={props.style}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: () => el,
					});
				}
			}}
		>
			{props.children}

			{/***************************** font *******************************/}

			<Item icon={<IconFontSize />} title={l.t('_c.settings.fontSize')} desc={l.t('_c.settings.fontSizeDesc')}>
				<Slider.Root class={styles.range} value={v => `${v}px`} min={12} max={32} step={1} accessor={fontSizeFA} />
			</Item>

			{/***************************** mode *******************************/}
			<Separator />
			<Item icon={<IconMode />} title={l.t('_c.settings.mode')} desc={l.t('_c.settings.modeDesc')}>
				<RadioGroup.Root
					itemLayout="horizontal"
					accessor={modeFA}
					block={/*@once*/ false}
					class={styles.radios}
					options={
						/*@once*/ [
							{ value: 'system', label: l.t('_c.settings.system') },
							{ value: 'dark', label: l.t('_c.settings.dark') },
							{ value: 'light', label: l.t('_c.settings.light') },
						]
					}
				/>
			</Item>

			{/***************************** scheme *******************************/}

			<Separator />
			<Show when={origin.schemes && accessor.getScheme()}>
				<Item icon={<IconPalette />} title={l.t('_c.settings.scheme')} desc={l.t('_c.settings.schemeDesc')}>
					<SchemeSelector.Root
						schemes={origin.schemes}
						value={accessor.getScheme()}
						onChange={val => accessor.setScheme(val)}
					/>
				</Item>
			</Show>

			{/***************************** transition duration *******************************/}

			<Separator />
			<Item
				icon={<IconTransitionDuration />}
				title={l.t('_c.settings.transitionDuration')}
				desc={l.t('_c.settings.transitionDurationDesc')}
			>
				<Slider.Root
					disabled={isReducedMotion()}
					class={styles.range}
					value={v => `${v}ms`}
					min={100}
					max={3000}
					step={100}
					accessor={transitionDurationFA}
				/>
			</Item>

			{/***************************** stays *******************************/}

			<Separator />
			<Item icon={<IconNotify />} title={l.t('_c.settings.stays')} desc={l.t('_c.settings.staysDesc')}>
				<Numeric.Root accessor={staysFA} min={1000} max={10000} step={500} class={styles.stays} />
			</Item>

			{/***************************** locale *******************************/}

			<Separator />
			<Item icon={/*@once*/ <IconTranslate />} title={l.t('_c.settings.locale')} desc={l.t('_c.settings.localeDesc')}>
				<Choice.Root accessor={localeFA} options={l.locales.map(v => ({ type: 'item', value: v[0], label: v[1] }))} />
			</Item>

			{/***************************** displayStyle *******************************/}

			<Separator />
			<Item
				icon={/*@once*/ <IconFormat />}
				title={l.t('_c.settings.displayStyle')}
				desc={l.t('_c.settings.displayStyleDesc')}
			>
				<RadioGroup.Root
					itemLayout="horizontal"
					accessor={unitFA}
					block={/*@once*/ false}
					class={styles.radios}
					options={
						/*@once*/ [
							{ value: 'narrow', label: l.t('_c.settings.narrow') },
							{ value: 'short', label: l.t('_c.settings.short') },
							{ value: 'full', label: l.t('_c.settings.long') },
						]
					}
				/>
				<div class={styles['ds-demo']}>
					<p>{l.datetimeFormat().format(new Date())}</p>
					<p>{formatDuration(l.durationFormat(), 1111111223245)}</p>
					<p>{Formatter.createBytes(l)(1111223245)}</p>
				</div>
			</Item>

			{/***************************** timezone *******************************/}

			<Separator />
			<Item
				icon={/*@once*/ <IconTimezone />}
				title={l.t('_c.settings.timezone')}
				desc={l.t('_c.settings.timezoneDesc')}
			>
				<div>
					<Timezone.Root
						value={accessor.getTimezone()}
						onChange={v => {
							accessor.setTimezone(v);
						}}
					/>
				</div>
			</Item>

			{/***************************** reset *******************************/}

			<Separator />
			<Item icon={/*@once*/ <IconReset />} title={l.t('_c.settings.resetOptions')}>
				<Button.Root
					kind="fill"
					palette="error"
					onclick={() => {
						accessor.reset();
						fontSizeFA.setValue(parseInt(accessor.getFontSize().slice(0, -2), 10));
						modeFA.setValue(accessor.getMode());
						localeFA.setValue(accessor.getLocale());
						unitFA.setValue(accessor.getDisplayStyle());
						staysFA.setValue(accessor.getStays());

						if (props.onReset) {
							props.onReset();
						}
					}}
				>
					{l.t('_c.reset')}
				</Button.Root>
			</Item>
		</div>
	);
}
