// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Page, useLocale, useOptions } from '@cmfx/components';
import { useNavigate } from '@solidjs/router';
import { JSX, onMount } from 'solid-js';

import { useAdmin, useOptions as useAdminOptions } from '@admin/app';
import styles from './style.module.css';

export function Logout(): JSX.Element {
	const opt = useAdminOptions();
	const [, origin] = useOptions();
	const usr = useAdmin();
	const l = useLocale();
	const nav = useNavigate();

	onMount(async () => {
		await usr.logout();
		nav(opt.routes.public.home);
	});

	// 在网络不通时，ctx.logout 可能会非常耗时，所以此处展示一个简单的提示页面。
	return (
		<Page title="_p.current.logout" class={styles.logout}>
			{origin.loading({})}
			{l.t('_p.current.loggingOut')}
		</Page>
	);
}
