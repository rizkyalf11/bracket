type Props = {
	height: number
	url: string
}

const BracketWrapper = ({ height, url }: Props) => {
	return (
		<div className="px-4 py-2 bg-[#272727] rounded-xl">
			<div className={`bracket-wrapper overflow-hidden h-[${height - 105}px]`}>
				<iframe src={`https://challonge.com/${url}/module`} width="100%" height={height}></iframe>
			</div>
		</div>
	)
}

export default BracketWrapper
