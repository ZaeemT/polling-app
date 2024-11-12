import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { UpdatePoll, GetPollById } from '@/services/poll.service'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { X, Plus, Loader2 } from 'lucide-react'
import { Poll } from '@/types'

const pollSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
    image: z.instanceof(File).optional(),
    options: z.array(z.string().min(1, { message: 'Option text is required' }))
        .min(2, { message: 'At least two options are required' })
        .max(5, { message: 'Maximum of five options allowed' })
})

type PollFormValues = z.infer<typeof pollSchema>

export default function EditPoll() {
    const [isLoading, setIsLoading] = useState(false)
    const [poll, setPoll] = useState<Poll | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { toast } = useToast()

    const form = useForm<PollFormValues>({
        resolver: zodResolver(pollSchema),
        defaultValues: {
            title: '',
            description: '',
            options: [],
        }
    })
    

    const { fields, append, remove } = useFieldArray({
        name: 'options' as never,
        control: form.control
    })

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await GetPollById(id!)
                const data = response.data.poll
                setPoll(data)
                const base64Image = `data:${response.data.poll.imageType};base64,${response.data.poll.image}`;
                setImagePreview(base64Image)  // Set the image preview URL

                form.reset({
                    title: data.title,
                    description: data.description,
                    options: data.options.map((option: { text: string }) => option.text),  
                    // image: base64Image,
                })
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to fetch poll details. Please try again later.',
                    variant: 'destructive',
                })
                navigate('/')
            }
        }

        fetchPoll()
    }, [id, form, toast, navigate])

    const onSubmit = async (values: PollFormValues) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('title', values.title)
            formData.append('description', values.description)
            if (values.image) formData.append('image', values.image as File)  // Only append new image if provided
            values.options.forEach((option, index) => {
                formData.append(`options[${index}]`, option)
            })

            await UpdatePoll(id!, formData)
            toast({
                title: 'Poll Updated',
                description: 'Your poll has been successfully updated.',
            })
            navigate(`/polls/${id}`)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update poll. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!poll) return null

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Update Poll</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter poll title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter poll description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    {imagePreview && (
                                        <img src={imagePreview} alt="Current Poll Image" className="mb-4 w-full h-40 object-cover" />
                                    )}
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                field.onChange(file || null)
                                                setImagePreview(file ? URL.createObjectURL(file) : null)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            <FormLabel>Options</FormLabel>
                            {fields.map((field, index) => (
                                <FormField
                                    key={field.id}
                                    control={form.control}
                                    name={`options.${index}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <Input placeholder={`Option ${index + 1}`} {...field} />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => remove(index)}
                                                        disabled={fields.length <= 2}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => append('')}
                                disabled={fields.length >= 5}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Option
                            </Button>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 /> : 'Update Poll'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
