import { Facebook, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const scheduledPosts = [
  {
    id: '1',
    platform: 'facebook',
    content: "Exploring the Alps! The views are breathtaking. What's your favorite mountain range? 🏔️ #travel #alps #adventure",
    date: '2024-08-15 10:30 AM',
    status: 'Scheduled',
  },
  {
    id: '2',
    platform: 'x',
    content: 'Just dropped a new blog post on the future of AI. Link in bio! #AI #Tech #Future',
    date: '2024-08-16 03:00 PM',
    status: 'Scheduled',
  },
  {
    id: '3',
    platform: 'x',
    content: 'Quick tip for developers: always document your code. Future you will thank you. #coding #devtips',
    date: '2024-08-18 09:00 AM',
    status: 'Scheduled',
  },
  {
    id: '4',
    platform: 'facebook',
    content: "Our team just won the 'Innovator of the Year' award! So proud of everyone's hard work. 🎉 #innovation #award #teamwork",
    date: '2024-08-20 12:00 PM',
    status: 'Published',
  },
];

function PlatformIcon({ platform }: { platform: string }) {
    if (platform === 'facebook') {
        return <Facebook className="h-5 w-5 text-blue-500" />;
    }
    return <Twitter className="h-5 w-5 text-sky-500" />;
}

export default function ScheduledPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Posts</CardTitle>
        <CardDescription>
          A list of your upcoming and already published posts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                Platform
              </TableHead>
              <TableHead>Post</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>
                <span className="sr-only">Status</span>
              </TableHead>
              <TableHead>
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="hidden sm:table-cell">
                  <PlatformIcon platform={post.platform} />
                </TableCell>
                <TableCell className="font-medium">
                  <p className="line-clamp-2">{post.content}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {post.date}
                </TableCell>
                <TableCell>
                  <Badge variant={post.status === 'Scheduled' ? 'secondary' : 'outline'}>
                    {post.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
