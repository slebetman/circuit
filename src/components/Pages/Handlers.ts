import { getEditorContext } from 'lib/editorContext';
import generateId from 'lib/generateId';
import varName from 'lib/normaliseVarName';
import { SimState, simulator } from 'lib/simulator';
import { SetStateAction } from 'react';
import { Node } from 'reactflow';

type Setter<t> = (v: SetStateAction<t>) => void;

const ctx = getEditorContext();

export const handleNew = () => {
	stopSim();
	ctx.setNodes?.([]);
	ctx.setEdges?.([]);
	ctx.setModules?.([]);
	ctx.router?.replace('/');
};

export const handleSaveDialog = () => {
	ctx.setMode?.('save');
};

export const handleSave = async (name: string) => {
	if (name) {
		await ctx.chart?.save(name, {
			nodes: ctx.nodes,
			edges: ctx.edges,
			modules: ctx.modules,
		});
		ctx.router?.replace(`/${name}`);
	}

	ctx.setMode?.('chart');
};

export const handleOpenFolder = () => {
	ctx.setMode?.('open');
};

export const handleSelectFile =
	(fileName: string | undefined) => (f: string) => {
		stopSim();
		ctx.setMode?.('chart');
		if (f === fileName) {
			ctx.chart?.load(fileName);
		} else {
			ctx.router?.replace(`/${f}`);
		}
	};

export const handleCompile = (setCodeOpen: Setter<any>) => () => {
	setCodeOpen(true);
};

export const handleSim = (active: boolean) => {
	if (active) {
		startSim();
	} else {
		stopSim();
	}
};

export const handleCreateNode = (actionType: string) => {
	const [type, moduleLabel, moduleType] = actionType.split(':');

	const setter = ctx.mode === 'module' ? ctx.setModuleNodes : ctx.setNodes;

	setter?.((prev) => {
		let data: Record<string, any> = {};

		switch (type) {
			case 'comment':
			case 'in':
			case 'out':
				data.label = type;
				break;
			case 'module':
				data.label = moduleLabel;
				data.type = moduleType;
				break;
		}

		return [
			...prev,
			{
				id: `${generateId(ctx.instance || null)}`,
				type,
				data,
				position: {
					x: 0,
					y: 0,
				},
			},
		];
	});
};

export const handleTools =
	(setNodesPaletteOpen: Setter<any>, setModulesPaletteOpen: Setter<any>) =>
	(toolType: string) => {
		switch (toolType) {
			case 'nodes':
				return setNodesPaletteOpen(true);
			case 'modules':
				return setModulesPaletteOpen(true);
		}
	};

export const handleDeleteModule = (type: string) => {
	ctx.setModules?.((prevModules) => {
		const newModules = prevModules.filter((x) => x.type !== type);
		return newModules;
	});
	ctx.instance?.deleteElements({
		nodes: ctx.nodes?.filter(
			(x) => x.type === 'module' && x.data.type === type,
		),
	});
};

export const handleCreateModule = () => {
	ctx.setCurrentModule?.({
		type: `${generateId(ctx.instance || null)}`,
		label: '',
		nodes: [],
		edges: [],
	});
	ctx.setModuleEdges?.([]);
	ctx.setModuleNodes?.([]);
	ctx.setMode?.('module');
	setTimeout(() => {
		ctx.instance?.fitView({
			padding: 0.25,
		});
	}, 50);
};

export const handleEditModule = (n: Node) => {
	const type = n.data.type;
	const m = ctx.modules?.find((x) => x.type === type);

	if (m) {
		ctx.setCurrentModule?.({
			...m,
			id: n.id,
		});
		ctx.setModuleEdges?.(m.edges);
		ctx.setModuleNodes?.(m.nodes);
		ctx.setMode?.('module');
		setTimeout(() => {
			ctx.instance?.fitView({
				padding: 0.25,
			});
		}, 50);
	}
};

export const handleSaveModule = () => {
	if (ctx.currentModule) {
		ctx.setModules?.((prevModules) => {
			const m = prevModules.filter(
				(m) => m.type !== ctx.currentModule?.type,
			);
			m.push({
				type: ctx.currentModule?.type || '',
				label: ctx.currentModule?.label || '',
				nodes: [...(ctx.moduleNodes || [])],
				edges: [...(ctx.moduleEdges || [])],
			});
			return m;
		});
		ctx.setMode?.('chart');
		setTimeout(() => {
			ctx.instance?.fitView({
				padding: 0.25,
			});
		}, 50);
		ctx.setCurrentModule?.(null);
	}
};

const startSim = () => {
	ctx.setEditable?.(false);
	const s = simulator({
		nodes: ctx.nodes || [],
		edges: ctx.edges || [],
	});

	ctx.setNodes?.((nodes) =>
		nodes.map((n) => {
			if (n.data) {
				n.data = {
					...n.data,
					sim: (state: boolean) => s.set(n.id, state),
				};
			}
			return n;
		}),
	);

	const updater = (state: SimState) => {
		if (!ctx.currentModule) {
			ctx.setNodes?.((prevNodes) =>
				prevNodes.map((n) => {
					if (state[n.id] !== undefined) {
						n.data = {
							...n.data,
							on: state[n.id],
						};
					}
					return n;
				}),
			);
			ctx.setEdges?.((prevEdges) =>
				prevEdges.map((e) => {
					e.data = {
						...e.data,
						on: state[varName(e.id)],
					};
					return e;
				}),
			);
		} else {
			ctx.setModuleNodes?.((prevNodes) =>
				prevNodes.map((n) => {
					if (
						state[`${ctx.currentModule?.id}_${n.id}`] !== undefined
					) {
						n.data = {
							...n.data,
							on: state[`${ctx.currentModule?.id}_${n.id}`],
						};
					}
					return n;
				}),
			);
			ctx.setModuleEdges?.((prevEdges) =>
				prevEdges.map((e) => {
					const key = varName(e.id, {
						prefix: ctx.currentModule?.id,
					});
					const val = state[key];
					e.data = {
						...e.data,
						on: val,
					};
					return e;
				}),
			);
		}
	};

	s.start(updater);
	ctx.setSim?.(s);
};

const stopSim = () => {
	ctx.setEditable?.(true);

	if (ctx.sim) {
		ctx.sim.stop();

		ctx.setNodes?.((prevNodes) =>
			prevNodes.map((n) => {
				if (n.data) {
					delete n.data.on;
					delete n.data.sim;
					n.data = {
						...n.data,
					};
				}
				return n;
			}),
		);
		ctx.setEdges?.((prevEdges) =>
			prevEdges.map((e) => {
				delete e.data.on;
				e.data = { ...e.data };
				return e;
			}),
		);

		ctx.setSim?.(null);
	}
};
