'use client'

import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import { LinkEx, StarterKitEx } from '../extentions'
import MenuBar from './MenuBar'
import { useCallback, useState } from 'react'
import DialogLink from './DialogLink'
import { ImageExtension } from '../extentions/ImageExtention'
import Gapcursor from '@tiptap/extension-gapcursor'

const Tiptap = () => {
	const [dialogLink, setDialogLink] = useState<boolean>(false)
	const [url, setUrl] = useState<string>('')

	const editor = useEditor({
		extensions: [Underline, Highlight, StarterKitEx, LinkEx, ImageExtension, Gapcursor],
		content: '',
		editorProps: {
			attributes: {
				autocomplete: 'off',
				autocorrect: 'off',
				autocapitalize: 'off',
				class: 'min-h-[90svh] max-w-4xl outline-0 mx-auto bg-background text-foreground rounded-md py-2 px-4',
			},
		},
	})

	const handleSetLink = useCallback(() => {
		const previousUrl = editor!.getAttributes('link').href
		setUrl(previousUrl ?? '')
		setDialogLink(true)
	}, [editor])

	return (
		<div className="w-full h-full flex flex-col">
			<MenuBar setLink={handleSetLink} editor={editor} />
			<div className="flex-1 overflow-y-auto">
				<EditorContent editor={editor} />
			</div>

			<DialogLink url={url} setUrl={setUrl} editor={editor} dialog={dialogLink} setDialog={setDialogLink} />
		</div>
	)
}

export default Tiptap
