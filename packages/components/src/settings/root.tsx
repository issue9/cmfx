// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { formatDuration } from '@cmfx/core';
import { isReducedMotion, joinClass, type ThemeProps } from '@cmfx/themes';
import type { JSX, ParentProps } from 'solid-js';
import { Show } from 'solid-js';
import IconTransitionDuration from '~icons/material-symbols/animated-images-rounded';
import IconFormat from '~icons/material-symbols/format-letter-spacing-2';
import IconNotify from '~icons/material-symbols/notifications-active-rounded';
import IconPalette from '~icons/material-symbols/palette';
import IconPosition from '~icons/material-symbols/position-bottom-left';
import IconReset from '~icons/material-symbols/reset-settings-outline-rounded';
import IconMode from '~icons/material-symbols/settings-night-sight';
import IconTranslate from '~icons/material-symbols/translate';
import IconTimezone from '~icons/mdi/timezone';
import IconFontSize from '~icons/mingcute/font-size-fill';

import type { BaseRef, RefProps } from '@components/base';
import { Button } from '@components/button';
import { useLocale, useOptions } from '@components/context';
import { Timezone } from '@components/datetime';
import { Description } from '@components/description';
import { Divider } from '@components/divider';
import { Formatter } from '@components/formatter';
import { InputNumber } from '@components/input';
import { Label } from '@components/label';
import { Choice } from '@components/menu';
import { RadioGroup } from '@components/radio';
import { SchemeSelector } from '@components/scheme';
import { Slider } from '@components/slider';
import styles from './style.module.css';

export type SettingsRef = BaseRef<HTMLDivElement>;

/**
 * 设置项的属性
 */
export interface SettingsItemProps extends ParentProps {
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
export function Item(props: SettingsItemProps): JSX.Element {
	return (
		<>
			<Show when={props.desc}>
				<Description icon={props.icon} title={props.title}>
					<div innerHTML={props.desc} />
				</Description>
			</Show>
			<Show when={!props.desc}>
				<Label icon={props.icon}>{props.title}</Label>
			</Show>

			{props.children}
		</>
	);
}

/**
 * 设置页面每个设置项之间的分隔线
 */
export function Separator(): JSX.Element {
	return <Divider padding="16px 8px" />;
}

export interface SettingsProps extends ThemeProps, ParentProps, RefProps<SettingsRef> {
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
export function Settings(props: SettingsProps) {
	const [accessor, origin] = useOptions();
	const l = useLocale();

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
				<Slider
					class={styles.range}
					format={v => `${v}px`}
					min={12}
					max={32}
					step={1}
					value={parseInt(accessor.getFontSize().slice(0, -2), 10)}
					onChange={v => accessor.setFontSize(`${v}px`)}
				/>
			</Item>

			{/***************************** mode *******************************/}
			<Separator />
			<Item icon={<IconMode />} title={l.t('_c.settings.mode')} desc={l.t('_c.settings.modeDesc')}>
				<RadioGroup
					layout="horizontal"
					value={accessor.getMode()}
					onChange={v => accessor.setMode(v ?? origin.mode)}
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
					<SchemeSelector
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
				<Slider
					disabled={isReducedMotion()}
					class={styles.range}
					format={v => `${v}ms`}
					min={100}
					max={3000}
					step={100}
					value={accessor.getTransitionDuration()}
					onChange={v => accessor.setTransitionDuration(v ?? origin.transitionDuration)}
				/>
			</Item>

			{/***************************** stays *******************************/}

			<Separator />
			<Item icon={<IconNotify />} title={l.t('_c.settings.stays')} desc={l.t('_c.settings.staysDesc')}>
				<InputNumber
					value={accessor.getStays()}
					onChange={v => accessor.setStays(v ?? origin.stays)}
					min={1000}
					max={10000}
					step={500}
					class={styles.stays}
				/>
			</Item>

			{/***************************** notifyPosition *******************************/}
			<Separator />
			<Item
				icon={<IconPosition />}
				title={l.t('_c.settings.notifyPosition')}
				desc={l.t('_c.settings.notifyPositionDesc')}
			>
				<RadioGroup
					layout="horizontal"
					class={styles.radios}
					value={accessor.getNotifyPosition()}
					onChange={v => accessor.setNotifyPosition(v ?? origin.notifyPosition)}
					options={[
						{ value: 'top', label: l.t('_c.settings.topPosition') },
						{ value: 'bottom', label: l.t('_c.settings.bottomPosition') },
					]}
				/>
			</Item>

			{/***************************** locale *******************************/}

			<Separator />
			<Item icon={/*@once*/ <IconTranslate />} title={l.t('_c.settings.locale')} desc={l.t('_c.settings.localeDesc')}>
				<Choice
					class={styles.locale}
					value={accessor.getLocale()}
					onChange={v => accessor.setLocale(v ?? origin.locale)}
					options={l.locales.map(v => ({ type: 'item', value: v[0], label: v[1] }))}
				/>
			</Item>

			{/***************************** displayStyle *******************************/}

			<Separator />
			<Item
				icon={/*@once*/ <IconFormat />}
				title={l.t('_c.settings.displayStyle')}
				desc={l.t('_c.settings.displayStyleDesc')}
			>
				<RadioGroup
					layout="horizontal"
					value={accessor.getDisplayStyle()}
					onChange={v => accessor.setDisplayStyle(v ?? origin.displayStyle)}
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
					<Timezone
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
				<Button
					kind="fill"
					palette="error"
					onclick={() => {
						accessor.reset();

						if (props.onReset) {
							props.onReset();
						}
					}}
				>
					{l.t('_c.reset')}
				</Button>
			</Item>
		</div>
	);
}
