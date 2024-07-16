import { useState } from 'react';
import { ReactFlowInstance, useEdgesState, useNodesState } from 'reactflow';
import useChart, { Module } from './useChart';
import { EditorMode, setEditorContext } from 'lib/editorContext';
import { SimObject } from 'lib/simulator';
import { useRouter } from 'next/router';

export const useEditorState = () => {
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [moduleNodes, setModuleNodes, onModuleNodesChange] = useNodesState(
		[],
	);
	const [moduleEdges, setModuleEdges, onModuleEdgesChange] = useEdgesState(
		[],
	);
	const [modules, setModules] = useState<Module[]>([]);
	const [currentModule, setCurrentModule] = useState<Module[]>([]);
	const [instance, setInstance] = useState<ReactFlowInstance | null>(null);
	const [mode, setMode] = useState<EditorMode>('chart');
	const [nodesPaletteOpen, setNodesPaletteOpen] = useState(false);
	const [modulesPaletteOpen, setModulesPaletteOpen] = useState(false);
	const [codeOpen, setCodeOpen] = useState(false);
	const [code, setCode] = useState<string[]>([]);
	const [sim, setSim] = useState<SimObject | null>(null);
	const [editable, setEditable] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const chart = useChart();
	const mod = useChart();
	const router = useRouter();

	setEditorContext({
		currentModule,
		setCurrentModule,
		modules,
		setModules,
		nodes,
		setNodes,
		onNodesChange,
		edges,
		setEdges,
		onEdgesChange,
		mode,
		setMode,
		moduleNodes,
		setModuleNodes,
		onModuleNodesChange,
		moduleEdges,
		setModuleEdges,
		onModuleEdgesChange,
		router,
		instance,
		setEditable,
		chart,
		mod,
		setSim,
		sim,
		code,
		codeOpen,
		setCodeOpen,
	});

	return {
		nodes,
		setNodes,
		onNodesChange,
		edges,
		setEdges,
		onEdgesChange,
		moduleNodes,
		setModuleNodes,
		onModuleNodesChange,
		moduleEdges,
		setModuleEdges,
		onModuleEdgesChange,
		modules,
		setModules,
		currentModule,
		setCurrentModule,
		instance,
		setInstance,
		mode,
		setMode,
		nodesPaletteOpen,
		setNodesPaletteOpen,
		modulesPaletteOpen,
		setModulesPaletteOpen,
		codeOpen,
		setCodeOpen,
		code,
		setCode,
		sim,
		setSim,
		editable,
		setEditable,
		error,
		setError,
		chart,
		mod,
		router,
	};
};
