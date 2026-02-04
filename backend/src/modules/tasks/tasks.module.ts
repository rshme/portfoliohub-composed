import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectMentor } from '../projects/entities/project-mentor.entity';
import { ProjectVolunteer } from '../projects/entities/project-volunteer.entity';
import { User } from '../users/entities/user.entity';
import { TaskComment } from '../task-comments/entities/task-comment.entity';
import { Milestone } from '../milestones/entities/milestone.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      Project,
      ProjectMentor,
      ProjectVolunteer,
      User,
      TaskComment,
      Milestone,
    ]),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
