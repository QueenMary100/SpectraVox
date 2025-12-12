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
import { MessageSquare } from 'lucide-react';

const guardianCommunityMembers = [
  {
    name: 'Dr. Sarah Davis',
    title: 'Developmental-Behavioral Pediatrician',
    description: 'Dr. Davis specializes in supporting the health and development of children with Down syndrome, offering expert medical guidance.',
    avatarId: 'community-avatar-1',
  },
  {
    name: 'David Chen',
    title: 'Special Education Advocate',
    description: 'With over 15 years of experience, David helps families navigate the education system and secure the best resources for their children.',
    avatarId: 'community-avatar-2',
  },
  {
    name: 'Maria Garcia',
    title: 'Speech-Language Pathologist',
    description: 'Maria focuses on creating effective communication strategies and exercises to help children with Down syndrome express themselves.',
    avatarId: 'community-avatar-3',
  },
  {
    name: 'Parent Support Network',
    title: 'Connect with Other Parents',
    description: 'A private group for parents to share experiences, ask questions, and support each other on their journey.',
    avatarId: 'login-hero',
  },
];

export default function GuardianCommunityPage() {
  return (
    <>
      <h1 className="text-lg font-semibold md:text-2xl font-headline">
        Guardian Support Network
      </h1>
      <p className="text-muted-foreground mb-6">
        Connect with experts and other parents who understand. You're not alone.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {guardianCommunityMembers.map((member) => {
          const avatar = PlaceHolderImages.find((p) => p.id === member.avatarId);
          return (
            <Card key={member.name} className="flex flex-col">
              <CardHeader className="items-center text-center">
                {avatar && (
                  <Image
                    src={avatar.imageUrl}
                    alt={`Portrait of ${member.name}`}
                    width={120}
                    height={120}
                    data-ai-hint={avatar.imageHint}
                    className="rounded-full w-32 h-32 object-cover border-4 border-primary/20 mb-4"
                  />
                )}
                <CardTitle>{member.name}</CardTitle>
                <CardDescription className="text-primary font-semibold">{member.title}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground text-center">
                  {member.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Connect
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
