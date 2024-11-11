import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GetPolls } from '@/services/poll.service'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Poll } from '@/types'
import { ChevronRight, BarChart2 } from 'lucide-react'

export default function Polls() {
    const [polls, setPolls] = useState<Poll[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        fetchPolls()
    }, [])

    const fetchPolls = async () => {
        try {
            const response = await GetPolls()
            if (response.data) {
                setPolls(response.data.polls)
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch polls. Please try again later.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const PollCard = ({ poll }: { poll: Poll }) => (
        <Card>
            <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2">
                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{poll.options.length} options</span>
                </div>
            </CardContent>
            <CardFooter>
                <Link to={`/polls/${poll.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                        View Poll
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )

    const PollCardSkeleton = () => (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-1/4" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Available Polls</h1>
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <PollCardSkeleton key={index} />
                    ))}
                </div>
            ) : polls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {polls.map((poll) => (
                        <PollCard key={poll.id} poll={poll} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground">
                    <p>No polls available at the moment.</p>
                    <Link to="/create-poll">
                        <Button className="mt-4">Create a New Poll</Button>
                    </Link>
                </div>
            )}
        </div>
    )
}