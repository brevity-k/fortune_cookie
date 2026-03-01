export interface LearnSection {
  heading: string;
  paragraphs: string[];
}

export interface LearnPageData {
  title: string;
  subtitle: string;
  description: string; // for meta description
  keywords: string[];
  sections: LearnSection[];
  faqs: { q: string; a: string }[];
}
