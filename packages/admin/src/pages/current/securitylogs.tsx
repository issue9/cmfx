// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { DataTable, InputText, Page, useLocale } from '@cmfx/components';
import type { Query } from '@cmfx/core';
import Bowser from 'bowser';
import type { JSX } from 'solid-js';

import { useREST } from '@admin/app';

type SecurityLog = {
	content: string;
	ip: string;
	ua: string;
	created: string;
};

interface Q extends Query {
	text: string;
	//'created.start'?: string;
	//'created.end'?: string;
}

class QuerySearchConverter implements DataTable.SearchConverter<Q> {
	to(params: DataTable.SearchParams<Q>): Q {
		return {
			page: params.page ? parseInt(params.page, 10) : undefined,
			size: params.size ? parseInt(params.size, 10) : undefined,
			text: params.text || '',
		};
	}

	from(query: Q): DataTable.SearchParams<Q> {
		return {
			page: query.page?.toString() || '1',
			size: query.size?.toString() || '20',
			text: query.text,
		};
	}
}

export function SecurityLogs(): JSX.Element {
	const l = useLocale();
	const [rest] = useREST();

	const [load] = DataTable.buildREST<SecurityLog, Q>(rest, '/securitylog');

	return (
		<Page title="_p.current.securitylog">
			<DataTable<SecurityLog, Q>
				load={load}
				paging
				inSearch={new QuerySearchConverter()}
				systemToolbar
				columns={[
					{ id: 'content', label: l.t('_p.current.content') },
					{ id: 'ip', label: l.t('_p.current.ip') },
					{
						id: 'ua',
						label: l.t('_p.current.ua'),
						content: (_, val) => {
							if (!val) {
								return '';
							}
							const info = Bowser.parse(val);
							return l.t('_p.current.uaInfo', {
								browser: info.browser.name,
								browserVersion: info.browser.version,
								os: info.os.name,
								osVersion: info.os.version,
								kernel: info.engine.name,
								kernelVersion: info.engine.version,
							});
						},
					},
					{
						id: 'created',
						label: l.t('_p.created'),
						content: (_, val) => {
							return l.datetimeFormat().format(new Date(val!));
						},
					},
				]}
				queryForm={(_, Field) => (
					<>
						<Field name="text">
							<InputText />
						</Field>
					</>
				)}
			/>
		</Page>
	);
}
