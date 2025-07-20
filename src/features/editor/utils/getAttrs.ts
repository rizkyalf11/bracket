import { EditorState, NodeSelection } from 'prosemirror-state'
import { ImageAttributes } from '../extentions/ImageExtention'

/**
 * Mengambil attribute dari node yang sedang terseleksi (jika ada dan valid).
 */
export function getSelectedImageAttributes(state: EditorState): Partial<ImageAttributes> | null {
  const { selection } = state

  // Pastikan yang terseleksi adalah NodeSelection
  if (selection instanceof NodeSelection) {
    const node = selection.node

    if (node.type.name === 'customImage') {
      return node.attrs as Partial<ImageAttributes>
    }
  }

  return null
}