
import {
  FileText,
  BrainCircuit,
  MessageCircleQuestion,
  ClipboardCheck,
  Map,
  Timer,
  Camera,
  Sparkles,
  Bookmark,
  Folder,
  BarChart,
  BookOpen,
  Highlighter,
  type LucideIcon,
  ShieldCheck,
  UserCog,
} from 'lucide-react';

export interface Feature {
  date: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status: 'Launched' | 'In Development';
}

export const featuresData: Feature[] = [
  {
    date: 'August 15, 2025',
    title: 'Project Inception & Foundation',
    description: 'The idea for Wisdom was born. We laid down the technical foundation for a scalable, AI-powered learning platform.',
    icon: BookOpen,
    status: 'Launched',
  },
  {
    date: 'September 01, 2025',
    title: 'Core AI: Notes, Flashcards & Quizzes',
    description: 'The heart of Wisdom went live. Users could now generate comprehensive study notes, interactive flashcards, and personalized quizzes from any topic.',
    icon: FileText,
    status: 'Launched',
  },
  {
    date: 'September 15, 2025',
    title: 'Organizational Tools: Subjects',
    description: 'To help users organize their learning, we introduced the ability to create and categorize topics under different subjects.',
    icon: Folder,
    status: 'Launched',
  },
  {
    date: 'September 28, 2025',
    title: 'Study Plan & Kanban Board',
    description: 'We added the Study Plan, a Kanban-style board allowing users to manually add and visually track their study tasks from "To Do" to "Completed".',
    icon: ClipboardCheck,
    status: 'Launched',
  },
  {
    date: 'October 10, 2025',
    title: 'AI-Powered Study Roadmap',
    description: 'A major leap forward. Users can now input their entire syllabus and a target date to have AI generate a day-by-day study schedule for them.',
    icon: Map,
    status: 'Launched',
  },
  {
    date: 'October 22, 2025',
    title: 'Focus Tools: Pomodoro & Exam Timers',
    description: 'To boost productivity, we integrated the Pomodoro Timer for focused work sessions and an Exam Countdown timer to keep goals in sight.',
    icon: Timer,
    status: 'Launched',
  },
  {
    date: 'November 05, 2025',
    title: 'WisdomGPT & Capture the Answer',
    description: 'Our advanced AI features debuted. WisdomGPT provides a conversational tutor experience, while Capture allows users to get solutions from photos of problems.',
    icon: Sparkles,
    status: 'Launched',
  },
  {
    date: 'November 18, 2025',
    title: 'User Experience Boost: Bookmarks & Analytics',
    description: 'We refined the user experience by adding a bookmarking system for saving key topics and a personal analytics dashboard to track learning progress.',
    icon: BarChart,
    status: 'Launched',
  },
  {
    date: 'November 20, 2025',
    title: 'Mobile Enhancement: Click to Explain',
    description: 'To make the mobile experience more intuitive, we introduced a feature where tapping any sentence in the notes would instantly bring up an AI explanation.',
    icon: Highlighter,
    status: 'Launched',
  },
  {
    date: 'November 21, 2025',
    title: 'Wisdom 2.0 Launch',
    description: 'We are consolidating all our features into a refined, powerful, and cohesive platform, marking the official launch of Wisdom 2.0.',
    icon: BrainCircuit,
    status: 'Launched',
  },
  {
    date: 'December 05, 2025',
    title: 'Data Safety & Subscription Grace Period',
    description: 'Implemented a critical data safety fix to prevent any possibility of accidental data loss. Subscriptions now enter a 14-day grace period, ensuring users have time to renew without losing access to their valuable notes and materials.',
    icon: ShieldCheck,
    status: 'Launched',
  },
  {
    date: 'December 12, 2025',
    title: 'Advanced Profile Management',
    description: 'Enhanced the user profile page with new security and management features, including the ability for users to change their password and securely delete their account and all associated data.',
    icon: UserCog,
    status: 'Launched',
  },
];
