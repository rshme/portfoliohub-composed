import type { Project } from '../stores/projects'

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Open Source Learning Platform',
    description: 'Building an interactive learning platform for programming Beginners with gamification features. This project aims to democratize coding education by providing free, high-quality resources with interactive challenges and real-time feedback.',
    creator: {
      id: 'user_creator_001',
      name: 'Sarah Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      organization: 'Tech For Good Foundation'
    },
    tags: ['JavaScript', 'React', 'Node.js', 'Education'],
    skills_required: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    volunteers_needed: 8,
    volunteers_joined: 6,
    status: 'in_progress',
    difficulty: 'Intermediate',
    duration_estimate: '3-6 months',
    github_url: 'https://github.com/techforgood/learning-platform',
    discord_url: 'https://discord.gg/learning-platform',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-09-28T15:30:00Z',
    gallery: [
      {
        id: 'img_1',
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
        caption: 'System Architecture Diagram',
        type: 'diagram'
      },
      {
        id: 'img_2',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        caption: 'User Interface Mockups',
        type: 'mockup'
      },
      {
        id: 'img_3',
        url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
        caption: 'Code Editor Preview',
        type: 'screenshot'
      },
      {
        id: 'img_4',
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        caption: 'Analytics Dashboard',
        type: 'screenshot'
      }
    ],
    milestones: [
      {
        id: 'milestone_1',
        title: 'User Authentication & Profile System',
        description: 'Complete user registration, login, and profile management features',
        due_date: '2024-02-28T23:59:59Z',
        status: 'completed',
        progress: 100
      },
      {
        id: 'milestone_2',
        title: 'Interactive Code Editor',
        description: 'Build in-browser code editor with syntax highlighting and execution',
        due_date: '2024-03-31T23:59:59Z',
        status: 'completed',
        progress: 100
      },
      {
        id: 'milestone_3',
        title: 'Challenge System & Gamification',
        description: 'Implement coding challenges with point system and leaderboards',
        due_date: '2024-10-15T23:59:59Z',
        status: 'in_progress',
        progress: 65
      },
      {
        id: 'milestone_4',
        title: 'Learning Paths & Progress Tracking',
        description: 'Create structured learning paths and track student progress',
        due_date: '2024-11-30T23:59:59Z',
        status: 'pending',
        progress: 15
      }
    ],
    volunteers: [
      {
        id: 'vol_1',
        user_id: 'user_volunteer_001',
        name: 'Alex Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        skills: ['JavaScript', 'TypeScript', 'Vue.js', 'React', 'Node.js'],
        joined_at: '2024-01-20T08:30:00Z',
        contribution_score: 245,
        status: 'active'
      },
      {
        id: 'vol_2',
        user_id: 'user_vol_002',
        name: 'Emma Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        skills: ['React', 'JavaScript', 'CSS', 'UI/UX'],
        joined_at: '2024-01-22T14:15:00Z',
        contribution_score: 198,
        status: 'active'
      },
      {
        id: 'vol_3',
        user_id: 'user_vol_003',
        name: 'James Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        skills: ['Node.js', 'MongoDB', 'Express', 'API Design'],
        joined_at: '2024-02-01T09:00:00Z',
        contribution_score: 187,
        status: 'active'
      },
      {
        id: 'vol_4',
        user_id: 'user_vol_004',
        name: 'Olivia Brown',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
        skills: ['React', 'TypeScript', 'Testing'],
        joined_at: '2024-02-10T11:30:00Z',
        contribution_score: 156,
        status: 'active'
      },
      {
        id: 'vol_5',
        user_id: 'user_vol_005',
        name: 'Liam Anderson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
        skills: ['JavaScript', 'Node.js', 'Docker'],
        joined_at: '2024-02-15T16:45:00Z',
        contribution_score: 134,
        status: 'active'
      },
      {
        id: 'vol_6',
        user_id: 'user_vol_006',
        name: 'Sophia Taylor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
        skills: ['MongoDB', 'Database Design', 'Node.js'],
        joined_at: '2024-08-01T10:20:00Z',
        contribution_score: 89,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_006',
        user_id: 'mentor_006',
        name: 'Lisa Chang',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        expertise: ['Node.js', 'React', 'MongoDB', 'Express.js', 'API Design'],
        assigned_at: '2024-01-18T12:00:00Z'
      }
    ],
    tasks: [
      {
        id: 'task_1',
        title: 'Implement JWT Authentication',
        description: 'Add JWT-based authentication system with refresh tokens',
        assigned_to: 'user_volunteer_001',
        assigned_to_name: 'Alex Johnson',
        status: 'completed',
        priority: 'high',
        tags: ['backend', 'security', 'authentication'],
        created_by: 'user_mentor_001',
        created_at: '2024-01-22T10:00:00Z',
        due_date: '2024-02-05T23:59:59Z'
      },
      {
        id: 'task_2',
        title: 'Design Challenge Card Component',
        description: 'Create reusable React component for displaying coding challenges with difficulty indicators',
        assigned_to: 'user_vol_002',
        assigned_to_name: 'Emma Davis',
        status: 'completed',
        priority: 'medium',
        tags: ['frontend', 'react', 'ui'],
        created_by: 'user_mentor_001',
        created_at: '2024-02-01T09:30:00Z',
        due_date: '2024-02-15T23:59:59Z'
      },
      {
        id: 'task_3',
        title: 'Build Code Execution API',
        description: 'Implement secure API endpoint for executing user-submitted code in isolated containers',
        assigned_to: 'user_vol_003',
        assigned_to_name: 'James Martinez',
        status: 'review',
        priority: 'high',
        tags: ['backend', 'api', 'security'],
        created_by: 'user_mentor_001',
        created_at: '2024-08-10T14:20:00Z',
        due_date: '2024-10-01T23:59:59Z'
      },
      {
        id: 'task_4',
        title: 'Create Leaderboard System',
        description: 'Design and implement real-time leaderboard with Redis caching',
        assigned_to: 'user_volunteer_001',
        assigned_to_name: 'Alex Johnson',
        status: 'in_progress',
        priority: 'medium',
        tags: ['backend', 'database', 'realtime'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-05T11:00:00Z',
        due_date: '2024-10-20T23:59:59Z'
      },
      {
        id: 'task_5',
        title: 'Implement Progress Dashboard',
        description: 'Build student progress tracking dashboard with charts and statistics',
        assigned_to: 'user_vol_002',
        assigned_to_name: 'Emma Davis',
        status: 'in_progress',
        priority: 'medium',
        tags: ['frontend', 'dashboard', 'visualization'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-12T16:45:00Z',
        due_date: '2024-11-01T23:59:59Z'
      },
      {
        id: 'task_6',
        title: 'Write API Documentation',
        description: 'Document all API endpoints using OpenAPI/Swagger specification',
        status: 'todo',
        priority: 'medium',
        tags: ['documentation', 'api'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-20T09:00:00Z',
        due_date: '2024-10-30T23:59:59Z'
      },
      {
        id: 'task_7',
        title: 'Setup CI/CD Pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: 'todo',
        priority: 'high',
        tags: ['devops', 'ci-cd', 'automation'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-25T13:30:00Z',
        due_date: '2024-11-15T23:59:59Z'
      },
      {
        id: 'task_8',
        title: 'Optimize Database Queries',
        description: 'Review and optimize slow database queries, add proper indexes',
        assigned_to: 'user_vol_006',
        assigned_to_name: 'Sophia Taylor',
        status: 'in_progress',
        priority: 'high',
        tags: ['database', 'performance', 'optimization'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-28T10:15:00Z',
        due_date: '2024-10-25T23:59:59Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Environmental Data Tracker',
    description: 'Python-based application to track and visualize environmental data for climate research. Collecting real-time data from IoT sensors and satellites to help researchers understand climate patterns and environmental changes.',
    creator: {
      id: 'user_creator_002',
      name: 'Dr. Emily Green',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmilyGreen',
      organization: 'Environmental Research Center'
    },
    tags: ['Python', 'Data Science', 'Machine Learning', 'Environment'],
    skills_required: ['Python', 'Pandas', 'Matplotlib', 'API Integration'],
    volunteers_needed: 6,
    volunteers_joined: 4,
    status: 'in_progress',
    difficulty: 'Intermediate',
    duration_estimate: '2-4 months',
    github_url: 'https://github.com/greendata/env-tracker',
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-09-27T12:00:00Z',
    milestones: [
      {
        id: 'milestone_e1',
        title: 'Data Collection Module',
        description: 'Build API integrations for collecting environmental data from various sources',
        due_date: '2024-03-15T23:59:59Z',
        status: 'completed',
        progress: 100
      },
      {
        id: 'milestone_e2',
        title: 'Data Processing Pipeline',
        description: 'Create automated pipeline for cleaning and processing raw environmental data',
        due_date: '2024-10-10T23:59:59Z',
        status: 'in_progress',
        progress: 75
      },
      {
        id: 'milestone_e3',
        title: 'Visualization Dashboard',
        description: 'Build interactive dashboard for visualizing environmental trends',
        due_date: '2024-11-20T23:59:59Z',
        status: 'pending',
        progress: 30
      }
    ],
    volunteers: [
      {
        id: 'vol_e1',
        user_id: 'user_volunteer_001',
        name: 'Alex Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        skills: ['Python', 'Data Science', 'API Integration'],
        joined_at: '2024-06-10T09:00:00Z',
        contribution_score: 167,
        status: 'active'
      },
      {
        id: 'vol_e2',
        user_id: 'user_vol_007',
        name: 'Noah Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah',
        skills: ['Python', 'Pandas', 'Data Analysis'],
        joined_at: '2024-02-15T11:20:00Z',
        contribution_score: 143,
        status: 'active'
      },
      {
        id: 'vol_e3',
        user_id: 'user_vol_008',
        name: 'Ava Moore',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava',
        skills: ['Python', 'Matplotlib', 'Data Visualization'],
        joined_at: '2024-03-01T14:30:00Z',
        contribution_score: 128,
        status: 'active'
      },
      {
        id: 'vol_e4',
        user_id: 'user_vol_009',
        name: 'Ethan Garcia',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
        skills: ['Machine Learning', 'Python', 'TensorFlow'],
        joined_at: '2024-08-20T10:45:00Z',
        contribution_score: 76,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_003',
        user_id: 'mentor_003',
        name: 'Raj Patel',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj',
        expertise: ['Machine Learning', 'Python', 'Data Analysis', 'TensorFlow'],
        assigned_at: '2024-02-01T13:00:00Z'
      }
    ],
    tasks: [
      {
        id: 'task_e1',
        title: 'Integrate Weather API',
        description: 'Connect to OpenWeather API and fetch historical climate data',
        assigned_to: 'user_volunteer_001',
        assigned_to_name: 'Alex Johnson',
        status: 'completed',
        priority: 'high',
        tags: ['python', 'api', 'integration'],
        created_by: 'user_mentor_001',
        created_at: '2024-06-12T09:30:00Z',
        due_date: '2024-07-01T23:59:59Z'
      },
      {
        id: 'task_e2',
        title: 'Build Data Cleaning Module',
        description: 'Create module to handle missing values and outliers in environmental data',
        assigned_to: 'user_vol_007',
        assigned_to_name: 'Noah Wilson',
        status: 'completed',
        priority: 'high',
        tags: ['python', 'data-processing'],
        created_by: 'user_mentor_001',
        created_at: '2024-07-05T10:15:00Z',
        due_date: '2024-08-15T23:59:59Z'
      },
      {
        id: 'task_e3',
        title: 'Create Temperature Trend Charts',
        description: 'Build interactive charts showing temperature trends over time using Plotly',
        assigned_to: 'user_vol_008',
        assigned_to_name: 'Ava Moore',
        status: 'in_progress',
        priority: 'medium',
        tags: ['visualization', 'python', 'plotly'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-01T11:00:00Z',
        due_date: '2024-10-15T23:59:59Z'
      },
      {
        id: 'task_e4',
        title: 'Implement ML Prediction Model',
        description: 'Build machine learning model to predict future environmental trends',
        assigned_to: 'user_vol_009',
        assigned_to_name: 'Ethan Garcia',
        status: 'in_progress',
        priority: 'high',
        tags: ['machine-learning', 'python', 'tensorflow'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-10T14:20:00Z',
        due_date: '2024-11-01T23:59:59Z'
      },
      {
        id: 'task_e5',
        title: 'Setup Data Export Feature',
        description: 'Allow users to export processed data in CSV and JSON formats',
        status: 'todo',
        priority: 'low',
        tags: ['feature', 'export', 'python'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-20T09:45:00Z',
        due_date: '2024-11-10T23:59:59Z'
      }
    ]
  },
  {
    id: '3',
    name: 'Community Health Mobile App',
    description: 'React Native mobile app to help communities track health metrics and connect with local healthcare providers.',
    creator: {
      id: 'user_creator_001',
      name: 'Sarah Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      organization: 'Tech For Good Foundation'
    },
    tags: ['React Native', 'Mobile Development', 'Healthcare', 'Community'],
    skills_required: ['React Native', 'JavaScript', 'Firebase', 'UI/UX Design'],
    volunteers_needed: 10,
    volunteers_joined: 7,
    status: 'in_progress',
    difficulty: 'Intermediate',
    duration_estimate: '4-8 months',
    github_url: 'https://github.com/healthconnect/mobile-app',
    discord_url: 'https://discord.gg/healthconnect',
    created_at: '2023-12-01T09:00:00Z',
    updated_at: '2024-01-19T16:45:00Z',
    milestones: [
      {
        id: 'milestone_h1',
        title: 'User Authentication System',
        description: 'Implement secure user authentication with Firebase',
        due_date: '2024-01-15T23:59:59Z',
        status: 'completed',
        progress: 100
      },
      {
        id: 'milestone_h2',
        title: 'Health Metrics Dashboard',
        description: 'Build interactive dashboard for tracking health metrics',
        due_date: '2024-10-30T23:59:59Z',
        status: 'in_progress',
        progress: 60
      }
    ],
    volunteers: [
      {
        id: 'vol_h1',
        user_id: 'user_volunteer_001',
        name: 'Alex Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        skills: ['JavaScript', 'React Native', 'Firebase'],
        joined_at: '2024-03-10T10:00:00Z',
        contribution_score: 178,
        status: 'active'
      },
      {
        id: 'vol_h2',
        user_id: 'user_vol_010',
        name: 'Isabella Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
        skills: ['React Native', 'UI/UX', 'Mobile Development'],
        joined_at: '2023-12-15T11:00:00Z',
        contribution_score: 203,
        status: 'active'
      },
      {
        id: 'vol_h3',
        user_id: 'user_vol_012',
        name: 'Charlotte Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte',
        skills: ['Flutter', 'Dart', 'Mobile Development', 'Firebase'],
        joined_at: '2024-01-05T09:30:00Z',
        contribution_score: 145,
        status: 'active'
      },
      {
        id: 'vol_h4',
        user_id: 'user_vol_002',
        name: 'Emma Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        skills: ['React', 'JavaScript', 'CSS', 'UI/UX'],
        joined_at: '2024-02-10T14:20:00Z',
        contribution_score: 112,
        status: 'active'
      },
      {
        id: 'vol_h5',
        user_id: 'user_vol_004',
        name: 'Olivia Brown',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
        skills: ['React', 'TypeScript', 'Testing'],
        joined_at: '2024-03-15T16:00:00Z',
        contribution_score: 98,
        status: 'active'
      },
      {
        id: 'vol_h6',
        user_id: 'user_vol_005',
        name: 'Liam Anderson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
        skills: ['JavaScript', 'Node.js', 'Docker'],
        joined_at: '2024-04-01T12:30:00Z',
        contribution_score: 87,
        status: 'active'
      },
      {
        id: 'vol_h7',
        user_id: 'user_vol_003',
        name: 'James Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        skills: ['Node.js', 'MongoDB', 'Express', 'API Design'],
        joined_at: '2024-04-15T10:45:00Z',
        contribution_score: 76,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_004',
        user_id: 'mentor_004',
        name: 'Emily Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        expertise: ['React Native', 'Mobile Architecture', 'iOS', 'Android'],
        assigned_at: '2023-12-05T14:00:00Z'
      }
    ],
    tasks: [
      {
        id: 'task_h1',
        title: 'Build Health Metrics Input Form',
        description: 'Create form components for users to input health data',
        assigned_to: 'user_volunteer_001',
        assigned_to_name: 'Alex Johnson',
        status: 'completed',
        priority: 'high',
        tags: ['frontend', 'react-native', 'forms'],
        created_by: 'user_mentor_001',
        created_at: '2024-03-12T09:00:00Z',
        due_date: '2024-04-15T23:59:59Z'
      },
      {
        id: 'task_h2',
        title: 'Implement Chart Components',
        description: 'Add data visualization charts for health metrics tracking',
        assigned_to: 'user_volunteer_001',
        assigned_to_name: 'Alex Johnson',
        status: 'in_progress',
        priority: 'medium',
        tags: ['frontend', 'visualization', 'charts'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-15T10:30:00Z',
        due_date: '2024-11-01T23:59:59Z'
      },
      {
        id: 'task_h3',
        title: 'Setup Push Notifications',
        description: 'Configure Firebase Cloud Messaging for health reminders',
        status: 'todo',
        priority: 'high',
        tags: ['firebase', 'notifications'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-20T11:00:00Z',
        due_date: '2024-10-31T23:59:59Z'
      }
    ]
  },
  {
    id: '4',
    name: 'Smart City Traffic Management',
    description: 'AI-powered traffic management system to optimize city traffic flow and reduce congestion.',
    creator: {
      id: 'user_creator_003',
      name: 'David Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidKim',
      organization: 'UrbanTech Solutions'
    },
    tags: ['Python', 'AI', 'IoT', 'Smart Cities'],
    skills_required: ['Python', 'TensorFlow', 'IoT', 'Data Analysis'],
    volunteers_needed: 12,
    volunteers_joined: 8,
    status: 'in_progress',
    difficulty: 'Advanced',
    duration_estimate: '6-12 months',
    github_url: 'https://github.com/urbantech/traffic-ai',
    discord_url: 'https://discord.gg/smartcity',
    created_at: '2023-11-15T14:00:00Z',
    updated_at: '2024-01-22T10:15:00Z',
    milestones: [],
    volunteers: [
      {
        id: 'vol_t1',
        user_id: 'user_vol_007',
        name: 'Noah Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah',
        skills: ['Python', 'Pandas', 'Data Analysis'],
        joined_at: '2024-01-10T09:15:00Z',
        contribution_score: 156,
        status: 'active'
      },
      {
        id: 'vol_t2',
        user_id: 'user_vol_009',
        name: 'Ethan Garcia',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
        skills: ['Machine Learning', 'Python', 'TensorFlow'],
        joined_at: '2024-01-15T14:30:00Z',
        contribution_score: 134,
        status: 'active'
      },
      {
        id: 'vol_t3',
        user_id: 'user_vol_008',
        name: 'Ava Moore',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava',
        skills: ['Python', 'Matplotlib', 'Data Visualization'],
        joined_at: '2024-02-01T11:00:00Z',
        contribution_score: 123,
        status: 'active'
      },
      {
        id: 'vol_t4',
        user_id: 'user_vol_014',
        name: 'Harper Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harper',
        skills: ['C++', 'Embedded Systems', 'IoT'],
        joined_at: '2024-02-20T16:45:00Z',
        contribution_score: 98,
        status: 'active'
      },
      {
        id: 'vol_t5',
        user_id: 'user_vol_003',
        name: 'James Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        skills: ['Node.js', 'MongoDB', 'Express', 'API Design'],
        joined_at: '2024-03-10T13:20:00Z',
        contribution_score: 87,
        status: 'active'
      },
      {
        id: 'vol_t6',
        user_id: 'user_vol_005',
        name: 'Liam Anderson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
        skills: ['JavaScript', 'Node.js', 'Docker'],
        joined_at: '2024-03-25T10:15:00Z',
        contribution_score: 76,
        status: 'active'
      },
      {
        id: 'vol_t7',
        user_id: 'user_volunteer_001',
        name: 'Alex Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        skills: ['JavaScript', 'TypeScript', 'Python'],
        joined_at: '2024-04-05T15:30:00Z',
        contribution_score: 65,
        status: 'active'
      },
      {
        id: 'vol_t8',
        user_id: 'user_vol_006',
        name: 'Sophia Taylor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
        skills: ['MongoDB', 'Database Design', 'Node.js'],
        joined_at: '2024-04-20T12:45:00Z',
        contribution_score: 54,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_003',
        user_id: 'mentor_003',
        name: 'Raj Patel',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj',
        expertise: ['Machine Learning', 'Python', 'TensorFlow', 'Data Analysis'],
        assigned_at: '2023-11-20T13:00:00Z'
      }
    ],
    tasks: [
      {
        id: 'task_t1',
        title: 'Design ML Model Architecture',
        description: 'Design neural network architecture for traffic prediction',
        status: 'todo',
        priority: 'high',
        tags: ['ml', 'architecture', 'design'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-15T10:00:00Z',
        due_date: '2024-11-30T23:59:59Z'
      }
    ]
  },
  {
    id: '5',
    name: 'Educational VR Classroom',
    description: 'Virtual reality platform for immersive online education experiences.',
    creator: {
      id: 'user_creator_004',
      name: 'Rachel Martinez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RachelMartinez',
      organization: 'EduVR Labs'
    },
    tags: ['Unity', 'VR', 'C#', 'Education'],
    skills_required: ['Unity', 'C#', 'VR Development', '3D Modeling'],
    volunteers_needed: 15,
    volunteers_joined: 6,
    status: 'open',
    difficulty: 'Advanced',
    duration_estimate: '8-15 months',
    github_url: 'https://github.com/eduvr/classroom',
    created_at: '2023-10-20T11:30:00Z',
    updated_at: '2024-01-15T09:20:00Z',
    milestones: [],
    volunteers: [
      {
        id: 'vol_vr1',
        user_id: 'user_vol_011',
        name: 'Mason Lee',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mason',
        skills: ['Angular', 'TypeScript', 'WebRTC'],
        joined_at: '2024-01-20T10:30:00Z',
        contribution_score: 145,
        status: 'active'
      },
      {
        id: 'vol_vr2',
        user_id: 'user_vol_012',
        name: 'Charlotte Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte',
        skills: ['Flutter', 'Dart', 'Mobile Development'],
        joined_at: '2024-02-05T14:15:00Z',
        contribution_score: 123,
        status: 'active'
      },
      {
        id: 'vol_vr3',
        user_id: 'user_vol_002',
        name: 'Emma Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        skills: ['React', 'JavaScript', 'CSS', 'UI/UX'],
        joined_at: '2024-02-20T11:45:00Z',
        contribution_score: 112,
        status: 'active'
      },
      {
        id: 'vol_vr4',
        user_id: 'user_vol_014',
        name: 'Harper Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harper',
        skills: ['C++', 'Embedded Systems', 'IoT'],
        joined_at: '2024-03-10T16:20:00Z',
        contribution_score: 98,
        status: 'active'
      },
      {
        id: 'vol_vr5',
        user_id: 'user_vol_004',
        name: 'Olivia Brown',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
        skills: ['React', 'TypeScript', 'Testing'],
        joined_at: '2024-03-25T13:00:00Z',
        contribution_score: 87,
        status: 'active'
      },
      {
        id: 'vol_vr6',
        user_id: 'user_volunteer_001',
        name: 'Alex Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        skills: ['JavaScript', 'TypeScript', 'Vue.js'],
        joined_at: '2024-04-10T09:30:00Z',
        contribution_score: 76,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_008',
        user_id: 'mentor_008',
        name: 'Maria Santos',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        expertise: ['UX Design', 'UI Design', 'Prototyping', 'User Research'],
        assigned_at: '2024-01-15T09:20:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '6',
    name: 'Sustainable Farming Assistant',
    description: 'Mobile app providing farmers with weather forecasts, crop recommendations, and market prices.',
    creator: {
      id: 'user_creator_005',
      name: 'Michael Brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelBrown',
      organization: 'AgriTech Collective'
    },
    tags: ['Flutter', 'Dart', 'Agriculture', 'Weather APIs'],
    skills_required: ['Flutter', 'Dart', 'API Integration', 'Mobile UI'],
    volunteers_needed: 7,
    volunteers_joined: 4,
    status: 'open',
    difficulty: 'Intermediate',
    duration_estimate: '3-5 months',
    github_url: 'https://github.com/agritech/farm-assistant',
    discord_url: 'https://discord.gg/agritech',
    created_at: '2024-01-05T13:45:00Z',
    updated_at: '2024-01-21T16:30:00Z',
    milestones: [],
    volunteers: [
      {
        id: 'vol_farm1',
        user_id: 'user_vol_012',
        name: 'Charlotte Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte',
        skills: ['Flutter', 'Dart', 'Mobile Development', 'Firebase'],
        joined_at: '2024-01-25T10:15:00Z',
        contribution_score: 134,
        status: 'active'
      },
      {
        id: 'vol_farm2',
        user_id: 'user_vol_010',
        name: 'Isabella Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
        skills: ['React Native', 'UI/UX', 'Mobile Development'],
        joined_at: '2024-02-10T14:30:00Z',
        contribution_score: 123,
        status: 'active'
      },
      {
        id: 'vol_farm3',
        user_id: 'user_vol_003',
        name: 'James Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        skills: ['Node.js', 'MongoDB', 'Express', 'API Design'],
        joined_at: '2024-02-25T11:45:00Z',
        contribution_score: 112,
        status: 'active'
      },
      {
        id: 'vol_farm4',
        user_id: 'user_vol_017',
        name: 'Logan Harris',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Logan',
        skills: ['Svelte', 'Node.js', 'Mapping APIs', 'GIS'],
        joined_at: '2024-03-15T13:20:00Z',
        contribution_score: 98,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_004',
        user_id: 'mentor_004',
        name: 'Emily Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        expertise: ['Flutter', 'Mobile Architecture', 'iOS', 'Android'],
        assigned_at: '2024-01-21T16:30:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '7',
    name: 'Mental Health Support Platform',
    description: 'Web platform connecting individuals with mental health professionals and support communities.',
    creator: {
      id: 'user_creator_001',
      name: 'Sarah Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      organization: 'Tech For Good Foundation'
    },
    tags: ['Vue.js', 'Node.js', 'PostgreSQL', 'Mental Health'],
    skills_required: ['Vue.js', 'Node.js', 'PostgreSQL', 'UI/UX'],
    volunteers_needed: 9,
    volunteers_joined: 9,
    status: 'completed',
    difficulty: 'Intermediate',
    duration_estimate: '4-7 months',
    github_url: 'https://github.com/mindcare/platform',
    discord_url: 'https://discord.gg/mindcare',
    created_at: '2023-08-10T10:00:00Z',
    updated_at: '2024-01-10T14:20:00Z',
    milestones: [
      {
        id: 'milestone_m1',
        title: 'Platform Launch',
        description: 'Launch complete platform with all core features',
        due_date: '2024-01-10T23:59:59Z',
        status: 'completed',
        progress: 100
      }
    ],
    volunteers: [
      {
        id: 'vol_m1',
        user_id: 'user_volunteer_001',
        name: 'Alex Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        skills: ['Vue.js', 'JavaScript', 'Node.js'],
        joined_at: '2023-08-15T09:00:00Z',
        contribution_score: 312,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_002',
        user_id: 'mentor_002',
        name: 'Dr. Sarah Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahW',
        expertise: ['Vue.js', 'JavaScript', 'TypeScript', 'UI/UX'],
        assigned_at: '2023-08-12T10:00:00Z'
      }
    ],
    tasks: [
      {
        id: 'task_m1',
        title: 'Build Chat System',
        description: 'Implement real-time chat between users and professionals',
        assigned_to: 'user_volunteer_001',
        assigned_to_name: 'Alex Johnson',
        status: 'completed',
        priority: 'high',
        tags: ['vue', 'realtime', 'websocket'],
        created_by: 'user_mentor_001',
        created_at: '2023-09-01T10:00:00Z',
        due_date: '2023-10-15T23:59:59Z'
      },
      {
        id: 'task_m2',
        title: 'Implement Appointment Booking',
        description: 'Create calendar-based booking system for professional consultations',
        assigned_to: 'user_volunteer_001',
        assigned_to_name: 'Alex Johnson',
        status: 'completed',
        priority: 'high',
        tags: ['vue', 'booking', 'calendar'],
        created_by: 'user_mentor_001',
        created_at: '2023-10-05T11:00:00Z',
        due_date: '2023-11-20T23:59:59Z'
      }
    ]
  },
  {
    id: '8',
    name: 'Blockchain Voting System',
    description: 'Secure and transparent voting platform using blockchain technology for elections.',
    creator: {
      id: 'user_creator_006',
      name: 'Jennifer Lee',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JenniferLee',
      organization: 'DemocracyTech'
    },
    tags: ['Solidity', 'Ethereum', 'React', 'Security'],
    skills_required: ['Solidity', 'Web3.js', 'React', 'Cryptography'],
    volunteers_needed: 11,
    volunteers_joined: 3,
    status: 'open',
    difficulty: 'Advanced',
    duration_estimate: '6-10 months',
    github_url: 'https://github.com/democracytech/voting',
    created_at: '2023-12-05T15:20:00Z',
    updated_at: '2024-01-17T11:45:00Z',
    milestones: [],
    volunteers: [
      {
        id: 'vol_bc1',
        user_id: 'user_vol_002',
        name: 'Emma Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        skills: ['React', 'JavaScript', 'CSS', 'UI/UX'],
        joined_at: '2024-01-20T09:30:00Z',
        contribution_score: 98,
        status: 'active'
      },
      {
        id: 'vol_bc2',
        user_id: 'user_vol_019',
        name: 'Jackson Lopez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jackson',
        skills: ['Go', 'React', 'Git APIs'],
        joined_at: '2024-02-05T11:15:00Z',
        contribution_score: 87,
        status: 'active'
      },
      {
        id: 'vol_bc3',
        user_id: 'user_vol_018',
        name: 'Evelyn Martin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evelyn',
        skills: ['Django', 'Python', 'Cybersecurity'],
        joined_at: '2024-02-20T14:45:00Z',
        contribution_score: 76,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_007',
        user_id: 'mentor_007',
        name: 'Alex Kim',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexK',
        expertise: ['Cybersecurity', 'Security Auditing', 'Network Security'],
        assigned_at: '2024-01-22T09:30:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '9',
    name: 'Language Learning Game',
    description: 'Gamified language learning app with interactive stories and speech recognition.',
    creator: {
      id: 'user_creator_007',
      name: 'Carlos Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosRodriguez',
      organization: 'LinguaPlay'
    },
    tags: ['Swift', 'iOS', 'Game Development', 'AI'],
    skills_required: ['Swift', 'iOS Development', 'Speech Recognition', 'Game Design'],
    volunteers_needed: 8,
    volunteers_joined: 5,
    status: 'in_progress',
    difficulty: 'Intermediate',
    duration_estimate: '5-8 months',
    github_url: 'https://github.com/linguaplay/game',
    discord_url: 'https://discord.gg/linguaplay',
    created_at: '2023-11-20T12:15:00Z',
    updated_at: '2024-01-23T13:30:00Z',
    milestones: [],
    volunteers: [
      {
        id: 'vol_lang1',
        user_id: 'user_vol_010',
        name: 'Isabella Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
        skills: ['React Native', 'UI/UX', 'Mobile Development'],
        joined_at: '2024-01-25T10:30:00Z',
        contribution_score: 145,
        status: 'active'
      },
      {
        id: 'vol_lang2',
        user_id: 'user_vol_012',
        name: 'Charlotte Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte',
        skills: ['Flutter', 'Dart', 'Mobile Development'],
        joined_at: '2024-02-10T14:15:00Z',
        contribution_score: 123,
        status: 'active'
      },
      {
        id: 'vol_lang3',
        user_id: 'user_vol_002',
        name: 'Emma Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        skills: ['React', 'JavaScript', 'CSS', 'UI/UX'],
        joined_at: '2024-02-25T11:45:00Z',
        contribution_score: 112,
        status: 'active'
      },
      {
        id: 'vol_lang4',
        user_id: 'user_vol_004',
        name: 'Olivia Brown',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
        skills: ['React', 'TypeScript', 'Testing'],
        joined_at: '2024-03-15T16:20:00Z',
        contribution_score: 98,
        status: 'active'
      },
      {
        id: 'vol_lang5',
        user_id: 'user_vol_009',
        name: 'Ethan Garcia',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
        skills: ['Machine Learning', 'Python', 'TensorFlow'],
        joined_at: '2024-04-01T13:30:00Z',
        contribution_score: 87,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_004',
        user_id: 'mentor_004',
        name: 'Emily Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        expertise: ['iOS', 'Swift', 'Mobile Architecture', 'SwiftUI'],
        assigned_at: '2024-01-24T16:30:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '10',
    name: 'Waste Management Tracker',
    description: 'IoT-based system to track waste collection and optimize recycling processes.',
    creator: {
      id: 'user_creator_008',
      name: 'Anna Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnnaWilson',
      organization: 'EcoTrack Systems'
    },
    tags: ['Arduino', 'Python', 'IoT', 'Data Visualization'],
    skills_required: ['Arduino', 'Python', 'MQTT', 'Grafana'],
    volunteers_needed: 6,
    volunteers_joined: 2,
    status: 'open',
    difficulty: 'Intermediate',
    duration_estimate: '3-6 months',
    github_url: 'https://github.com/ecotrack/waste-monitor',
    created_at: '2024-01-08T09:30:00Z',
    updated_at: '2024-01-19T10:45:00Z',
    milestones: [],
    volunteers: [
      {
        id: 'vol_waste1',
        user_id: 'user_vol_014',
        name: 'Harper Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Harper',
        skills: ['C++', 'Embedded Systems', 'IoT', 'Hardware Programming'],
        joined_at: '2024-01-25T11:15:00Z',
        contribution_score: 123,
        status: 'active'
      },
      {
        id: 'vol_waste2',
        user_id: 'user_vol_007',
        name: 'Noah Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah',
        skills: ['Python', 'Pandas', 'Data Analysis'],
        joined_at: '2024-02-10T14:30:00Z',
        contribution_score: 112,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_003',
        user_id: 'mentor_003',
        name: 'Raj Patel',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj',
        expertise: ['Python', 'Data Analysis', 'Machine Learning'],
        assigned_at: '2024-01-19T10:45:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '11',
    name: 'Remote Team Collaboration Tool',
    description: 'Web-based platform for remote teams with video calls, task management, and file sharing.',
    creator: {
      id: 'user_creator_001',
      name: 'Sarah Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      organization: 'Tech For Good Foundation'
    },
    tags: ['Angular', 'WebRTC', 'Node.js', 'Real-time'],
    skills_required: ['Angular', 'WebRTC', 'Socket.io', 'MongoDB'],
    volunteers_needed: 14,
    volunteers_joined: 10,
    status: 'in_progress',
    difficulty: 'Advanced',
    duration_estimate: '7-12 months',
    github_url: 'https://github.com/collabspace/platform',
    discord_url: 'https://discord.gg/collabspace',
    created_at: '2023-09-15T16:00:00Z',
    updated_at: '2024-01-24T15:20:00Z',
    milestones: [
      {
        id: 'milestone_c1',
        title: 'Video Call Integration',
        description: 'Integrate WebRTC for peer-to-peer video calls',
        due_date: '2024-11-15T23:59:59Z',
        status: 'in_progress',
        progress: 70
      }
    ],
    volunteers: [
      {
        id: 'vol_c1',
        user_id: 'user_volunteer_001',
        name: 'Alex Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        skills: ['JavaScript', 'Node.js', 'WebRTC'],
        joined_at: '2024-07-20T14:00:00Z',
        contribution_score: 134,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_001',
        user_id: 'mentor_001',
        name: 'Dr. Michael Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        expertise: ['Software Architecture', 'System Design', 'Cloud Computing'],
        assigned_at: '2023-09-20T12:00:00Z'
      }
    ],
    tasks: [
      {
        id: 'task_c1',
        title: 'Setup WebRTC Signaling Server',
        description: 'Build signaling server for WebRTC peer connections',
        assigned_to: 'user_volunteer_001',
        assigned_to_name: 'Alex Johnson',
        status: 'completed',
        priority: 'high',
        tags: ['webrtc', 'backend', 'nodejs'],
        created_by: 'user_mentor_001',
        created_at: '2024-07-22T09:00:00Z',
        due_date: '2024-08-30T23:59:59Z'
      },
      {
        id: 'task_c2',
        title: 'Implement Screen Sharing',
        description: 'Add screen sharing capability to video calls',
        assigned_to: 'user_volunteer_001',
        assigned_to_name: 'Alex Johnson',
        status: 'in_progress',
        priority: 'medium',
        tags: ['webrtc', 'frontend', 'video'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-10T11:00:00Z',
        due_date: '2024-11-10T23:59:59Z'
      }
    ]
  },
  {
    id: '12',
    name: 'Pet Adoption Platform',
    description: 'Platform connecting animal shelters with potential pet adopters.',
    creator: {
      id: 'user_creator_001',
      name: 'Sarah Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      organization: 'Tech For Good Foundation'
    },
    tags: ['React', 'Express.js', 'MongoDB', 'Animal Welfare'],
    skills_required: ['React', 'Express.js', 'MongoDB', 'Image Processing'],
    volunteers_needed: 5,
    volunteers_joined: 3,
    status: 'open',
    difficulty: 'Beginner',
    duration_estimate: '2-4 months',
    github_url: 'https://github.com/petconnect/adoption',
    discord_url: 'https://discord.gg/petconnect',
    created_at: '2024-01-12T14:20:00Z',
    updated_at: '2024-01-20T11:10:00Z',
    milestones: [
      {
        id: 'milestone_p1',
        title: 'MVP Launch',
        description: 'Launch minimum viable product with core features',
        due_date: '2024-11-30T23:59:59Z',
        status: 'in_progress',
        progress: 45
      }
    ],
    volunteers: [
      {
        id: 'vol_p1',
        user_id: 'user_volunteer_001',
        name: 'Alex Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        skills: ['React', 'JavaScript', 'MongoDB'],
        joined_at: '2024-05-10T13:00:00Z',
        contribution_score: 98,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_006',
        user_id: 'mentor_006',
        name: 'Lisa Chang',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        expertise: ['React', 'Express.js', 'MongoDB', 'Node.js'],
        assigned_at: '2024-01-16T13:20:00Z'
      }
    ],
    tasks: [
      {
        id: 'task_p1',
        title: 'Build Pet Listing Component',
        description: 'Create React component to display pet information with images',
        assigned_to: 'user_volunteer_001',
        assigned_to_name: 'Alex Johnson',
        status: 'completed',
        priority: 'high',
        tags: ['react', 'frontend', 'component'],
        created_by: 'user_creator_001',
        created_at: '2024-05-12T10:00:00Z',
        due_date: '2024-06-15T23:59:59Z'
      },
      {
        id: 'task_p2',
        title: 'Implement Search Filters',
        description: 'Add filtering by species, age, location, etc.',
        assigned_to: 'user_volunteer_001',
        assigned_to_name: 'Alex Johnson',
        status: 'in_progress',
        priority: 'medium',
        tags: ['react', 'filtering', 'search'],
        created_by: 'user_creator_001',
        created_at: '2024-09-05T14:00:00Z',
        due_date: '2024-10-30T23:59:59Z'
      }
    ]
  },
  {
    id: '13',
    name: 'Financial Literacy App',
    description: 'Educational app teaching financial literacy through interactive lessons and budgeting tools.',
    creator: {
      id: 'user_creator_009',
      name: 'Thomas Garcia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThomasGarcia',
      organization: 'MoneyWise'
    },
    tags: ['Kotlin', 'Android', 'Finance', 'Education'],
    skills_required: ['Kotlin', 'Android Development', 'Financial APIs', 'UI Design'],
    volunteers_needed: 7,
    volunteers_joined: 4,
    status: 'open',
    difficulty: 'Intermediate',
    duration_estimate: '4-6 months',
    github_url: 'https://github.com/moneywise/app',
    created_at: '2023-12-18T10:45:00Z',
    updated_at: '2024-01-16T09:15:00Z',
    milestones: [],
    volunteers: [
      {
        id: 'vol_fin1',
        user_id: 'user_vol_020',
        name: 'Abigail Gonzalez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Abigail',
        skills: ['Kotlin', 'Android Development', 'Financial APIs', 'Mobile UI'],
        joined_at: '2024-01-20T10:15:00Z',
        contribution_score: 134,
        status: 'active'
      },
      {
        id: 'vol_fin2',
        user_id: 'user_vol_012',
        name: 'Charlotte Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte',
        skills: ['Flutter', 'Dart', 'Mobile Development'],
        joined_at: '2024-02-05T14:30:00Z',
        contribution_score: 123,
        status: 'active'
      },
      {
        id: 'vol_fin3',
        user_id: 'user_vol_002',
        name: 'Emma Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        skills: ['React', 'JavaScript', 'CSS', 'UI/UX'],
        joined_at: '2024-02-20T11:45:00Z',
        contribution_score: 112,
        status: 'active'
      },
      {
        id: 'vol_fin4',
        user_id: 'user_vol_003',
        name: 'James Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        skills: ['Node.js', 'MongoDB', 'Express', 'API Design'],
        joined_at: '2024-03-10T16:00:00Z',
        contribution_score: 98,
        status: 'active'
      }
    ],
    mentors: [
      {
        id: 'mentor_004',
        user_id: 'mentor_004',
        name: 'Emily Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        expertise: ['Android', 'Kotlin', 'Mobile Architecture'],
        assigned_at: '2024-01-18T14:30:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '14',
    name: 'Music Streaming Analytics',
    description: 'Analytics platform for musicians to track streaming performance and audience engagement.',
    creator: {
      id: 'user_creator_010',
      name: 'Sophia Anderson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SophiaAnderson',
      organization: 'StreamAnalytics'
    },
    tags: ['Python', 'Django', 'Data Analysis', 'Music'],
    skills_required: ['Python', 'Django', 'Spotify API', 'Data Visualization'],
    volunteers_needed: 6,
    volunteers_joined: 6,
    status: 'completed',
    difficulty: 'Intermediate',
    duration_estimate: '3-5 months',
    github_url: 'https://github.com/streamanalytics/platform',
    discord_url: 'https://discord.gg/streamanalytics',
    created_at: '2023-07-20T13:30:00Z',
    updated_at: '2023-12-15T16:45:00Z',
    milestones: [],
    volunteers: [],
    mentors: [
      {
        id: 'mentor_005',
        user_id: 'mentor_005',
        name: 'James Thompson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        expertise: ['DevOps', 'CI/CD', 'Docker', 'Cloud Computing'],
        assigned_at: '2024-01-18T14:30:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '15',
    name: 'Smart Home Energy Monitor',
    description: 'IoT device and app to monitor and optimize home energy consumption.',
    creator: {
      id: 'user_creator_008',
      name: 'Anna Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnnaWilson',
      organization: 'EcoTrack Systems'
    },
    tags: ['Raspberry Pi', 'Python', 'IoT', 'Energy'],
    skills_required: ['Python', 'Raspberry Pi', 'MQTT', 'Hardware'],
    volunteers_needed: 8,
    volunteers_joined: 3,
    status: 'open',
    difficulty: 'Intermediate',
    duration_estimate: '4-7 months',
    github_url: 'https://github.com/energywise/monitor',
    created_at: '2024-01-03T11:20:00Z',
    updated_at: '2024-01-18T14:30:00Z',
    milestones: [],
    volunteers: [],
    mentors: [
      {
        id: 'mentor_003',
        user_id: 'mentor_003',
        name: 'Raj Patel',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj',
        expertise: ['Python', 'Data Analysis', 'Machine Learning'],
        assigned_at: '2024-01-22T12:15:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '16',
    name: 'Recipe Sharing Platform',
    description: 'Social platform for sharing recipes with community ratings and nutritional information.',
    creator: {
      id: 'user_creator_002',
      name: 'Dr. Emily Green',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmilyGreen',
      organization: 'Environmental Research Center'
    },
    tags: ['Next.js', 'PostgreSQL', 'Nutrition API', 'Social'],
    skills_required: ['Next.js', 'PostgreSQL', 'API Integration', 'UI/UX'],
    volunteers_needed: 9,
    volunteers_joined: 7,
    status: 'in_progress',
    difficulty: 'Intermediate',
    duration_estimate: '4-6 months',
    github_url: 'https://github.com/cookshare/platform',
    discord_url: 'https://discord.gg/cookshare',
    created_at: '2023-11-10T15:45:00Z',
    updated_at: '2024-01-22T12:15:00Z',
    milestones: [],
    volunteers: [],
    mentors: [
      {
        id: 'mentor_006',
        user_id: 'mentor_006',
        name: 'Lisa Chang',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        expertise: ['React', 'Node.js', 'PostgreSQL', 'API Design'],
        assigned_at: '2024-01-23T15:45:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '17',
    name: 'Disaster Response Coordination',
    description: 'Platform to coordinate disaster response efforts and resource allocation.',
    creator: {
      id: 'user_creator_003',
      name: 'David Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidKim',
      organization: 'UrbanTech Solutions'
    },
    tags: ['Vue.js', 'Firebase', 'Maps API', 'Emergency'],
    skills_required: ['Vue.js', 'Firebase', 'Google Maps API', 'Real-time Updates'],
    volunteers_needed: 13,
    volunteers_joined: 9,
    status: 'in_progress',
    difficulty: 'Advanced',
    duration_estimate: '6-9 months',
    github_url: 'https://github.com/reliefnet/coordination',
    discord_url: 'https://discord.gg/reliefnet',
    created_at: '2023-10-05T08:30:00Z',
    updated_at: '2024-01-25T10:00:00Z',
    milestones: [],
    volunteers: [],
    mentors: [
      {
        id: 'mentor_002',
        user_id: 'mentor_002',
        name: 'Dr. Sarah Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahW',
        expertise: ['Vue.js', 'JavaScript', 'TypeScript'],
        assigned_at: '2023-10-08T11:00:00Z'
      }
    ],
    tasks: [
      {
        id: 'task_d1',
        title: 'Setup Real-time Database Structure',
        description: 'Design Firebase database schema for real-time coordination',
        status: 'todo',
        priority: 'high',
        tags: ['firebase', 'database', 'architecture'],
        created_by: 'user_mentor_001',
        created_at: '2024-09-10T09:00:00Z',
        due_date: '2024-11-05T23:59:59Z'
      }
    ]
  },
  {
    id: '18',
    name: 'Fitness Tracking Wearable',
    description: 'Wearable device firmware and companion app for fitness tracking and health monitoring.',
    creator: {
      id: 'user_creator_004',
      name: 'Rachel Martinez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RachelMartinez',
      organization: 'EduVR Labs'
    },
    tags: ['C++', 'Embedded Systems', 'React Native', 'Health'],
    skills_required: ['C++', 'Embedded Programming', 'React Native', 'BLE'],
    volunteers_needed: 10,
    volunteers_joined: 4,
    status: 'open',
    difficulty: 'Advanced',
    duration_estimate: '8-12 months',
    github_url: 'https://github.com/fittech/wearable',
    created_at: '2023-12-12T14:15:00Z',
    updated_at: '2024-01-14T11:30:00Z',
    milestones: [],
    volunteers: [],
    mentors: [
      {
        id: 'mentor_004',
        user_id: 'mentor_004',
        name: 'Emily Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        expertise: ['React Native', 'Mobile Architecture'],
        assigned_at: '2024-01-25T17:00:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '19',
    name: 'Local Art Gallery Platform',
    description: 'Online platform for local artists to showcase and sell their artwork.',
    creator: {
      id: 'user_creator_005',
      name: 'Michael Brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelBrown',
      organization: 'AgriTech Collective'
    },
    tags: ['Ruby on Rails', 'PostgreSQL', 'Stripe', 'Art'],
    skills_required: ['Ruby on Rails', 'PostgreSQL', 'Payment Integration', 'Image Handling'],
    volunteers_needed: 6,
    volunteers_joined: 5,
    status: 'in_progress',
    difficulty: 'Intermediate',
    duration_estimate: '3-5 months',
    github_url: 'https://github.com/artconnect/gallery',
    discord_url: 'https://discord.gg/artconnect',
    created_at: '2024-01-01T12:00:00Z',
    updated_at: '2024-01-23T15:45:00Z',
    milestones: [],
    volunteers: [],
    mentors: [
      {
        id: 'mentor_008',
        user_id: 'mentor_008',
        name: 'Maria Santos',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        expertise: ['UI Design', 'UX Design', 'User Research'],
        assigned_at: '2024-01-23T15:45:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '20',
    name: 'Weather Prediction Model',
    description: 'Machine learning model for improved local weather predictions using historical data.',
    creator: {
      id: 'user_creator_006',
      name: 'Jennifer Lee',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JenniferLee',
      organization: 'DemocracyTech'
    },
    tags: ['Python', 'Machine Learning', 'TensorFlow', 'Weather'],
    skills_required: ['Python', 'TensorFlow', 'Data Science', 'Meteorology'],
    volunteers_needed: 8,
    volunteers_joined: 2,
    status: 'open',
    difficulty: 'Advanced',
    duration_estimate: '5-8 months',
    github_url: 'https://github.com/weatherai/prediction',
    created_at: '2023-11-25T09:45:00Z',
    updated_at: '2024-01-16T13:20:00Z',
    milestones: [],
    volunteers: [],
    mentors: [
      {
        id: 'mentor_003',
        user_id: 'mentor_003',
        name: 'Raj Patel',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj',
        expertise: ['Python', 'Machine Learning', 'TensorFlow', 'Data Science'],
        assigned_at: '2024-01-16T13:20:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '21',
    name: 'Elderly Care Companion App',
    description: 'Mobile app providing medication reminders, health monitoring, and emergency contacts for elderly care.',
    creator: {
      id: 'user_creator_007',
      name: 'Carlos Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosRodriguez',
      organization: 'LinguaPlay'
    },
    tags: ['Flutter', 'Firebase', 'Healthcare', 'Elderly Care'],
    skills_required: ['Flutter', 'Firebase', 'Health APIs', 'Accessibility'],
    volunteers_needed: 7,
    volunteers_joined: 6,
    status: 'in_progress',
    difficulty: 'Intermediate',
    duration_estimate: '4-6 months',
    github_url: 'https://github.com/carecompanion/app',
    discord_url: 'https://discord.gg/carecompanion',
    created_at: '2023-12-08T10:30:00Z',
    updated_at: '2024-01-21T14:15:00Z',
    milestones: [],
    volunteers: [],
    mentors: [
      {
        id: 'mentor_004',
        user_id: 'mentor_004',
        name: 'Emily Rodriguez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        expertise: ['Flutter', 'Mobile Architecture'],
        assigned_at: '2024-01-21T14:15:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '22',
    name: 'Open Source Documentation Tool',
    description: 'Collaborative documentation platform for open source projects with version control integration.',
    creator: {
      id: 'user_creator_009',
      name: 'Thomas Garcia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThomasGarcia',
      organization: 'MoneyWise'
    },
    tags: ['Go', 'React', 'Git Integration', 'Documentation'],
    skills_required: ['Go', 'React', 'Git API', 'Markdown Processing'],
    volunteers_needed: 9,
    volunteers_joined: 7,
    status: 'in_progress',
    difficulty: 'Advanced',
    duration_estimate: '6-10 months',
    github_url: 'https://github.com/docuforge/platform',
    discord_url: 'https://discord.gg/docuforge',
    created_at: '2023-09-30T15:20:00Z',
    updated_at: '2024-01-24T16:30:00Z',
    milestones: [],
    volunteers: [],
    mentors: [
      {
        id: 'mentor_001',
        user_id: 'mentor_001',
        name: 'Dr. Michael Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        expertise: ['Software Architecture', 'System Design', 'Code Review'],
        assigned_at: '2024-01-24T16:30:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '23',
    name: 'Community Garden Planner',
    description: 'Web app to help communities plan and manage shared garden spaces and crop rotation.',
    creator: {
      id: 'user_creator_010',
      name: 'Sophia Anderson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SophiaAnderson',
      organization: 'StreamAnalytics'
    },
    tags: ['Svelte', 'Node.js', 'GIS', 'Agriculture'],
    skills_required: ['Svelte', 'Node.js', 'Mapping APIs', 'Database Design'],
    volunteers_needed: 5,
    volunteers_joined: 3,
    status: 'open',
    difficulty: 'Beginner',
    duration_estimate: '2-4 months',
    github_url: 'https://github.com/greenthumb/planner',
    discord_url: 'https://discord.gg/greenthumb',
    created_at: '2024-01-14T11:45:00Z',
    updated_at: '2024-01-22T09:30:00Z',
    milestones: [],
    volunteers: [],
    mentors: [
      {
        id: 'mentor_006',
        user_id: 'mentor_006',
        name: 'Lisa Chang',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        expertise: ['Node.js', 'API Design', 'Database Design'],
        assigned_at: '2024-01-22T09:30:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '24',
    name: 'Cybersecurity Training Platform',
    description: 'Interactive platform for learning cybersecurity concepts through hands-on challenges.',
    creator: {
      id: 'user_creator_001',
      name: 'Sarah Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      organization: 'Tech For Good Foundation'
    },
    tags: ['Django', 'Python', 'Docker', 'Security'],
    skills_required: ['Django', 'Python', 'Docker', 'CTF Design'],
    volunteers_needed: 11,
    volunteers_joined: 5,
    status: 'open',
    difficulty: 'Advanced',
    duration_estimate: '7-11 months',
    github_url: 'https://github.com/securelearn/platform',
    created_at: '2023-10-15T13:15:00Z',
    updated_at: '2024-01-19T12:45:00Z',
    milestones: [],
    volunteers: [],
    mentors: [
      {
        id: 'mentor_007',
        user_id: 'mentor_007',
        name: 'Alex Kim',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexK',
        expertise: ['Cybersecurity', 'Security Auditing', 'Penetration Testing'],
        assigned_at: '2024-01-19T12:45:00Z'
      }
    ],
    tasks: []
  },
  {
    id: '25',
    name: 'Virtual Event Platform',
    description: 'Platform for hosting virtual conferences, workshops, and networking events.',
    creator: {
      id: 'user_creator_002',
      name: 'Dr. Emily Green',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EmilyGreen',
      organization: 'Environmental Research Center'
    },
    tags: ['Angular', 'WebRTC', 'Node.js', 'Video Streaming'],
    skills_required: ['Angular', 'WebRTC', 'Socket.io', 'Video Processing'],
    volunteers_needed: 12,
    volunteers_joined: 8,
    status: 'in_progress',
    difficulty: 'Advanced',
    duration_estimate: '8-14 months',
    github_url: 'https://github.com/virtualconnect/platform',
    discord_url: 'https://discord.gg/virtualconnect',
    created_at: '2023-08-25T14:30:00Z',
    updated_at: '2024-01-25T17:00:00Z',
    milestones: [],
    volunteers: [],
    mentors: [
      {
        id: 'mentor_002',
        user_id: 'mentor_002',
        name: 'Dr. Sarah Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahW',
        expertise: ['Angular', 'JavaScript', 'TypeScript', 'Web Performance'],
        assigned_at: '2024-01-25T17:00:00Z'
      }
    ],
    tasks: []
  }
]