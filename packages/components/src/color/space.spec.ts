// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import { describe, expect, test } from 'vitest';

import type { Space } from './space';
import { HSLSpace } from './space_hsl';
import { OKLCHSpace } from './space_oklch';
import { PresetSpace } from './space_preset';
import { RGBSpace } from './space_rgb';
import { TailwindVarsSpace } from './space_vars';
import { WebSafeSpace } from './space_websafe';

function testPanel(p: Space) {
	expect(p.id).toBeDefined();
	expect(p.localeID).toBeDefined();
	expect(p.panel).toBeDefined();
	expect(p.include).toBeDefined();
}

describe('Space', () => {
	const hsl = new HSLSpace(30);
	test('hsl', () => testPanel(hsl));
	test('hsl.include', () => {
		expect(hsl.include('')).toBe(false);
		expect(hsl.include('hsl(1,1,1)')).toBe(true);
		expect(hsl.include('var(--color-not-exists)')).toBe(false);
	});

	const oklch = new OKLCHSpace();
	test('oklch', () => testPanel(oklch));
	test('oklch.include', () => {
		expect(oklch.include('')).toBe(false);
		expect(oklch.include('oklch(1,1,1)')).toBe(true);
		expect(oklch.include('var(--color-not-exists)')).toBe(false);
	});

	const rgb = new RGBSpace();
	test('rgb', () => testPanel(rgb));
	test('rgb.include', () => {
		expect(rgb.include('')).toBe(false);
		expect(rgb.include('rgb(1,1,1)')).toBe(true);
		expect(rgb.include('var(--color-not-exists)')).toBe(false);
	});

	const websafe = new WebSafeSpace();
	test('websafe', () => testPanel(websafe));
	test('websafe.include', () => {
		expect(websafe.include('')).toBe(false);
		expect(websafe.include('#369')).toBe(true);
		expect(websafe.include('#341')).toBe(false);
	});

	const vars = new TailwindVarsSpace();
	test('vars', () => testPanel(vars));
	test('vars.include', () => {
		expect(vars.include('')).toBe(false);
		expect(vars.include('var(--color-red-50)')).toBe(true);
		expect(vars.include('var(--color-not-exists)')).toBe(false);
	});

	const preset = new PresetSpace('var(--color)', 'rgb(1,1,1)');
	test('preset', () => testPanel(preset));
	test('preset.include', () => {
		expect(preset.include('')).toBe(false);
		expect(preset.include('var(--color)')).toBe(true);
		expect(preset.include('rgb(1,1,1)')).toBe(true);
	});
});
