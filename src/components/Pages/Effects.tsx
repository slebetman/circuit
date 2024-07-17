import { compile } from 'lib/compiler';
import { EditorContextType } from 'lib/editorContext';
import { FC, useEffect } from 'react';
import * as handlers from './Handlers';
import { setChartRef } from 'lib/chartRefs';

type EffectsProps = {
	ctx: EditorContextType;
	fileName?: string;
};

export const Effects: FC<EffectsProps> = ({ ctx, fileName }) => {
	useEffect(() => {
		if (ctx.instance && ctx.codeOpen) {
			const n = ctx.instance.getNodes();
			const e = ctx.instance.getEdges();

			ctx.setCode(
				compile({
					nodes: n,
					edges: e,
				}).map((x) => x.replace(/this\["(.+?)"\]/g, '$1')),
			);
		}
	}, [ctx.codeOpen, ctx.nodes, ctx.edges]);

	useEffect(() => {
		if (ctx.chart.chart) {
			// HACK: Not sure why but need some delay to set nodes
			ctx.setNodes?.([]);
			ctx.setEdges?.([]);
			ctx.setModules?.([]);
			setTimeout(() => {
				ctx.setNodes?.(ctx.chart.chart?.nodes || []);
				ctx.setEdges?.(ctx.chart.chart?.edges || []);
				ctx.setModules?.(ctx.chart.chart?.modules || []);
				setTimeout(() => {
					ctx.instance?.fitView({
						padding: 0.25,
					});
				}, 50);
			}, 0);
		}
	}, [ctx.chart.chart]);

	useEffect(() => {
		const name = ctx.mod.name;
		handlers.loadModule(name, ctx.mod.chart);
	}, [ctx.mod.chart]);

	useEffect(() => {
		if (fileName) {
			ctx.chart.load(fileName);
		}
	}, [fileName]);

	useEffect(() => {
		setChartRef({
			nodes: ctx.nodes || [],
			edges: ctx.edges || [],
			modules: ctx.modules,
		});
	}, [ctx.nodes, ctx.edges, ctx.modules]);

	useEffect(() => {
		if (ctx.chart.error) {
			ctx.setError(ctx.chart.error.message);
		}
		if (ctx.mod.error) {
			ctx.setError(ctx.mod.error.message);
		}
	}, [ctx.chart.error, ctx.mod.error]);

	return <></>;
};
