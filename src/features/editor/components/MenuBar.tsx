import { Editor } from '@tiptap/react'
import { AlignCenterVertical, AlignEndVertical, AlignStartVertical, Bold, Heading1, Heading2, Heading3, Highlighter, ImagePlus, Italic, Link, List, ListOrdered, LucideProps, Redo2, Strikethrough, Underline, Undo2 } from 'lucide-react'
import MyTooltip from './MyTooltip'
import { Dispatch, ForwardRefExoticComponent, RefAttributes, SetStateAction, useRef } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useWindowSize } from '@/hooks/use-window-size'
import { useCursorVisibility } from '@/hooks/use-cursor-visibility'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { getSelectedImageAttributes } from '../utils/getAttrs'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type Props = {
	editor: Editor | null
	setLink: Dispatch<SetStateAction<boolean>>
}

export type TypeOptionsItem = {
	icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
	onClick: () => void
	pressed: boolean
	tooltip: string
	isButton: boolean
}

type TypeOptions = {
	items: TypeOptionsItem[]
}[]

const MenuBar = ({ editor, setLink }: Props) => {
	const isMobile = useIsMobile()
	const windowSize = useWindowSize()
	const toolbarRef = useRef<HTMLDivElement>(null)
	const bodyRect = useCursorVisibility({
		editor,
		overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
	})

	if (!editor) {
		return null
	}

	const attrsImgSelected = getSelectedImageAttributes(editor.state)

	const Options: TypeOptions = [
		{
			items: [
				{
					icon: Undo2,
					onClick: () => editor.chain().focus().undo().run(),
					pressed: !editor.can().undo(),
					tooltip: 'Ctrl + Z',
					isButton: true,
				},
				{
					icon: Redo2,
					onClick: () => editor.chain().focus().redo().run(),
					pressed: !editor.can().redo(),
					tooltip: 'Ctrl + Shift + Z',
					isButton: true,
				},
			],
		},
		{
			items: [
				{
					icon: Heading1,
					onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
					pressed: editor.isActive('heading', { level: 1 }),
					tooltip: 'Ctrl + Alt + 1',
					isButton: false,
				},
				{
					icon: Heading2,
					onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
					pressed: editor.isActive('heading', { level: 2 }),
					tooltip: 'Ctrl + Alt + 2',
					isButton: false,
				},
				{
					icon: Heading3,
					onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
					pressed: editor.isActive('heading', { level: 3 }),
					tooltip: 'Ctrl + Alt + 3',
					isButton: false,
				},
			],
		},
		{
			items: [
				{
					icon: Bold,
					onClick: () => editor.chain().focus().toggleBold().run(),
					pressed: editor.isActive('bold'),
					tooltip: 'Ctrl + B',
					isButton: false,
				},
				{
					icon: Italic,
					onClick: () => editor.chain().focus().toggleItalic().run(),
					pressed: editor.isActive('italic'),
					tooltip: 'Ctrl + I',
					isButton: false,
				},
				{
					icon: Strikethrough,
					onClick: () => editor.chain().focus().toggleStrike().run(),
					pressed: editor.isActive('strike'),
					tooltip: 'Ctrl + Shift + S',
					isButton: false,
				},
				{
					icon: Underline,
					onClick: () => editor.chain().focus().toggleUnderline().run(),
					pressed: editor.isActive('underline'),
					tooltip: 'Ctrl + U',
					isButton: false,
				},
			],
		},
		{
			items: [
				{
					icon: List,
					onClick: () => editor.chain().focus().toggleBulletList().run(),
					pressed: editor.isActive('bulletList'),
					tooltip: 'Ctrl + Shift + 8',
					isButton: false,
				},
				{
					icon: ListOrdered,
					onClick: () => editor.chain().focus().toggleOrderedList().run(),
					pressed: editor.isActive('orderedList'),
					tooltip: 'Ctrl + Shift + 7',
					isButton: false,
				},
			],
		},
		{
			items: [
				{
					icon: Highlighter,
					onClick: () => editor.chain().focus().toggleHighlight().run(),
					pressed: editor.isActive('highlight'),
					tooltip: 'Ctrl + Shift + H',
					isButton: false,
				},
				{
					icon: Link,
					onClick: () => setLink(true),
					pressed: editor.isActive('link'),
					tooltip: 'Link',
					isButton: false,
				},
				{
					icon: ImagePlus,
					onClick: () => {
						if (!editor.isActive('customImage')) {
							editor.chain().focus().setImage({}).run()
						}
					},
					pressed: editor.isActive('customImage'),
					tooltip: 'Add Image',
					isButton: false,
				},
			],
		},
	]

	return (
		<div
			ref={toolbarRef}
			style={
				isMobile
					? {
							bottom: `calc(100% - ${windowSize.height - bodyRect.y}px)`,
							position: 'fixed',
					  }
					: {}
			}
			className="border-t border-b   w-full overflow-x-auto space-x-1 items-center justify-center-safe flex border-border mb-1 p-2 bg-background z-50"
		>
			{editor.isActive('customImage') && attrsImgSelected?.src ? (
				<div>
					<div className="flex gap-1 items-center">
						<Toggle pressed={attrsImgSelected?.style === 'left'} onClick={() => editor.commands.updateImageAttributes({ style: 'left' })}>
							<AlignStartVertical />
						</Toggle>
						<Toggle pressed={attrsImgSelected?.style === 'center'} onClick={() => editor.commands.updateImageAttributes({ style: 'center' })}>
							<AlignCenterVertical />
						</Toggle>
						<Toggle pressed={attrsImgSelected?.style === 'right'} onClick={() => editor.commands.updateImageAttributes({ style: 'right' })}>
							<AlignEndVertical />
						</Toggle>
						<Separator orientation="vertical" className="!h-7" />
						<Toggle pressed={attrsImgSelected?.size === 'auto'} onClick={() => editor.commands.updateImageAttributes({ size: 'auto' })}>
							auto
						</Toggle>
						<Toggle pressed={attrsImgSelected?.size === '25%'} onClick={() => editor.commands.updateImageAttributes({ size: '25%' })}>
							25%
						</Toggle>
						<Toggle pressed={attrsImgSelected?.size === '50%'} onClick={() => editor.commands.updateImageAttributes({ size: '50%' })}>
							50%
						</Toggle>
						<Toggle pressed={attrsImgSelected?.size === '100%'} onClick={() => editor.commands.updateImageAttributes({ size: '100%' })}>
							100%
						</Toggle>
						<Separator orientation="vertical" className="!h-7" />
						<Popover>
							<PopoverTrigger asChild>
								<Button>Edit Capt</Button>
							</PopoverTrigger>
							<PopoverContent className="w-80">
								<div className="grid gap-4">
									<div className="grid gap-2">
										<div className="grid grid-cols-3 items-center gap-4">
											<Label htmlFor="caption">Caption</Label>
											<Input required value={attrsImgSelected?.caption || ''} onChange={(e) => editor.commands.updateImageAttributes({ caption: e.target.value })} id="caption" className="col-span-2 h-8" />
										</div>
										<div className="grid grid-cols-3 items-center gap-4">
											<Label htmlFor="alt">Alt</Label>
											<Input required value={attrsImgSelected?.alt || ''} onChange={(e) => editor.commands.updateImageAttributes({ alt: e.target.value })} id="alt" className="col-span-2 h-8" />
										</div>
									</div>
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			) : (
				<>
					{Options.map((items, index) => (
						<div key={index} className="flex gap-1 items-center">
							{items.items.map((option, index) => (
								<MyTooltip key={index} option={option} />
							))}
							{Options.length != index + 1 && <Separator className="!h-7" orientation="vertical" />}
						</div>
					))}
				</>
			)}
		</div>
	)
}

export default MenuBar
