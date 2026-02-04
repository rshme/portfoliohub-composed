export interface Mentor {
  id: string
  name: string
  email: string
  avatar: string
  title: string
  organization: string
  expertise: string[]
  experience_years: number
  bio: string
  availability: 'available' | 'limited' | 'unavailable'
  max_mentees: number
  current_mentees: number
  projects_mentored: number
  rating: number
  total_reviews: number
  hourly_rate?: number
  languages: string[]
  timezone: string
  linkedin?: string
  github?: string
  created_at: string
}

/**
 * Mock mentors for quick demo
 * Only includes the demo mentor account
 */
export const mockMentors: Mentor[] = [
  {
    id: 'user_mentor_001',
    name: 'Demo Mentor',
    email: 'mentor@portfoliohub.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoMentor',
    title: 'Senior Software Architect',
    organization: 'Demo Tech Inc.',
    expertise: ['Software Architecture', 'System Design', 'Code Review', 'Team Leadership', 'Python', 'Java', 'Cloud Computing', 'DevOps'],
    experience_years: 15,
    bio: 'Demo mentor account for testing purposes. Senior software architect passionate about mentoring the next generation of developers.',
    availability: 'available',
    max_mentees: 5,
    current_mentees: 0,
    projects_mentored: 0,
    rating: 5.0,
    total_reviews: 0,
    languages: ['English'],
    timezone: 'UTC',
    github: 'https://github.com/demomentor',
    linkedin: 'https://linkedin.com/in/demomentor',
    created_at: '2023-05-10T14:00:00.000Z'
  }
]

/**
 * Helper function to get mentor by ID
 */
export const getMentorById = (id: string): Mentor | undefined => {
  return mockMentors.find(mentor => mentor.id === id)
}

/**
 * Helper function to get mentors by expertise
 */
export const getMentorsByExpertise = (expertise: string): Mentor[] => {
  return mockMentors.filter(mentor => 
    mentor.expertise.some(skill => 
      skill.toLowerCase().includes(expertise.toLowerCase())
    )
  )
}

/**
 * Helper function to get available mentors
 */
export const getAvailableMentors = (): Mentor[] => {
  return mockMentors.filter(mentor => mentor.availability === 'available')
}

/**
 * Helper function to get mentors by rating
 */
export const getTopRatedMentors = (minRating: number = 4.8): Mentor[] => {
  return mockMentors.filter(mentor => mentor.rating >= minRating)
}
