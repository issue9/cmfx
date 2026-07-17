// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Appbar, Button, ButtonGroup, Checkbox, useLocale } from '@cmfx/components';
import { type Mode, ThemeProvider, useTheme } from '@cmfx/themes';
import { createSignal, type JSX, Match, Show, Switch } from 'solid-js';
import IconNone from '~icons/ic/round-contrast';
import IconDark from '~icons/material-symbols/dark-mode';
import IconLight from '~icons/material-symbols/light-mode';
import IconPalettes from '~icons/material-symbols/palette';
import IconComponents from '~icons/material-symbols/widget-medium-rounded';
import IconMore from '~icons/zondicons/add-outline';
import IconLess from '~icons/zondicons/minus-outline';

import type { SchemeStore } from '@docs/theme/utils';
import { Components } from './components';
import { type Contrast, Palettes } from './palettes';
import styles from './style.module.css';

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
	const t = useTheme();

	const [contrast, setContrast] = createSignal<Contrast>('none');
	const [apca, setApca] = createSignal(false);
	const [typ, setTyp] = createSignal<'components' | 'palettes'>('components');
	const [mode, setMode] = createSignal<Mode>(t.mode);

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
								<Show when={typ() === 'palettes'}>
									<Checkbox class={styles.apca} onChange={v => setApca(!!v)} label={l.t('_d.theme.apca')} />
								</Show>

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
								<Palettes s={props.s} c={contrast()} apca={apca()} />
							</Match>
						</Switch>
					</div>
				</div>
			</ThemeProvider>
		</div>
	);
}
