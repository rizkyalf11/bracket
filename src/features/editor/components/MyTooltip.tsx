import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Toggle } from '@/components/ui/toggle'
import { useIsMobile } from '@/hooks/use-mobile'
import { TypeOptionsItem } from './MenuBar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
	option: TypeOptionsItem
}

const MyTooltip = ({ option }: Props) => {
	const isMobile = useIsMobile()

	if (isMobile) {
		return (
			<Toggle pressed={option.pressed} onPressedChange={option.onClick}>
				<option.icon className="size-5" />
			</Toggle>
		)
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div>
					{option.isButton ? (
						<Button disabled={option.pressed} onClick={option.onClick} size="icon" variant="ghost">
							<option.icon className={cn("size-5", {
								"opacity-30": option.pressed
							})} />
						</Button>
					) : (
						<Toggle pressed={option.pressed} onPressedChange={option.onClick}>
							<option.icon className="size-5" />
						</Toggle>
					)}
				</div>
			</TooltipTrigger>
			<TooltipContent className="z-50">
				<p>{option.tooltip}</p>
			</TooltipContent>
		</Tooltip>
	)
}

export default MyTooltip
