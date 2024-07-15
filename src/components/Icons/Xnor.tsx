import { Icon } from './types';

const Xnor: Icon = ({ selected }) => (
	<svg
		width='35px'
		height='21px'
		viewBox='0 0 35 21'
		version='1.1'
		id='svg1'
		fill='#fff'
		stroke='#000'
		strokeWidth={selected ? 2 : 1}
	>
		<path
			id='rect1'
			d='m 11,1 c 4,6 4,12 0,18 H 16 C 21,19 29,14 29,10 29,6 21,1 16,1 Z'
		/>
		<path d='M 8,1 C 12,7 12,13 8,19' id='path1-5' />
		<path d='M 0,6 H 10' id='path1' />
		<path d='M 0,15 H 10' id='path1-7' />
		<path d='M 32.990991,10 H 35' id='path1-9' />
		<path
			id='path1-2'
			d='m 32.990991,10 a 2,2 0 0 1 -2,2 2,2 0 0 1 -2,-2 2,2 0 0 1 2,-2 2,2 0 0 1 2,2 z'
		/>
	</svg>
);

export default Xnor;
