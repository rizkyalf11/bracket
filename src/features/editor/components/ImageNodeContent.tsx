/* eslint-disable @next/next/no-img-element */
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Loader2, Upload, X } from 'lucide-react'
import React, { useRef, useState } from 'react'

export const ImageComponent: React.FC<NodeViewProps> = ({ node, updateAttributes, deleteNode, selected }) => {
	const { src, alt, style, size, caption } = node.attrs
	console.log('size', size)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<boolean>(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setIsLoading(true)

		const formData = new FormData()
		formData.append('file', file)

		try {
			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			})

			if (!res.ok) {
				setIsLoading(false)
				setError(true)
			}

			const data = await res.json()

			updateAttributes({
				src: data.secure_url,
			})
			setIsLoading(false)
		} catch (e) {
			console.log(e)
			setError(true)
			setIsLoading(false)
		}
	}

	if (isLoading) {
		return (
			<NodeViewWrapper className="image-placeholder my-5">
				<div className="flex items-center justify-center w-full h-48 bg-secondary border-2 border-dashed border-border rounded-lg">
					<div className="text-center">
						<Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-foreground" />
						<p className="text-foreground">Mengupload gambar...</p>
					</div>
				</div>
			</NodeViewWrapper>
		)
	}

	if (error) {
		return (
			<NodeViewWrapper className="image-error my-5">
				<div className="flex items-center justify-between w-full p-4 bg-red-50 border border-red-200 rounded-lg">
					<div className="flex items-center">
						<Upload className="w-5 h-5 text-red-500 mr-2" />
						<span className="text-red-700">Terjadi Kesalahan!</span>
					</div>
					<button onClick={() => deleteNode()} className="text-red-500 hover:text-red-700" type="button">
						<X className="w-4 h-4" />
					</button>
				</div>
			</NodeViewWrapper>
		)
	}

	if (!src) {
		return (
			<NodeViewWrapper className="image-empty my-5">
				<div onClick={() => fileInputRef.current?.click()} className="flex cursor-pointer items-center justify-center w-full h-48 bg-secondary hover:bg-secondary/90 border-2 border-dashed border-border rounded-lg">
					<div className="text-center">
						<Upload className="w-8 h-8 mx-auto mb-2 text-foreground" />
						<p className="text-foreground">Upload Gambar</p>
					</div>
				</div>
				<Input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
			</NodeViewWrapper>
		)
	}

	return (
		<NodeViewWrapper className="image-wrapper my-5">
			<div className="relative group">
				<figure>
					<img
						src={src}
						alt={alt || ''}
						className={cn('max-w-full w-auto h-auto mr-auto rounded-lg shadow-sm', {
							'border-2 border-blue-500 shadow shadow-blue-500': selected,
							'mx-auto': style === 'center',
							'ml-auto mr-0': style === 'right',
							'mr-auto ml-0': style === 'left',
							'w-auto': size === 'auto',
							'w-[25%]': size === '25%',
							'w-[50%]': size === '50%',
							'w-[100%]': size === '100%',
						})}
					/>
					<figcaption className='text-center mt-2 text-muted-foreground'>{caption}</figcaption>
				</figure>
			</div>
		</NodeViewWrapper>
	)
}
