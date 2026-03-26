// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { default as m } from './en.lang';

const messages: typeof m = {
	_i: {
		badRequest: '错误的请求内容',
		unauthorized: '身份信息失效',
		paymentRequired: '需要支付',
		forbidden: '禁止访问',
		pageNotFound: '页面不存在',
		tooManyRequests: '太多的请求',
		internalServerError: '服务器内部错误',
		serviceUnavailable: '服务暂不可用',
		gatewayTimeout: '网关超时',
		bug: 'BUG',
		building: '建设中...',
		userLogin: '欢迎回来',
	},
};

export default messages;
