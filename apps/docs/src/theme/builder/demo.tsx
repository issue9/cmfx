// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import {
	Appbar,
	Button,
	ButtonGroup,
	Card,
	Color,
	DataTable,
	DatePicker,
	Form,
	InputPassword,
	InputText,
	Menu,
	useLocale,
} from '@cmfx/components';
import { joinClass, type Mode, type Palette, palettes, ThemeProvider } from '@cmfx/themes';
import { createEffect, createSignal, For, type JSX, Match, Switch } from 'solid-js';
import IconNone from '~icons/ic/round-contrast';
import IconDark from '~icons/material-symbols/dark-mode';
import IconLight from '~icons/material-symbols/light-mode';
import IconPalettes from '~icons/material-symbols/palette';
import IconComponents from '~icons/material-symbols/widget-medium-rounded';
import IconMore from '~icons/zondicons/add-outline';
import IconLess from '~icons/zondicons/minus-outline';

import styles from './style.module.css';
import type { SchemeStore } from './utils';

type Contrast = 'more' | 'less' | 'none';

// 参考 tailwind.css 中的设置
const contrasts: ReadonlyMap<Contrast, Record<string, string>> = new Map([
	['more', { '--contrast': '100%', '--opacity': '.7' }],
	['less', { '--contrast': '80%', '--opacity': '.3' }],
	['none', { '--contrast': '90%', '--opacity': '.5' }],
]);

/**
 * 组件演示
 */
export function Demo(props: { s: SchemeStore }): JSX.Element {
	const l = useLocale();

	const [contrast, setContrast] = createSignal<Contrast>('none');
	const [typ, setTyp] = createSignal<'components' | 'palettes'>('components');
	const [mode, setMode] = createSignal<Mode>('light');

	// NOTE: 此处的 ThemeProvider 必须包含在 div 中，否则当处于 Transition 元素中时，
	// 快速多次地调整 ThemeProvider 参数可能会导致元素消失失败，main 中同时出现在多个元素。
	return (
		<div class={styles.main}>
			<ThemeProvider mode={mode()} scheme={props.s[0]}>
				<div class={styles.demo} style={{ ...contrasts.get(contrast()) }}>
					<Appbar
						title={typ() === 'components' ? l.t('_d.theme.components') : l.t('_d.theme.palettes')}
						class={styles.appbar}
						actions={
							<>
								<ButtonGroup>
									<Button
										square
										checked={typ() === 'components'}
										title={l.t('_d.theme.components')}
										onclick={() => setTyp('components')}
									>
										<IconComponents />
									</Button>

									<Button
										square
										checked={typ() === 'palettes'}
										title={l.t('_d.theme.palettes')}
										onclick={() => setTyp('palettes')}
									>
										<IconPalettes />
									</Button>
								</ButtonGroup>

								<ButtonGroup>
									<Button
										square
										title={l.t('_d.theme.light')}
										checked={mode() === 'light'}
										onclick={() => setMode('light')}
									>
										<IconLight />
									</Button>
									<Button
										square
										title={l.t('_d.theme.dark')}
										checked={mode() === 'dark'}
										onclick={() => setMode('dark')}
									>
										<IconDark />
									</Button>
								</ButtonGroup>

								<ButtonGroup>
									<Button
										checked={contrast() === 'more'}
										square
										title={l.t('_d.theme.contrastMore')}
										onclick={() => setContrast('more')}
									>
										<IconMore />
									</Button>

									<Button
										checked={contrast() === 'none'}
										square
										title={l.t('_d.theme.contrastNone')}
										onclick={() => setContrast('none')}
									>
										<IconNone />
									</Button>

									<Button
										checked={contrast() === 'less'}
										square
										title={l.t('_d.theme.contrastLess')}
										onclick={() => setContrast('less')}
									>
										<IconLess />
									</Button>
								</ButtonGroup>
							</>
						}
					/>
					<div class={styles.content}>
						<Switch>
							<Match when={typ() === 'components'}>
								<Components />
							</Match>
							<Match when={typ() === 'palettes'}>
								<Palettes s={props.s} c={contrast()} />
							</Match>
						</Switch>
					</div>
				</div>
			</ThemeProvider>
		</div>
	);
}

function Palettes(props: { s: SchemeStore; c: Contrast }): JSX.Element {
	return (
		<div class={styles.palettes}>
			<For each={palettes}>{p => <PaletteBlocks p={p} s={props.s} c={props.c} />}</For>
		</div>
	);
}

function PaletteBlocks(props: { p: Palette; s: SchemeStore; c: Contrast }): JSX.Element {
	const raw = props.s[0];

	let baseRef: HTMLDivElement;
	let lowRef: HTMLDivElement;
	let highRef: HTMLDivElement;
	let disabledRef: HTMLDivElement;
	let focusedRef: HTMLDivElement;
	let activedRef: HTMLDivElement;
	let selectedRef: HTMLDivElement;
	const [baseWCAG, setBaseWCAG] = createSignal('');
	const [lowWCAG, setLowWCAG] = createSignal('');
	const [highWCAG, setHighWCAG] = createSignal('');
	const [disabledWCAG, setDisabledWCAG] = createSignal('');
	const [focusedWCAG, setFocusedWCAG] = createSignal('');
	const [activedWCAG, setActivedWCAG] = createSignal('');
	const [selectedWCAG, setSelectedWCAG] = createSignal('');

	createEffect(() => {
		void raw[props.p];
		void props.c;

		const baseS = window.getComputedStyle(baseRef);
		setBaseWCAG(Color.wcag(baseS.getPropertyValue('background-color'), baseS.getPropertyValue('color')));

		const lowS = window.getComputedStyle(lowRef);
		setLowWCAG(Color.wcag(lowS.getPropertyValue('background-color'), lowS.getPropertyValue('color')));

		const highS = window.getComputedStyle(highRef);
		setHighWCAG(Color.wcag(highS.getPropertyValue('background-color'), highS.getPropertyValue('color')));

		const disabledS = window.getComputedStyle(disabledRef);
		setDisabledWCAG(Color.wcag(disabledS.getPropertyValue('background-color'), disabledS.getPropertyValue('color')));

		const focusedS = window.getComputedStyle(focusedRef);
		setFocusedWCAG(Color.wcag(focusedS.getPropertyValue('background-color'), focusedS.getPropertyValue('color')));

		const activedS = window.getComputedStyle(activedRef);
		setActivedWCAG(Color.wcag(activedS.getPropertyValue('background-color'), activedS.getPropertyValue('color')));

		const selectedS = window.getComputedStyle(selectedRef);
		setSelectedWCAG(Color.wcag(selectedS.getPropertyValue('background-color'), selectedS.getPropertyValue('color')));
	});

	return (
		<div class={styles.palette}>
			<p class={styles.name}>{props.p}</p>
			<div ref={el => (baseRef = el)} class={joinClass(undefined, styles.color, styles[props.p])}>
				base:{baseWCAG()}
			</div>
			<div ref={el => (lowRef = el)} class={joinClass(undefined, styles.color, styles[`${props.p}-low`])}>
				low:{lowWCAG()}
			</div>
			<div ref={el => (highRef = el)} class={joinClass(undefined, styles.color, styles[`${props.p}-high`])}>
				high:{highWCAG()}
			</div>
			<div class={styles.exts}>
				<div
					ref={el => (disabledRef = el)}
					class={joinClass(undefined, styles.color, styles.ext, styles[`${props.p}-disabled`])}
				>
					disabled:{disabledWCAG()}
				</div>
				<div
					ref={el => (focusedRef = el)}
					class={joinClass(undefined, styles.color, styles.ext, styles[`${props.p}-focused`])}
				>
					focused:{focusedWCAG()}
				</div>
				<div
					ref={el => (activedRef = el)}
					class={joinClass(undefined, styles.color, styles.ext, styles[`${props.p}-actived`])}
				>
					actived:{activedWCAG()}
				</div>
				<div
					ref={el => (selectedRef = el)}
					class={joinClass(undefined, styles.color, styles.ext, styles[`${props.p}-selected`])}
				>
					selected:{selectedWCAG()}
				</div>
			</div>
		</div>
	);
}

interface Item {
	id: number;
	name: string;
	address: string;
}

function Components(): JSX.Element {
	const items = (): Promise<Array<Item>> => {
		return Promise.resolve([
			{ id: 1, name: 'name1', address: 'address1' },
			{
				id: 3,
				name: 'name3',
				address: '这是一行很长的数据，这是一行很长的数据，这是一行很长的数据，这是一行很长的数据。',
			},
			{ id: 2, name: 'name2', address: 'address2' },
		]);
	};

	const columns: Array<DataTable.Column<Item>> = [
		{ id: 'id', label: 'id' },
		{ id: 'name', label: 'name' },
		{ id: 'address', label: 'address' },
		{
			label: 'action',
			renderLabel: 'ACTIONS',
			isUnexported: true,
			renderContent: () => {
				return <button type="button">...</button>;
			},
		},
	];

	const [F, Field] = Form.create({
		initValue: {
			username: '',
			password: '',
		},
	});

	return (
		<div class={styles.components}>
			<DataTable class="w-full! transition-all" load={items} columns={columns} />

			<DatePicker class="transition-all" value={new Date()} />

			<Card
				class="transition-all"
				header="注册用户"
				footerClass="flex justify-between"
				footer={
					<>
						<Button palette="primary">重置</Button>
						<Button palette="primary">注册</Button>
					</>
				}
			>
				<F layout="vertical">
					<Field name="username" label="用户名">
						<InputText placeholder="请输入用户名" />
					</Field>
					<Field name="password" label="密码">
						<InputPassword placeholder="请输入密码" />
					</Field>
				</F>
			</Card>

			<Menu
				class="min-w-50 rounded-md border border-palette-fg-low transition-all"
				layout="inline"
				items={[
					{ type: 'item', label: 'Item 1', value: '1' },
					{ type: 'item', label: 'Item 2', value: '2' },
					{ type: 'item', label: 'Item 3', value: '3' },
					{
						type: 'group',
						label: 'group',
						items: [
							{ type: 'item', label: 'Item 1', value: '41' },
							{ type: 'item', label: 'Item 2', value: '42' },
						],
					},
				]}
			/>
		</div>
	);
}
