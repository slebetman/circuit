import { getEditorContext } from 'lib/editorContext';
import { CSSProperties, FC } from 'react';
import { Panel } from 'reactflow';

const titleFont: CSSProperties = {
	fontSize: '20px',
};

const titlePanelStyle: CSSProperties = {
	...titleFont,
	backgroundColor: '#ccc',
	padding: '10px',
	borderRadius: '10px',
};

export const StatusPanel: FC = () => {
	const ctx = getEditorContext();

	return (
		<>
			{ctx.sim ?
				<Panel position='top-center' style={titlePanelStyle}>
					Simulation running..
					{ctx.mode === 'module' && (
						<span style={{ marginLeft: '10px' }}>
							Module: {ctx.currentModule?.[0]?.label}
						</span>
					)}
				</Panel>
			: ctx.mode === 'module' ?
				<Panel position='top-center' style={titlePanelStyle}>
					<span style={{ marginRight: '5px' }}>Edit Module:</span>
					<input
						style={{
							...titleFont,
							padding: '5px 10px',
							borderRadius: '5px',
							border: '1px solid #999',
						}}
						type='text'
						value={ctx.currentModule?.[0]?.label}
						onChange={(e) => {
							const val = e.currentTarget?.value;

							if (val !== undefined) {
								ctx.setCurrentModule?.((prevModule) => {
									if (prevModule.length) {
										prevModule[0] = {
											...prevModule[0],
											label: val,
										};
									}
									return [...prevModule];
								});
							}
						}}
					/>
				</Panel>
			:	''}
		</>
	);
};
