/**
 * Mock Data Summary
 * 
 * Quick reference untuk melihat ringkasan integrasi antara users dan projects
 */

import { mockUsers, getUserById } from './mockUsers'
import { mockProjects } from './mockProjects'

/**
 * Get summary of a volunteer's involvement
 */
export const getVolunteerSummary = (userId: string) => {
  const user = getUserById(userId)
  if (!user || user.role !== 'volunteer') return null

  const involvedProjects = mockProjects.filter(project => 
    project.volunteers.some(v => v.user_id === userId)
  )

  const totalScore = involvedProjects.reduce((sum, project) => {
    const volunteer = project.volunteers.find(v => v.user_id === userId)
    return sum + (volunteer?.contribution_score || 0)
  }, 0)

  const totalTasks = involvedProjects.reduce((sum, project) => {
    return sum + project.tasks.filter(t => 
      t.assigned_to === userId && t.status === 'completed'
    ).length
  }, 0)

  return {
    user,
    projectCount: involvedProjects.length,
    totalScore,
    totalTasksCompleted: totalTasks,
    averageScore: involvedProjects.length > 0 ? Math.round(totalScore / involvedProjects.length) : 0,
    projects: involvedProjects.map(p => ({
      id: p.id,
      name: p.name,
      status: p.status,
      contributionScore: p.volunteers.find(v => v.user_id === userId)?.contribution_score || 0
    }))
  }
}

/**
 * Get summary of a project creator's projects
 */
export const getProjectCreatorSummary = (userId: string) => {
  const user = getUserById(userId)
  if (!user || user.role !== 'project_owner') return null

  const createdProjects = mockProjects.filter(project => 
    project.creator.id === userId
  )

  const totalVolunteers = createdProjects.reduce((sum, project) => 
    sum + project.volunteers.length, 0
  )

  const completedProjects = createdProjects.filter(p => p.status === 'completed').length
  const activeProjects = createdProjects.filter(p => 
    p.status === 'in_progress' || p.status === 'open'
  ).length

  return {
    user,
    projectCount: createdProjects.length,
    totalVolunteers,
    completedProjects,
    activeProjects,
    projects: createdProjects.map(p => ({
      id: p.id,
      name: p.name,
      status: p.status,
      volunteers: p.volunteers.length,
      volunteersNeeded: p.volunteers_needed,
      createdAt: p.created_at
    }))
  }
}

/**
 * Get summary of a mentor's involvement
 */
export const getMentorSummary = (userId: string) => {
  const user = getUserById(userId)
  if (!user || user.role !== 'mentor') return null

  const mentoredProjects = mockProjects.filter(project => 
    project.mentors.some(m => m.user_id === userId)
  )

  const totalVolunteers = mentoredProjects.reduce((sum, project) => 
    sum + project.volunteers.length, 0
  )

  const totalTasksCreated = mentoredProjects.reduce((sum, project) => {
    return sum + project.tasks.filter(t => t.created_by === userId).length
  }, 0)

  return {
    user,
    projectCount: mentoredProjects.length,
    totalVolunteersGuided: totalVolunteers,
    totalTasksCreated,
    projects: mentoredProjects.map(p => ({
      id: p.id,
      name: p.name,
      status: p.status,
      volunteers: p.volunteers.length,
      tasksCreated: p.tasks.filter(t => t.created_by === userId).length,
      assignedAt: p.mentors.find(m => m.user_id === userId)?.assigned_at
    }))
  }
}

/**
 * Print summaries for all mock users (for debugging)
 */
export const printAllSummaries = () => {
  console.log('=== MOCK DATA SUMMARY ===\n')

  // Volunteer Summary
  const volunteerSummary = getVolunteerSummary('user_volunteer_001')
  if (volunteerSummary) {
    console.log('📊 VOLUNTEER: Alex Johnson')
    console.log(`   Projects: ${volunteerSummary.projectCount}`)
    console.log(`   Total Score: ${volunteerSummary.totalScore}`)
    console.log(`   Tasks Completed: ${volunteerSummary.totalTasksCompleted}`)
    console.log(`   Projects: ${volunteerSummary.projects.map(p => p.name).join(', ')}`)
    console.log('')
  }

  // Project Creator Summary
  const creatorSummary = getProjectCreatorSummary('user_creator_001')
  if (creatorSummary) {
    console.log('📊 PROJECT CREATOR: Sarah Wilson')
    console.log(`   Projects Created: ${creatorSummary.projectCount}`)
    console.log(`   Total Volunteers: ${creatorSummary.totalVolunteers}`)
    console.log(`   Completed: ${creatorSummary.completedProjects}`)
    console.log(`   Active: ${creatorSummary.activeProjects}`)
    console.log(`   Projects: ${creatorSummary.projects.map(p => p.name).join(', ')}`)
    console.log('')
  }

  // Mentor Summary
  const mentorSummary = getMentorSummary('user_mentor_001')
  if (mentorSummary) {
    console.log('📊 MENTOR: Dr. Michael Chen')
    console.log(`   Projects Mentored: ${mentorSummary.projectCount}`)
    console.log(`   Volunteers Guided: ${mentorSummary.totalVolunteersGuided}`)
    console.log(`   Tasks Created: ${mentorSummary.totalTasksCreated}`)
    console.log(`   Projects: ${mentorSummary.projects.map(p => p.name).join(', ')}`)
    console.log('')
  }

  console.log('=========================')
}

// Export all helper functions
export {
  mockUsers,
  mockProjects,
  getUserById
}
