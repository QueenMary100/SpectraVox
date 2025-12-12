import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users } from 'lucide-react';

const studentCommunityContent = [
  {
    name: 'Leo Smith',
    title: 'Your Peer Mentor!',
    description: 'Hey! I’m Leo. I love drawing and video games. I can’t wait to share my experiences and have fun together!',
    avatarId: 'community-avatar-4',
  },
  {
    name: 'Art Club',
    title: 'Weekly on Thursdays',
    description: 'Join us to draw, paint, and create amazing art! No experience needed, just bring your imagination.',
    avatarId: 'lesson-animals-1',
  },
  {
    name: 'Game Zone',
    title: 'Tuesdays & Fridays',
    description: 'Let\'s play some fun and friendly games together online. Team up and make new friends!',
    avatarId: 'lesson-planets-3',
  },
  {
    name: 'Story Time',
    title: 'Mondays at 4 PM',
    description: 'Listen to exciting stories and share your own favorite tales with the group. A new adventure every week!',
    avatarId: 'lesson-planets-2',
  },
];

export default function StudentCommunityPage() {
  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl font-headline">
        My Community
      </h1>
      <p className="text-muted-foreground mb-6">
        Connect with friends, join clubs, and meet your mentor!
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {studentCommunityContent.map((item) => {
          const avatar = PlaceHolderImages.find((p) => p.id === item.avatarId);
          return (
            <Card key={item.name} className="flex flex-col">
              <CardHeader className="items-center text-center">
                {avatar && (
                  <Image
                    src={avatar.imageUrl}
                    alt={`Avatar for ${item.name}`}
                    width={120}
                    height={120}
                    data-ai-hint={avatar.imageHint}
                    className="rounded-full w-32 h-32 object-cover border-4 border-primary/20 mb-4"
                  />
                )}
                <CardTitle>{item.name}</CardTitle>
                <CardDescription className="text-primary font-semibold">{item.title}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground text-center">
                  {item.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {item.title.includes('Mentor') ? <MessageSquare className="mr-2 h-4 w-4" /> : <Users className="mr-2 h-4 w-4" />}
                  {item.title.includes('Mentor') ? 'Chat with Leo' : 'Join Club'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
