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
import { MessageSquare, Rss } from 'lucide-react';

const teacherCommunityContent = [
  {
    name: 'Resource Exchange Forum',
    type: 'Forum',
    description: 'A space to share and discover effective teaching materials, lesson plans, and digital tools tailored for students with Down syndrome.',
    avatarId: 'curriculum-review-1', 
    action: 'Enter Forum',
  },
  {
    name: 'Monthly Strategy Roundtable',
    type: 'Event',
    description: 'Join our live monthly webinar where expert educators discuss new teaching strategies and AI-driven tools. Hosted by Dr. Davis.',
    avatarId: 'community-avatar-1',
    action: 'Register Now',
  },
  {
    name: 'Special Education Advocates Group',
    type: 'Group',
    description: 'Connect with advocates like David Chen to learn about navigating the educational system and ensuring student rights are met.',
    avatarId: 'community-avatar-2',
    action: 'Join Group',
  },
  {
    name: 'Communication Techniques Q&A',
    type: 'Q&A Session',
    description: 'An open session with Speech-Language Pathologist Maria Garcia to ask questions about enhancing student communication.',
    avatarId: 'community-avatar-3',
    action: 'Join Session',
  },
];

export default function TeacherCommunityPage() {
  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl font-headline">
        Educator Community Hub
      </h1>
      <p className="text-muted-foreground mb-6">
        Collaborate with peers, share resources, and grow professionally.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {teacherCommunityContent.map((item) => {
          const avatar = PlaceHolderImages.find((p) => p.id === item.avatarId);
          return (
            <Card key={item.name} className="flex flex-col">
              <CardHeader>
                {avatar && (
                  <div className="w-full h-40 relative mb-4">
                    <Image
                      src={avatar.imageUrl}
                      alt={`Image for ${item.name}`}
                      fill
                      data-ai-hint={avatar.imageHint}
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardTitle>{item.name}</CardTitle>
                <CardDescription className="text-primary font-semibold">{item.type}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Rss className="mr-2 h-4 w-4" />
                  {item.action}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
