
import placeholderImages from '@/lib/placeholder-images.json';

export interface Story {
  slug: string;
  title: string;
  category: string;
  author: string;
  authorImage: string;
  location: string;
  image: {
    src: string;
    hint: string;
  };
  excerpt: string;
  fullStory: string;
}

export const storiesData: Story[] = [
  {
    slug: 'ap-exam-success',
    title: 'From Overwhelmed to Overachiever: A High Schooler’s Guide to Acing AP Exams',
    category: 'Student Success',
    author: 'Priya Sharma',
    authorImage: 'https://picsum.photos/seed/priya/100/100',
    location: 'Mumbai, India',
    image: placeholderImages.stories.story1,
    excerpt: 'Juggling three AP classes felt impossible until I discovered this AI study tool. The ability to instantly generate notes and quizzes for dense topics like Cellular Respiration saved me hours of manual work...',
    fullStory: `
<p>I was drowning in textbooks. With AP Biology, AP World History, and AP Calculus on my plate, my life was a constant cycle of reading, highlighting, and trying to memorize mountains of information. My notes were a chaotic mess, and I was starting to believe I had bitten off more than I could chew.</p>
<p>A friend recommended ScholarAI, and I was skeptical at first. An AI that does my studying for me? It sounded too good to be true. But I was desperate, so I gave it a shot. I started with my most dreaded topic: Cellular Respiration in AP Bio. I typed it in, and within seconds, I had a full set of structured notes, a list of key vocabulary with definitions, and a set of interactive flashcards.</p>
<h3>The Turning Point</h3>
<p>The difference was immediate. The AI-generated notes were organized with clear headings and summaries, making the complex process digestible. Instead of spending hours creating my own flashcards, I could immediately start practicing with the ones the app made. The quizzes were the real game-changer. They weren't just simple recall; they were challenging multiple-choice questions that mimicked the AP exam format, complete with explanations for each answer.</p>
<p>I started using it for all my subjects. For AP World History, it helped me connect themes and events across different eras. For Calculus, it broke down complex formulas and provided examples that finally made sense. I was no longer just memorizing; I was understanding.</p>
<h3>The Result</h3>
<p>When exam season arrived, I felt prepared, not panicked. I walked into each test with a quiet confidence I hadn't felt before. My scores reflected my new study method: a 5 in Biology, a 5 in World History, and a 4 in Calculus. ScholarAI didn't just save me time; it taught me how to study smarter, not harder.</p>
`,
  },
  {
    slug: 'parental-guidance-success',
    title: 'How My Son Went from C- Average to Dean’s List with AI-Powered Study Plans',
    category: 'Parental Guidance',
    author: 'David Chen',
    authorImage: 'https://picsum.photos/seed/david/100/100',
    location: 'Toronto, Canada',
    image: placeholderImages.stories.story2,
    excerpt: 'As a parent, seeing your child struggle is heartbreaking. The AI Roadmap feature created a day-by-day study plan for my son’s entire syllabus, giving him the structure he desperately needed...',
    fullStory: `
<p>Mark was smart, but he was disorganized. His backpack was a black hole of crumpled papers, and his study habits were nonexistent. He'd cram the night before a test and then forget everything a week later. His grades were suffering, hovering around a C-, and parent-teacher conferences were always stressful.</p>
<p>We tried everything: tutors, study groups, planners he never used. Nothing stuck. A colleague mentioned they were using an AI tool called ScholarAI with their daughter. The feature that caught my attention was the "Roadmap." I was intrigued.</p>
<h3>A Plan Takes Shape</h3>
<p>That evening, Mark and I sat down together. We gathered his syllabuses for his toughest subjects, Physics and English. We typed in the topics, his target exam dates, and how many hours he could realistically study each day. We clicked "Create My Plan," and what appeared was, frankly, a miracle.</p>
<p>It was a day-by-day, step-by-step plan. It broke down massive subjects into small, manageable chunks. "Monday: Read Chapter 3, Newton's Laws. Review flashcards for key terms. Tuesday: Complete 10 practice problems. Take AI-generated quiz on Chapter 3." It was clear, logical, and less intimidating than a 500-page textbook.</p>
<h3>Building Momentum</h3>
<p>For the first time, Mark had a clear path. He knew exactly what he had to do each day. The small, daily goals gave him a sense of accomplishment. He started using the AI-generated notes to supplement his class lectures and tested himself with the quizzes. His confidence grew with every completed task.</p>
<p>The results weren't instantaneous, but they were steady. His next report card showed B's. The one after that, mostly A's. Last month, he made the Dean's List. ScholarAI's Roadmap didn't just give him a study plan; it gave him the structure and confidence he needed to take control of his own learning.</p>
`,
  },
  {
    slug: 'mcat-exam-prep',
    title: 'Conquering the MCAT: How I Scored in the 98th Percentile Using AI Flashcards',
    category: 'Exam Preparation',
    author: 'Aisha Adebayo',
    authorImage: 'https://picsum.photos/seed/aisha/100/100',
    location: 'Lagos, Nigeria',
    image: placeholderImages.stories.story3,
    excerpt: 'The MCAT is a beast of an exam. The AI flashcards were a game-changer, allowing me to master thousands of key terms and concepts through active recall. The instant feedback was invaluable...',
    fullStory: `
<p>The MCAT isn't just an exam; it's a marathon of memorization and critical thinking. The sheer volume of content, from organic chemistry to sociology, is overwhelming. My biggest challenge was active recall—being able to pull information from my memory quickly and accurately under pressure.</p>
<p>I was making my own Anki decks, but it was taking up a huge chunk of my study time. I needed a more efficient way to drill the thousands of facts required. I found ScholarAI while searching for AI-powered study tools, and the automated flashcard generation seemed promising.</p>
<h3>Efficiency is Key</h3>
<p>I started by inputting high-yield topics from my MCAT prep books, like "Glycolysis" or "Erikson's stages of psychosocial development." Instantly, I had a deck of digital flashcards. The front had a term, and the back had a concise definition. It was exactly what I was doing manually, but it was instantaneous.</p>
<p>This freed up hours every week. I could spend that time actually *learning* the material, not just preparing it. I used the flashcard feature on my phone during my commute, in between classes, and whenever I had a spare 10 minutes. The repetition was incredibly effective. The app's interface was clean and simple, allowing for rapid-fire review sessions.</p>
<h3>Scoring High</h3>
<p>By the time my test date arrived, I had gone through thousands of AI-generated flashcards. Concepts that were once fuzzy were now crystal clear. I walked into the testing center feeling confident in my knowledge base. The result was a score of 522, placing me in the 98th percentile. For any pre-med student facing the MCAT mountain, I can't recommend this tool enough. The AI-powered flashcards were my secret weapon.</p>
`,
  },
  {
    slug: 'career-change-learning',
    title: 'Lifelong Learning: Mastering a New Skill for a Career Change at 45',
    category: 'Professional Development',
    author: 'Carlos Rossi',
    authorImage: 'https://picsum.photos/seed/carlos/100/100',
    location: 'São Paulo, Brazil',
    image: placeholderImages.stories.story4,
    excerpt: "Switching careers from finance to data science was daunting. This tool helped me grasp complex topics like machine learning algorithms by breaking them down into simple, understandable notes...",
    fullStory: `
<p>After 20 years in finance, I knew I needed a change. The world was moving towards data, and I wanted to be a part of it. I enrolled in an online Data Science bootcamp, but I quickly felt in over my head. The concepts were abstract, the mathematics were dense, and I was competing with learners half my age.</p>
<p>My biggest hurdle was translating theory into practice. I could watch a lecture on 'Gradient Descent' or 'Neural Networks', but the core ideas wouldn't stick. I needed a way to break these topics down into their fundamental parts.</p>
<h3>Making the Complex Simple</h3>
<p>I started using ScholarAI as a "translation" tool. After a particularly confusing lecture, I would input the topic into the app. The AI would generate notes that explained the concept from the ground up, often using analogies that made it click for me. The 'Core Concepts' section was my favorite; it was like having a patient professor explain everything one more time, just for me.</p>
<p>The 'Key Vocabulary' lists were also invaluable. Data science is filled with jargon, and the app helped me build a solid glossary of terms that I could refer back to anytime. It helped me speak the language of my new field with confidence.</p>
<h3>A New Beginning</h3>
<p>Six months later, I completed the bootcamp and landed my first job as a Junior Data Analyst. I still use ScholarAI to get up to speed on new libraries or techniques. It proved to me that it's never too late to learn something new, especially when you have the right tools to support you. It's an essential resource for any lifelong learner.</p>
`,
  },
  {
    slug: 'korean-exam-csat',
    title: 'Acing University entrance exams in Korea with AI-driven practice tests',
    category: 'Exam Preparation',
    author: 'Kim Min-jun',
    authorImage: 'https://picsum.photos/seed/minjun/100/100',
    location: 'Seoul, South Korea',
    image: placeholderImages.stories.story5,
    excerpt: 'The CSAT is notoriously difficult. I used the AI to generate endless practice quizzes on my weakest subjects. It helped me identify patterns in my mistakes and improve my score significantly...',
    fullStory: `
<p>In South Korea, your entire academic future can feel like it hinges on one day: the day of the CSAT (College Scholastic Ability Test). The pressure is immense. My weakest area was literature analysis; I struggled to understand the subtle themes and character motivations in the classic texts.</p>
<p>My hagwon (private academy) provided practice tests, but I needed more targeted practice. I needed to drill down into specific poems and novels that I found difficult. That's when I found ScholarAI.</p>
<h3>Endless, Targeted Practice</h3>
<p>I started by inputting the names of specific literary works, like "The Soil" by Yi Kwang-su. The AI didn't just give me notes; it generated multiple-choice quizzes that tested my comprehension of themes, symbolism, and character development. The questions were nuanced and challenging, just like on the real CSAT.</p>
<p>The best part was the instant feedback. When I got a question wrong, the AI provided a detailed explanation of why the correct answer was right and the others were wrong. This was a revelation. I began to see patterns in my thinking and understand the test-makers' logic. I generated dozens of quizzes for my weakest areas, effectively creating my own personalized practice exams.</p>
<h3>Confidence on Test Day</h3>
<p>By the time the real CSAT came, I had practiced so much that the literature section felt familiar. I could anticipate the types of questions and analyze the passages with a new level of confidence. My final score was high enough to get me into my first-choice university, SKY (Seoul National University). ScholarAI was instrumental in turning my greatest weakness into a strength.</p>
`,
  },
  {
    slug: 'homeschooling-ai-tutor',
    title: 'Homeschooling Made Easy: How We Use AI to Personalize Our Children’s Curriculum',
    category: 'Parental Guidance',
    author: 'Emily Miller',
    authorImage: 'https://picsum.photos/seed/emily/100/100',
    location: 'Perth, Australia',
    image: placeholderImages.stories.story6,
    excerpt: 'As homeschooling parents, creating engaging material is a full-time job. Now, we just input a topic, and the AI generates notes, activities, and quizzes tailored to each child’s learning pace...',
    fullStory: `
<p>Homeschooling our two children, aged 10 and 13, is incredibly rewarding, but it's also exhausting. Crafting lessons that are engaging and appropriate for their different age levels takes a huge amount of time. I was spending my nights and weekends planning curriculum instead of spending time with my family.</p>
<p>We needed a way to streamline the content creation process. My husband, a software developer, suggested we try an AI tool. We found ScholarAI, and it has completely revolutionized our homeschool.</p>
<h3>A Teacher's Assistant</h3>
<p>Now, our lesson planning is a collaborative process with the AI. If we're starting a unit on Ancient Egypt, I simply type "Ancient Egypt for a 10-year-old" into the app. I get a set of age-appropriate notes, fun facts, and a simple quiz. Then, I'll do another search for "Ancient Egyptian trade routes for a 13-year-old" and get more detailed content for my older son.</p>
<p>The AI acts as our tireless assistant. It generates the foundational material—the notes, the vocabulary, the key ideas—which frees me up to focus on the more creative aspects of teaching, like hands-on projects and discussions. The flashcards are great for quick reviews, and the kids love quizzing each other.</p>
<h3>More Time for What Matters</h3>
<p>We spend less time on tedious prep work and more time actually teaching and exploring subjects with our children. It's made our homeschool more dynamic, personalized, and, most importantly, more enjoyable for everyone. It's an indispensable tool for any homeschooling parent looking to save time and enrich their child's education.</p>
`,
  },
  {
    slug: 'shakespeare-ai-companion',
    title: 'Finally Understanding Shakespeare: An English Lit Student’s AI Companion',
    category: 'Student Success',
    author: 'Oliver Smith',
    authorImage: 'https://picsum.photos/seed/oliver/100/100',
    location: 'London, UK',
    image: placeholderImages.stories.story7,
    excerpt: 'Shakespearean language was like a different dialect. Explaining complex themes from "Macbeth" with the WisdomGPT AI tutor felt like having a personal professor available 24/7...',
    fullStory: `
<p>I love literature, but I've always struggled with Shakespeare. The language felt like a barrier I couldn't break through. Reading "Macbeth" for my A-Levels felt more like a chore than an exploration of a masterpiece. I could read the plot summaries, but I was missing the genius of the text itself.</p>
<p>My professor recommended using digital tools to supplement our reading. I stumbled upon ScholarAI and its AI chat feature, WisdomGPT. The description said it was like having a personal tutor, so I decided to ask it a question I was too embarrassed to ask in class.</p>
<h3>A 24/7 Tutor</h3>
<p>I typed, "Can you explain the 'dagger of the mind' soliloquy in simple terms?" The response I got was amazing. WisdomGPT broke down the speech line by line, explaining the archaic words and unpacking the complex psychological themes of guilt and ambition. It was clear, concise, and didn't make me feel stupid.</p>
<p>I started using WisdomGPT as my reading companion. Whenever I hit a confusing passage, I'd ask the AI to explain it. I asked it about themes, character motivations, and historical context. It was like having a personal Shakespeare scholar available 24/7, ready to answer any question without judgment.</p>
<h3>Deeper Understanding</h3>
<p>My essays became richer and more insightful because I was finally engaging with the text on a deeper level. I wasn't just regurgitating SparkNotes; I was forming my own interpretations, backed by a solid understanding of the language. I ended up getting an A on my "Macbeth" paper, and for the first time, I actually enjoyed reading Shakespeare.</p>
`,
  },
  {
    slug: 'computer-science-simplified',
    title: 'From Theory to Practice: A Computer Science Student’s Secret Weapon',
    category: 'Higher Education',
    author: 'Fatima Al-Jamil',
    authorImage: 'https://picsum.photos/seed/fatima/100/100',
    location: 'Dubai, UAE',
    image: placeholderImages.stories.story8,
    excerpt: 'Understanding data structures and algorithms is tough. The AI’s ability to generate step-by-step explanations and practical examples for concepts like Dijkstra’s algorithm was crucial for my success...',
    fullStory: `
<p>In computer science, there's a huge gap between knowing a theory and knowing how to implement it. My Data Structures and Algorithms class was notoriously difficult. We'd learn about concepts like "Dijkstra's Algorithm" or "Red-Black Trees" in lectures, but I struggled to visualize how they actually worked.</p>
<p>My textbook was dense and theoretical. I needed practical, step-by-step examples that I could understand and replicate. A senior student told me he used ScholarAI to help him get through the same course.</p>
<h3>Code and Concepts</h3>
<p>I tried it by typing "Dijkstra's Algorithm explained" into the app. The AI-generated notes were phenomenal. They didn't just define the algorithm; they included an 'Example' section with a sample graph and walked through the process step-by-step, showing how the distances and paths were updated. It was like watching the algorithm execute in slow motion.</p>
<p>The 'Key Formulas or Points' section often included pseudocode, which was a perfect bridge between the high-level theory and the actual code I needed to write for my assignments. I used it for every major topic in the course: sorting algorithms, tree traversals, dynamic programming. It consistently provided the clear, practical examples that my textbook lacked.</p>
<h3>Acing the Technical Interview</h3>
<p>This deep understanding was not only crucial for passing my exams but also for landing my first internship. In my technical interviews, I was able to confidently explain complex algorithms and walk through examples on a whiteboard. ScholarAI didn't just help me pass a class; it helped me build the foundational knowledge I needed for my career.</p>
`,
  },
];

export const getStoryBySlug = (slug: string) => {
    return storiesData.find(story => story.slug === slug);
}
