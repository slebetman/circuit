import { Icon } from './types';

const Nand: Icon = ({ selected }) => (
	<svg
		width='35px'
		height='21px'
		viewBox='0 0 36 21'
		version='1.1'
		id='svg1'
		fill='#fff'
		stroke='#000'
		strokeWidth={selected ? 2 : 1}
	>
		<path
			id='rect1'
			d='m 9,1 v 18 h 10 c 5,0 9,-4 9,-9 0,-5 -4,-9 -9,-9 z'
		/>
		<path d='M 0,6 H 9' id='path1' />
		<path d='M 0,15 H 9' id='path1-7' />
		<path d='m 32,10 h 3' id='path1-9' />
		<path
			id='path1-2'
			d='m 32,10 a 2,2 0 0 1 -2,2 2,2 0 0 1 -2,-2 2,2 0 0 1 2,-2 2,2 0 0 1 2,2 z'
		/>
	</svg>
);

export default Nand;
