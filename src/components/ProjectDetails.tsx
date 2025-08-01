import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft, 
  Pencil, 
  Clock, 
  DollarSign, 
  Calendar,
  Target,
  Hammer,
  BookOpen
} from 'lucide-react'
import { Project } from '@/lib/store'
import MaterialsList from './MaterialsList'
import TutorialSteps from './TutorialSteps'

interface ProjectDetailsProps {
  project: Project
  onBack: () => void
  onEdit: (project: Project) => void
}

const statusConfig = {
  planning: { label: 'Planning', variant: 'secondary' as const, class: 'border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200' },
  'in-progress': { label: 'In Progress', variant: 'default' as const, class: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200' },
  completed: { label: 'Completed', variant: 'success' as const, class: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200' },
  'on-hold': { label: 'On Hold', variant: 'warning' as const, class: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200' },
}

const difficultyConfig = {
  beginner: { label: 'Beginner', class: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200' },
  intermediate: { label: 'Intermediate', class: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200' },
  advanced: { label: 'Advanced', class: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200' },
}

export default function ProjectDetails({ project, onBack, onEdit }: ProjectDetailsProps) {
  const statusInfo = statusConfig[project.status]
  const difficultyInfo = difficultyConfig[project.difficulty]
  
  const completedSteps = project.tutorialSteps.filter(step => step.completed).length
  const totalSteps = project.tutorialSteps.length
  const materialsPurchased = project.materials.filter(m => m.purchased).length
  const totalMaterials = project.materials.length
  const totalCost = project.materials.reduce((sum, m) => sum + (m.cost || 0), 0)
  const totalTime = project.tutorialSteps.reduce((sum, step) => sum + (step.estimatedTime || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </div>
        <Button onClick={() => onEdit(project)} className="flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Edit Project
        </Button>
      </div>

      {/* Project Overview */}
      <Card className="project-gradient">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <Badge className={statusInfo.class}>
                  {statusInfo.label}
                </Badge>
              </div>
              
              <p className="text-muted-foreground mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className={difficultyInfo.class}>
                  {difficultyInfo.label}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {project.estimatedTime}h estimated
                </Badge>
                <Badge variant="outline">
                  {project.category}
                </Badge>
              </div>
            </div>
            
            {project.imageUrl && (
              <div className="ml-6">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Overall Progress
                </span>
                <span className="text-sm text-muted-foreground">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-3" />
            </div>

            {/* Materials Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Hammer className="w-4 h-4" />
                  Materials
                </span>
                <span className="text-sm text-muted-foreground">
                  {materialsPurchased}/{totalMaterials}
                </span>
              </div>
              <Progress 
                value={totalMaterials > 0 ? (materialsPurchased / totalMaterials) * 100 : 0} 
                className="h-3" 
              />
            </div>

            {/* Steps Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Tutorial Steps
                </span>
                <span className="text-sm text-muted-foreground">
                  {completedSteps}/{totalSteps}
                </span>
              </div>
              <Progress 
                value={totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0} 
                className="h-3" 
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 rounded-lg bg-background">
              <div className="text-2xl font-bold text-primary">{totalMaterials}</div>
              <div className="text-sm text-muted-foreground">Materials</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background">
              <div className="text-2xl font-bold text-primary">{totalSteps}</div>
              <div className="text-sm text-muted-foreground">Steps</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background">
              <div className="text-2xl font-bold text-primary">${totalCost.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background">
              <div className="text-2xl font-bold text-primary">{Math.round(totalTime / 60)}h</div>
              <div className="text-sm text-muted-foreground">Est. Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials and Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaterialsList projectId={project.id} materials={project.materials} />
        <TutorialSteps projectId={project.id} steps={project.tutorialSteps} />
      </div>
    </div>
  )
}