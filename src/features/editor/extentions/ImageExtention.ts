import { CommandProps, Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ImageComponent } from '../components/ImageNodeContent'
import { EditorState, NodeSelection } from 'prosemirror-state'
import { Node as ProseMirrorNode } from 'prosemirror-model'

export interface ImageAttributes {
	src: string | null
	alt: string | null
	caption: string
	title: string | null
	width: number | null
	height: number | null
	uploading: boolean
	style: 'center' | 'left' | 'right'
	size: '25%' | '50%' | '100%' | 'auto'
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		image: {
			setImage: (options: { src?: string; alt?: string; title?: string }) => ReturnType
			updateImageAttributes: (attrs: Partial<ImageAttributes>) => ReturnType
		}
	}
}

export function getSelectedNode(state: EditorState): { node: ProseMirrorNode; pos: number } | null {
  const { selection } = state

  if (selection instanceof NodeSelection) {
    return {
      node: selection.node,
      pos: selection.from,
    }
  }

  return null
}

export const ImageExtension = Node.create({
	name: 'customImage',

	group: 'block',

	atom: true,

	addAttributes() {
		return {
			src: {
				default: null,
			},
			alt: {
				default: null,
			},
			caption: {
				default: 'Image Caption'
			},
			title: {
				default: null,
			},
			width: {
				default: null,
			},
			height: {
				default: null,
			},
			uploading: {
				default: false,
			},
			style: {
				default: 'center',
			},
			size: {
				default: 'auto',
			},
		}
	},

	parseHTML() {
		return [
			{
				tag: 'img[src]',
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return ['img', mergeAttributes(HTMLAttributes)]
	},

	addNodeView() {
		return ReactNodeViewRenderer(ImageComponent)
	},

	addCommands() {
		return {
			setImage:
				(options: Partial<ImageAttributes>) =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: options,
					})
				},
			updateImageAttributes:
				(attrs: Partial<ImageAttributes>) =>
				({ tr, state, dispatch }: CommandProps) => {
					const selected = getSelectedNode(state)

					if (!selected || selected.node.type.name !== 'customImage') {
						return false
					}

					const { node, pos } = selected

					const newAttrs = {
						...node.attrs,
						...attrs,
					}

					if (dispatch) {
						dispatch(tr.setNodeMarkup(pos, undefined, newAttrs))
					}

					return true
				},
		}
	},
})
