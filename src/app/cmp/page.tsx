import { SquarePen } from 'lucide-react'
import React from 'react'

const CMP = () => {
	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div className="flex">
				<div className="w-[20px] text-foreground font-medium flex items-center">5</div>
				<div className="flex flex-col w-[220px] bg-card border-2 border-border border-r-0 rounded-md rounded-r-none overflow-hidden">
					<div className="flex w-full h-[30px] border-b-1 border-border">
						<div className="w-[40px] bg-secondary text-secondary-foreground font-medium flex items-center justify-center">1</div>
						<div className="flex-1 overflow-x-auto whitespace-nowrap pl-2 font-semibold text-card-foreground scroll-hidden">TIM A</div>
					</div>
					<div className="flex w-full h-[30px]">
						<div className="w-[40px] bg-secondary text-secondary-foreground font-medium flex items-center justify-center">2</div>
						<div className="flex-1 overflow-x-auto whitespace-nowrap pl-2 font-semibold text-card-foreground scroll-hidden">TIM B</div>
					</div>
				</div>
				{/* edit score */}
				<div className="w-[40px] hidden text-muted-foreground hover:text-primary border-2 border-border border-l-0 rounded-r-md items-center justify-center">
					<SquarePen />
				</div>
				{/* score */}
				<div className="w-[40px] border-2 overflow-hidden border-border border-l-0 rounded-r-md flex flex-col">
					<div className="h-[30px] bg-secondary flex items-center justify-center text-secondary-foreground font-medium">1</div>
					<div className="h-[30px] bg-primary text-primary-foreground flex items-center justify-center font-medium">2</div>
				</div>
			</div>
		</div>
	)
}

export default CMP
