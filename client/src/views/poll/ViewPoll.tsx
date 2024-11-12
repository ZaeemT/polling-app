import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DeletePoll, GetPollById, VotePoll } from '@/services/poll.service'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Poll } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { Edit, Loader2, Trash2 } from 'lucide-react'
import io from 'socket.io-client'
import axios from 'axios'

export default function PollDetail() {
    const [poll, setPoll] = useState<Poll | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [clientIp, setClientIp] = useState<string | null>(null)
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>()
    const { toast } = useToast()
    const navigate = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        if (!user) {
            axios.get('https://api.ipify.org?format=json')
                .then(response => setClientIp(response.data.ip))
                .catch(error => console.error('Error fetching IP address:', error))
        }
    }, [user])

    useEffect(() => {

        const socket = io('http://localhost:3000')

        const fetchPoll = async () => {
            try {
                const response = await GetPollById(id!)
                setPoll(response.data.poll)
                const base64Image = `data:${response.data.poll.imageType};base64,${response.data.poll.image}`;
                setImageSrc(base64Image);
            } catch (error) {
                console.error('Error fetching poll:', error)
                toast({
                    title: 'Error',
                    description: 'Failed to fetch poll details. Please try again later.',
                    variant: 'destructive',
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchPoll()

        socket.emit('joinPoll', id)

        socket.on('pollUpdated', (updatedPoll: Poll) => {
            console.log('Received updated poll:', updatedPoll);
            setPoll(updatedPoll)
        })

        return () => {
            socket.emit('leavePoll', id)
            socket.disconnect()
        }
    }, [id, toast])

    useEffect(() => {
        // console.log('Poll state updated:', poll);
    }, [poll])

    const handleVote = async () => {
        if (!selectedOption) return

        const data = user ? {
            option: selectedOption,
            user_id: user.id
        } : {
            option: selectedOption,
            ipAddress: clientIp
        }


        try {
            const response = await VotePoll(id!, data)
            toast({
                title: 'Vote Submitted',
                description: 'Your vote has been recorded successfully.',
            })
            setPoll(response.data)
        } catch (error: any) {
            toast({
                title: 'Error',
                description: "You have already voted",
                variant: 'destructive',
            })
            navigate('/')
        }
    }

    const handleDelete = async () => {
        try {
            await DeletePoll(id!)
            toast({
                title: 'Poll Deleted',
                description: 'The poll has been successfully deleted.',
            })
            navigate('/')
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete the poll. Please try again.',
                variant: 'destructive',
            })
        }
    }

    if (isLoading) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full mb-4" />
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="mb-4">
                            <Skeleton className="h-8 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    if (!poll) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>Failed to load poll data. Please try again later.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    const totalVotes = poll.options?.reduce((sum, option) => sum + option.votes, 0) || 0

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
                {imageSrc && (
                    <img
                        src={imageSrc}
                        alt={poll.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                    />
                )}
                {poll.options?.map((option, id) => (
                    <div key={id} className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="pollOption"
                                    value={option.text}
                                    checked={selectedOption === option.text}
                                    onChange={() => setSelectedOption(option.text)}
                                    className="form-radio"
                                />
                                <span>{option.text}</span>
                            </label>
                            <span>{option.votes} votes</span>
                        </div>
                        <Progress value={totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0} className="h-2" />
                    </div>
                ))}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={handleVote} disabled={!selectedOption}>
                    {isLoading ? <Loader2/> : 'Vote'}
                </Button>
                {user && user.id === poll.user_id && (
                    <div className="space-x-2">
                        <Button variant="outline" onClick={() => navigate(`/edit-poll/${id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    { isLoading ? <Loader2/>: 'Delete' }
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your poll
                                        and remove all associated data.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Delete Poll
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}