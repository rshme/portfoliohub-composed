import type { User } from '../stores/auth'

/**
 * Mock users for quick demo access
 * These users allow easy testing of different roles in the application
 */
export const mockUsers: User[] = [
  // Demo Volunteer
  {
    id: 'user_volunteer_001',
    email: 'volunteer1@portfoliohub.com',
    name: 'Demo Volunteer',
    role: 'volunteer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoVolunteer',
    skills: ['JavaScript', 'TypeScript', 'Vue.js', 'React', 'Python', 'Node.js', 'Git'],
    bio: 'Demo volunteer account for testing purposes. Full-stack developer passionate about contributing to meaningful projects.',
    github: 'https://github.com/demovolunteer',
    linkedin: 'https://linkedin.com/in/demovolunteer',
    created_at: '2024-01-15T08:00:00.000Z'
  },
  // Demo Project Owner
  {
    id: 'user_creator_001',
    email: 'owner@portfoliohub.com',
    name: 'Demo Project Owner',
    role: 'project_owner',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoOwner',
    organization: 'Demo Organization',
    skills: ['Project Management', 'Product Strategy', 'Agile', 'Stakeholder Management'],
    bio: 'Demo project owner account for testing purposes. Project manager leading initiatives that use technology to solve social problems.',
    github: 'https://github.com/demoowner',
    linkedin: 'https://linkedin.com/in/demoowner',
    created_at: '2023-08-20T10:30:00.000Z'
  },
  // Demo Mentor
  {
    id: 'user_mentor_001',
    email: 'mentor@portfoliohub.com',
    name: 'Demo Mentor',
    role: 'mentor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoMentor',
    title: 'Senior Software Architect',
    organization: 'Demo Tech Inc.',
    skills: ['Software Architecture', 'System Design', 'Code Review', 'Team Leadership', 'Python', 'Java', 'Cloud Computing', 'DevOps'],
    expertise: ['Software Architecture', 'System Design', 'Code Review', 'Team Leadership', 'Python', 'Java', 'Cloud Computing', 'DevOps'],
    bio: 'Demo mentor account for testing purposes. Senior software architect passionate about mentoring the next generation of developers.',
    experience_years: 15,
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
 * Helper function to get user by ID
 */
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id)
}

/**
 * Helper function to get user by email
 */
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email)
}

/**
 * Helper function to get users by role
 */
export const getUsersByRole = (role: User['role']): User[] => {
  return mockUsers.filter(user => user.role === role)
}

/**
 * Password for all demo users
 * Use these credentials for quick demo access:
 * - Volunteer: volunteer1@portfoliohub.com / password123
 * - Project Owner: owner@portfoliohub.com / password123
 * - Mentor: mentor@portfoliohub.com / password123
 */
export const DEMO_PASSWORD = 'password123'
