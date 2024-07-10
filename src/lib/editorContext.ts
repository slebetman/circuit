import { Module } from 'hooks/useChart';
import { NextRouter } from 'next/router';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import {
	Edge,
	Node,
	OnEdgesChange,
	OnNodesChange,
	ReactFlowInstance,
} from 'reactflow';
import { SimObject } from './simulator';

export type EditorMode = 'open' | 'import' | 'save' | 'chart' | 'module';

export type EditorContextType = {
	chartContainerRef?: MutableRefObject<any>;
	currentModule?: Module | null;
	setCurrentModule?: Dispatch<SetStateAction<Module | null>>;
	modules?: Module[];
	setModules?: Dispatch<SetStateAction<Module[]>>;
	nodes?: Node[];
	setNodes?: Dispatch<SetStateAction<Node<any, string | undefined>[]>>;
	onNodesChange?: OnNodesChange;
	edges?: Edge[];
	setEdges?: Dispatch<SetStateAction<Edge<any>[]>>;
	onEdgesChange?: OnEdgesChange;
	mode?: EditorMode;
	setMode?: Dispatch<SetStateAction<EditorMode>>;
	moduleNodes?: Node[];
	setModuleNodes?: Dispatch<SetStateAction<Node<any, string | undefined>[]>>;
	onModuleNodesChange?: OnNodesChange;
	moduleEdges?: Edge[];
	setModuleEdges?: Dispatch<SetStateAction<Edge<any>[]>>;
	onModuleEdgesChange?: OnEdgesChange;
	router?: NextRouter;
	instance?: ReactFlowInstance | null;
	startSim?: Function;
	stopSim?: Function;
	chart?: any;
	mod?: any;
	setEditable?: Dispatch<SetStateAction<boolean>>;
	setSim?: Dispatch<SetStateAction<SimObject | null>>;
	sim?: SimObject | null;
} & Record<string, any>;

const context: EditorContextType = {};

export function getEditorContext() {
	return context;
}

export function setEditorContext(ctx: EditorContextType) {
	for (const k in ctx) {
		context[k] = ctx[k];
	}
}
