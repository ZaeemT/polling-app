import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { X, Plus, Loader2 } from 'lucide-react'
import { CreatePoll } from '@/services/poll.service'

const pollSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
    image: z.any().refine((file) => file instanceof File && file.size <= 5000000, `Max image size is 5MB.`),
    options: z.array(z.string().min(1, { message: 'Option text is required' }))
        .min(2, { message: 'At least two options are required' })
        .max(5, { message: 'Maximum of five options allowed' })
})

type PollFormValues = z.infer<typeof pollSchema>

export default function AddPoll() {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { toast } = useToast()

    const form = useForm<PollFormValues>({
        resolver: zodResolver(pollSchema),
        defaultValues: {
            title: '',
            description: '',
            options: ['', '']
        }
    })

    const { fields, append, remove } = useFieldArray({
        name: 'options',
        control: form.control
    })

    const onSubmit = async (values: PollFormValues) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append('title', values.title)
            formData.append('description', values.description)
            formData.append('image', values.image as File)
            values.options.forEach((option, index) => {
                formData.append(`options[${index}]`, option)
            })

            const response = await CreatePoll(formData)
            toast({
                title: 'Poll Created',
                description: 'Your poll has been successfully created.',
            })
            navigate(`/polls/${response.data._id}`)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create poll. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create a New Poll</CardTitle>
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
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                field.onChange(file || null) // Pass the file or null
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
                                className="m-2"
                                onClick={() => append('')}
                                disabled={fields.length >= 5}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Option
                            </Button>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2/> : 'Create Poll'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}