import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Editor } from '@tiptap/react'
import { Dispatch, SetStateAction } from 'react'

type Props = {
	dialog: boolean
	setDialog: Dispatch<SetStateAction<boolean>>
	editor: Editor | null
	url: string
	setUrl: Dispatch<SetStateAction<string>>
}

const DialogLink = ({ dialog, setDialog, editor, url, setUrl }: Props) => {
	const handleOke = () => {
		if (url === null) {
			setDialog(false)
			return
		}
		if (url === '') {
			editor!.chain().focus().extendMarkRange('link').unsetLink().run()
			setDialog(false)
			return
		}

		try {
			editor!.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
			setDialog(false)
		} catch (e) {
			console.log(e)
			setDialog(false)
		}
	}
	const handleCancel = () => {
		setDialog(false)
		return
	}

	return (
		<Dialog open={dialog}>
			<DialogContent showCloseButton={false} className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>URL</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="grid gap-3">
						<Input value={url} onChange={(e) => setUrl(e.target.value)} id="link" name="link" placeholder="https://youtube.com" />
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button onClick={handleCancel} variant="outline">
							Cancel
						</Button>
					</DialogClose>
					<Button onClick={handleOke}>Oke</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default DialogLink
